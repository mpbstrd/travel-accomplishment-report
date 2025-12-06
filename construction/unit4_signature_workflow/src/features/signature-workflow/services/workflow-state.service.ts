import { injectable, inject } from 'tsyringe';
import { WorkflowStateRepository } from '../repositories/workflow-state.repository';
import { WorkflowState } from '../entities/workflow-state.entity';
import { WorkflowStateEnum } from '../enums/workflow-state.enum';
import { SignatureType } from '../enums/signature-type.enum';
import { NotFoundError } from '../../../shared/errors/not-found-error';
import { ValidationError } from '../../../shared/errors/validation-error';

/**
 * Workflow State Service
 * 
 * Manages workflow state transitions and validation.
 * Enforces sequential workflow progression through state machine rules.
 */
@injectable()
export class WorkflowStateService {
  constructor(
    @inject(WorkflowStateRepository) private workflowStateRepo: WorkflowStateRepository
  ) {}

  /**
   * Get workflow state for a report
   * 
   * @param reportId UUID of the report
   * @returns Workflow state
   * @throws NotFoundError if workflow doesn't exist
   */
  async getWorkflowState(reportId: string): Promise<WorkflowState> {
    const workflowState = await this.workflowStateRepo.findByReportId(reportId);
    
    if (!workflowState) {
      throw new NotFoundError(`Workflow state not found for report ${reportId}`);
    }
    
    return workflowState;
  }

  /**
   * Transition workflow to new state
   * 
   * Validates state transition before updating.
   * 
   * @param reportId UUID of the report
   * @param newState New workflow state
   * @returns Updated workflow state
   * @throws ValidationError if transition is invalid
   */
  async transitionWorkflowState(
    reportId: string,
    newState: WorkflowStateEnum
  ): Promise<WorkflowState> {
    const workflowState = await this.getWorkflowState(reportId);
    
    // Validate state transition
    if (!this.validateStateTransition(workflowState.currentState, newState)) {
      throw new ValidationError(
        `Invalid state transition from ${workflowState.currentState} to ${newState}`
      );
    }
    
    // Update state
    return await this.workflowStateRepo.updateState(workflowState.workflowId, newState);
  }

  /**
   * Validate state transition
   * 
   * Enforces valid state machine transitions:
   * DRAFT → PENDING_PREPARED_BY → PENDING_BRANCH_ACK → PENDING_NISD_ACK → COMPLETED
   * 
   * @param currentState Current workflow state
   * @param newState Proposed new state
   * @returns true if transition is valid, false otherwise
   */
  validateStateTransition(
    currentState: WorkflowStateEnum,
    newState: WorkflowStateEnum
  ): boolean {
    const validTransitions: Record<WorkflowStateEnum, WorkflowStateEnum[]> = {
      [WorkflowStateEnum.DRAFT]: [WorkflowStateEnum.PENDING_PREPARED_BY],
      [WorkflowStateEnum.PENDING_PREPARED_BY]: [WorkflowStateEnum.PENDING_BRANCH_ACK],
      [WorkflowStateEnum.PENDING_BRANCH_ACK]: [WorkflowStateEnum.PENDING_NISD_ACK],
      [WorkflowStateEnum.PENDING_NISD_ACK]: [WorkflowStateEnum.COMPLETED],
      [WorkflowStateEnum.COMPLETED]: [] // No transitions from completed
    };
    
    return validTransitions[currentState]?.includes(newState) || false;
  }

  /**
   * Get next required signature type based on current state
   * 
   * @param reportId UUID of the report
   * @returns Next signature type required, or null if workflow complete
   */
  async getNextRequiredSignature(reportId: string): Promise<SignatureType | null> {
    const workflowState = await this.getWorkflowState(reportId);
    
    const stateToSignatureMap: Record<WorkflowStateEnum, SignatureType | null> = {
      [WorkflowStateEnum.DRAFT]: null,
      [WorkflowStateEnum.PENDING_PREPARED_BY]: SignatureType.PREPARED_BY,
      [WorkflowStateEnum.PENDING_BRANCH_ACK]: SignatureType.BRANCH_ACKNOWLEDGEMENT,
      [WorkflowStateEnum.PENDING_NISD_ACK]: SignatureType.NISD_ACKNOWLEDGEMENT,
      [WorkflowStateEnum.COMPLETED]: null
    };
    
    return stateToSignatureMap[workflowState.currentState];
  }

  /**
   * Check if workflow is complete
   * 
   * @param reportId UUID of the report
   * @returns true if workflow is complete, false otherwise
   */
  async isWorkflowComplete(reportId: string): Promise<boolean> {
    const workflowState = await this.getWorkflowState(reportId);
    return workflowState.currentState === WorkflowStateEnum.COMPLETED;
  }

  /**
   * Link signature to workflow
   * 
   * @param workflowId UUID of the workflow state
   * @param signatureType Type of signature
   * @param signatureId UUID of the signature
   * @returns Updated workflow state
   */
  async linkSignatureToWorkflow(
    workflowId: string,
    signatureType: SignatureType,
    signatureId: string
  ): Promise<WorkflowState> {
    return await this.workflowStateRepo.linkSignature(workflowId, signatureType, signatureId);
  }

  /**
   * Get next workflow state based on signature type
   * 
   * @param signatureType Type of signature just recorded
   * @returns Next workflow state
   */
  getNextWorkflowState(signatureType: SignatureType): WorkflowStateEnum {
    const signatureToStateMap: Record<SignatureType, WorkflowStateEnum> = {
      [SignatureType.PREPARED_BY]: WorkflowStateEnum.PENDING_BRANCH_ACK,
      [SignatureType.BRANCH_ACKNOWLEDGEMENT]: WorkflowStateEnum.PENDING_NISD_ACK,
      [SignatureType.NISD_ACKNOWLEDGEMENT]: WorkflowStateEnum.COMPLETED
    };
    
    return signatureToStateMap[signatureType];
  }
}
