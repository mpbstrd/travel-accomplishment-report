import { injectable, inject } from 'tsyringe';
import { AppDataSource } from '../../../database/data-source';
import { SignatureRepository, CreateSignatureData } from '../repositories/signature.repository';
import { WorkflowStateRepository } from '../repositories/workflow-state.repository';
import { WorkflowStateService } from './workflow-state.service';
import { SignatureValidationService } from './signature-validation.service';
import { SignatureNotificationService } from './signature-notification.service';
import { ReportManagementClient } from '../../../integrations/report-management/report-management.client';
import { Signature } from '../entities/signature.entity';
import { WorkflowState } from '../entities/workflow-state.entity';
import { WorkflowStateEnum } from '../enums/workflow-state.enum';
import { SignatureType } from '../enums/signature-type.enum';
import { SignatureStatusDTO } from '../dtos/signature-status.dto';
import { RecordSignatureResultDTO } from '../dtos/record-signature-result.dto';
import { AvailableActionsDTO } from '../dtos/available-actions.dto';
import { ValidationError } from '../../../shared/errors/validation-error';
import { AuthorizationError } from '../../../shared/errors/authorization-error';
import { log } from '../../../shared/utils/logger';

/**
 * Signature Workflow Service
 * 
 * Main orchestration service for signature workflow operations.
 * Coordinates between repositories, validation, notifications, and external services.
 */
@injectable()
export class SignatureWorkflowService {
  constructor(
    @inject(SignatureRepository) private signatureRepo: SignatureRepository,
    @inject(WorkflowStateRepository) private workflowStateRepo: WorkflowStateRepository,
    @inject(WorkflowStateService) private workflowStateService: WorkflowStateService,
    @inject(SignatureValidationService) private validationService: SignatureValidationService,
    @inject(SignatureNotificationService) private notificationService: SignatureNotificationService,
    @inject(ReportManagementClient) private reportClient: ReportManagementClient
  ) {}

  /**
   * Submit report for signatures
   * 
   * Initiates the signature workflow by:
   * - Validating report completeness
   * - Creating workflow state record
   * - Updating report status
   * - Notifying first signatory
   * 
   * @param reportId UUID of the report
   * @param userId UUID of user submitting
   * @returns Created workflow state
   * @throws ValidationError if report incomplete
   */
  async submitForSignatures(reportId: string, userId: string): Promise<WorkflowState> {
    log.info('Submitting report for signatures', { reportId, userId });

    // Validate report completeness
    const completenessValidation = await this.validationService.validateReportCompleteness(reportId);
    if (!completenessValidation.isValid) {
      throw new ValidationError(
        'Report must be completed before submission',
        completenessValidation.errors
      );
    }

    // Create workflow state
    const workflowState = await this.workflowStateRepo.create({
      reportId,
      currentState: WorkflowStateEnum.PENDING_PREPARED_BY,
      submittedAt: new Date()
    });

    // Update report status
    await this.reportClient.updateReportStatus(reportId, 'Pending Signatures');

    // Notify first signatory
    await this.notificationService.notifyNextSignatory(reportId, SignatureType.PREPARED_BY);

    log.info('Report submitted successfully', { reportId, workflowId: workflowState.workflowId });

    return workflowState;
  }

  /**
   * Record a signature
   * 
   * Records a signature with full validation and state management:
   * - Validates signature eligibility
   * - Creates signature record
   * - Updates workflow state
   * - Links signature to workflow
   * - Triggers next notification
   * 
   * Uses database transaction for atomicity.
   * 
   * @param data Signature recording data
   * @returns Signature and updated workflow state
   * @throws AuthorizationError if user cannot sign
   * @throws ValidationError if validation fails
   */
  async recordSignature(data: RecordSignatureInput): Promise<RecordSignatureResultDTO> {
    log.info('Recording signature', { reportId: data.reportId, signatureType: data.signatureType });

    // Validate signature eligibility
    const eligibilityValidation = await this.validationService.validateSignatureEligibility(
      data.reportId,
      data.userId,
      data.signatureType
    );

    if (!eligibilityValidation.isValid) {
      throw new AuthorizationError(eligibilityValidation.errors.join('; '));
    }

    // Validate disclaimer and name
    const disclaimerValidation = this.validationService.validateDisclaimerAcknowledgement(
      data.disclaimerAcknowledged
    );
    if (!disclaimerValidation.isValid) {
      throw new ValidationError(disclaimerValidation.errors.join('; '));
    }

    const nameValidation = this.validationService.validateSignatoryName(data.signatoryName);
    if (!nameValidation.isValid) {
      throw new ValidationError(nameValidation.errors.join('; '));
    }

    // Use transaction for atomic operation
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create signature record
      const signatureData: CreateSignatureData = {
        reportId: data.reportId,
        signatureType: data.signatureType,
        signatoryName: data.signatoryName,
        signatoryUserId: data.userId,
        ipAddress: data.ipAddress,
        disclaimerAcknowledged: data.disclaimerAcknowledged
      };

      const signature = await this.signatureRepo.create(signatureData);

      // Get workflow state
      const workflowState = await this.workflowStateService.getWorkflowState(data.reportId);

      // Link signature to workflow
      await this.workflowStateService.linkSignatureToWorkflow(
        workflowState.workflowId,
        data.signatureType,
        signature.signatureId
      );

      // Transition workflow state
      const nextState = this.workflowStateService.getNextWorkflowState(data.signatureType);
      const updatedWorkflowState = await this.workflowStateService.transitionWorkflowState(
        data.reportId,
        nextState
      );

      // Commit transaction
      await queryRunner.commitTransaction();

      // Update report status
      const statusMap: Record<WorkflowStateEnum, string> = {
        [WorkflowStateEnum.DRAFT]: 'Draft',
        [WorkflowStateEnum.PENDING_PREPARED_BY]: 'Pending Prepared By',
        [WorkflowStateEnum.PENDING_BRANCH_ACK]: 'Pending Branch Acknowledgement',
        [WorkflowStateEnum.PENDING_NISD_ACK]: 'Pending NISD Acknowledgement',
        [WorkflowStateEnum.COMPLETED]: 'Completed'
      };
      await this.reportClient.updateReportStatus(data.reportId, statusMap[nextState]);

      // Send notifications (async, don't block)
      this.notificationService.notifySignatureRecorded(
        data.reportId,
        data.signatureType,
        data.signatoryName,
        data.userId
      );

      // Notify next signatory or send completion notification
      const nextSignature = await this.workflowStateService.getNextRequiredSignature(data.reportId);
      if (nextSignature) {
        this.notificationService.notifyNextSignatory(data.reportId, nextSignature);
      } else {
        this.notificationService.notifyWorkflowComplete(data.reportId);
      }

      log.info('Signature recorded successfully', {
        reportId: data.reportId,
        signatureId: signature.signatureId,
        nextState
      });

      // Build result
      const result: RecordSignatureResultDTO = {
        signature,
        workflowState: updatedWorkflowState,
        message: 'Signature recorded successfully',
        nextSignatureRequired: nextSignature
      };

      return result;
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      log.error('Failed to record signature', { reportId: data.reportId, error });
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Get signature status for a report
   * 
   * @param reportId UUID of the report
   * @param userId Optional user ID to check user-specific actions
   * @returns Comprehensive signature status
   */
  async getSignatureStatus(reportId: string, userId?: string): Promise<SignatureStatusDTO> {
    // Get workflow state
    const workflowState = await this.workflowStateService.getWorkflowState(reportId);

    // Get all signatures
    const signatures = await this.signatureRepo.findByReportId(reportId);

    // Get next required signature
    const nextRequired = await this.workflowStateService.getNextRequiredSignature(reportId);

    // Calculate progress
    const progress = {
      completed: signatures.length,
      total: 3
    };

    // Check if current user can sign
    let canCurrentUserSign = false;
    let currentUserSignatureType: SignatureType | null = null;

    if (userId && nextRequired) {
      const eligibility = await this.validationService.validateSignatureEligibility(
        reportId,
        userId,
        nextRequired
      );
      canCurrentUserSign = eligibility.isValid;
      if (canCurrentUserSign) {
        currentUserSignatureType = nextRequired;
      }
    }

    return {
      workflowState,
      signatures,
      nextRequired,
      progress,
      canCurrentUserSign,
      currentUserSignatureType
    };
  }

  /**
   * Get signature history for a report
   * 
   * @param reportId UUID of the report
   * @returns Array of signatures ordered chronologically
   */
  async getSignatureHistory(reportId: string): Promise<Signature[]> {
    return await this.signatureRepo.getSignatureHistory(reportId);
  }

  /**
   * Get available actions for a user on a report
   * 
   * @param reportId UUID of the report
   * @param userId UUID of the user
   * @returns Available actions
   */
  async getAvailableActions(reportId: string, userId: string): Promise<AvailableActionsDTO> {
    const nextRequired = await this.workflowStateService.getNextRequiredSignature(reportId);

    if (!nextRequired) {
      return {
        actions: [],
        canSign: false,
        signatureType: null,
        message: 'Workflow is complete'
      };
    }

    const eligibility = await this.validationService.validateSignatureEligibility(
      reportId,
      userId,
      nextRequired
    );

    if (eligibility.isValid) {
      return {
        actions: ['sign'],
        canSign: true,
        signatureType: nextRequired,
        message: `You can sign as ${nextRequired}`
      };
    }

    return {
      actions: [],
      canSign: false,
      signatureType: null,
      message: eligibility.errors.join('; ')
    };
  }
}

/**
 * Input data for recording a signature
 */
export interface RecordSignatureInput {
  reportId: string;
  signatureType: SignatureType;
  signatoryName: string;
  userId: string;
  disclaimerAcknowledged: boolean;
  ipAddress: string;
}
