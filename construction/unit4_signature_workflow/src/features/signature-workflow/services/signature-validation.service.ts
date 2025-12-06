import { injectable, inject } from 'tsyringe';
import { SignatureRepository } from '../repositories/signature.repository';
import { WorkflowStateRepository } from '../repositories/workflow-state.repository';
import { ReportManagementClient } from '../../../integrations/report-management/report-management.client';
import { UserManagementClient } from '../../../integrations/user-management/user-management.client';
import { SignatureType } from '../enums/signature-type.enum';
import { WorkflowStateEnum } from '../enums/workflow-state.enum';
import { ValidationResultDTO } from '../dtos/validation-result.dto';

/**
 * Signature Validation Service
 * 
 * Enforces signature business rules and validation logic.
 * Validates eligibility, completeness, and business constraints.
 */
@injectable()
export class SignatureValidationService {
  constructor(
    @inject(SignatureRepository) private signatureRepo: SignatureRepository,
    @inject(WorkflowStateRepository) private workflowStateRepo: WorkflowStateRepository,
    @inject(ReportManagementClient) private reportClient: ReportManagementClient,
    @inject(UserManagementClient) private userClient: UserManagementClient
  ) {}

  /**
   * Validate if user is eligible to sign
   * 
   * Checks:
   * - User is assigned to signature role
   * - Workflow is at correct state
   * - Signature hasn't already been recorded
   * - User hasn't signed in different role
   * 
   * @param reportId UUID of the report
   * @param userId UUID of the user
   * @param signatureType Type of signature
   * @returns Validation result
   */
  async validateSignatureEligibility(
    reportId: string,
    userId: string,
    signatureType: SignatureType
  ): Promise<ValidationResultDTO> {
    const errors: string[] = [];

    // Check if user is assigned to signature role
    const isAssigned = await this.userClient.validateUserRole(userId, reportId, signatureType);
    if (!isAssigned) {
      errors.push('You are not assigned to this signature role');
    }

    // Check workflow state
    const workflowValidation = await this.validateWorkflowState(reportId, signatureType);
    if (!workflowValidation.isValid) {
      errors.push(...workflowValidation.errors);
    }

    // Check if signature already exists
    const existingSignature = await this.signatureRepo.findByReportAndType(reportId, signatureType);
    if (existingSignature) {
      errors.push('This signature has already been recorded');
    }

    // Check if user has already signed this report in any role
    const allSignatures = await this.signatureRepo.findByReportId(reportId);
    const userAlreadySigned = allSignatures.some(sig => sig.signatoryUserId === userId);
    if (userAlreadySigned) {
      errors.push('You have already signed this report');
    }

    return errors.length > 0
      ? ValidationResultDTO.failure(errors)
      : ValidationResultDTO.success();
  }

  /**
   * Validate report completeness
   * 
   * Delegates to Report Management to check:
   * - All required fields completed
   * - All 7 checklist items answered
   * 
   * @param reportId UUID of the report
   * @returns Validation result
   */
  async validateReportCompleteness(reportId: string): Promise<ValidationResultDTO> {
    return await this.reportClient.validateReportCompleteness(reportId);
  }

  /**
   * Validate disclaimer acknowledgement
   * 
   * @param acknowledged Disclaimer acknowledgement flag
   * @returns Validation result
   */
  validateDisclaimerAcknowledgement(acknowledged: boolean): ValidationResultDTO {
    if (!acknowledged) {
      return ValidationResultDTO.failure(['You must acknowledge the disclaimer to proceed']);
    }
    return ValidationResultDTO.success();
  }

  /**
   * Validate signatory name
   * 
   * @param name Signatory name
   * @returns Validation result
   */
  validateSignatoryName(name: string): ValidationResultDTO {
    const errors: string[] = [];

    if (!name || name.trim().length === 0) {
      errors.push('Signatory name is required');
    }

    if (name.length > 100) {
      errors.push('Signatory name cannot exceed 100 characters');
    }

    return errors.length > 0
      ? ValidationResultDTO.failure(errors)
      : ValidationResultDTO.success();
  }

  /**
   * Validate workflow state matches expected signature type
   * 
   * Ensures previous signatures are completed before allowing next signature.
   * 
   * @param reportId UUID of the report
   * @param expectedSignatureType Expected signature type
   * @returns Validation result
   */
  async validateWorkflowState(
    reportId: string,
    expectedSignatureType: SignatureType
  ): Promise<ValidationResultDTO> {
    const workflowState = await this.workflowStateRepo.findByReportId(reportId);

    if (!workflowState) {
      return ValidationResultDTO.failure(['Report has not been submitted for signatures']);
    }

    // Map signature type to expected workflow state
    const expectedStates: Record<SignatureType, WorkflowStateEnum> = {
      [SignatureType.PREPARED_BY]: WorkflowStateEnum.PENDING_PREPARED_BY,
      [SignatureType.BRANCH_ACKNOWLEDGEMENT]: WorkflowStateEnum.PENDING_BRANCH_ACK,
      [SignatureType.NISD_ACKNOWLEDGEMENT]: WorkflowStateEnum.PENDING_NISD_ACK
    };

    const expectedState = expectedStates[expectedSignatureType];

    if (workflowState.currentState !== expectedState) {
      if (workflowState.currentState === WorkflowStateEnum.COMPLETED) {
        return ValidationResultDTO.failure(['This report has already been completed']);
      }
      return ValidationResultDTO.failure(['Previous signature step must be completed first']);
    }

    return ValidationResultDTO.success();
  }
}
