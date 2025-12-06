import { Repository } from 'typeorm';
import { injectable } from 'tsyringe';
import { AppDataSource } from '../../../database/data-source';
import { WorkflowState } from '../entities/workflow-state.entity';
import { WorkflowStateEnum } from '../enums/workflow-state.enum';
import { SignatureType } from '../enums/signature-type.enum';

/**
 * Workflow State Repository Interface
 */
export interface IWorkflowStateRepository {
  create(data: CreateWorkflowStateData): Promise<WorkflowState>;
  findById(workflowId: string): Promise<WorkflowState | null>;
  findByReportId(reportId: string): Promise<WorkflowState | null>;
  update(workflowId: string, updates: Partial<WorkflowState>): Promise<WorkflowState>;
  updateState(workflowId: string, newState: WorkflowStateEnum): Promise<WorkflowState>;
  linkSignature(workflowId: string, signatureType: SignatureType, signatureId: string): Promise<WorkflowState>;
}

/**
 * Data structure for creating a workflow state
 */
export interface CreateWorkflowStateData {
  reportId: string;
  currentState: WorkflowStateEnum;
  submittedAt?: Date;
}

/**
 * Workflow State Repository Implementation
 * 
 * Handles all database operations for WorkflowState entity.
 * Manages workflow state transitions and signature linkage.
 * 
 * PRODUCTION NOTES:
 * - Uses optimistic locking through updatedAt timestamp
 * - Unique constraint on reportId ensures one workflow per report
 * - Consider implementing pessimistic locking for high-concurrency scenarios
 * - Monitor for deadlocks during concurrent state updates
 */
@injectable()
export class WorkflowStateRepository implements IWorkflowStateRepository {
  private repository: Repository<WorkflowState>;

  constructor() {
    this.repository = AppDataSource.getRepository(WorkflowState);
  }

  /**
   * Create a new workflow state record
   * 
   * @param data Workflow state creation data
   * @returns Created workflow state
   * @throws Error if reportId already has a workflow
   */
  async create(data: CreateWorkflowStateData): Promise<WorkflowState> {
    const workflowState = this.repository.create(data);
    return await this.repository.save(workflowState);
  }

  /**
   * Find workflow state by ID
   * 
   * @param workflowId UUID of the workflow state
   * @returns Workflow state if found, null otherwise
   */
  async findById(workflowId: string): Promise<WorkflowState | null> {
    return await this.repository.findOne({
      where: { workflowId }
    });
  }

  /**
   * Find workflow state by report ID
   * 
   * Most commonly used query method
   * 
   * @param reportId UUID of the report
   * @returns Workflow state if found, null otherwise
   */
  async findByReportId(reportId: string): Promise<WorkflowState | null> {
    return await this.repository.findOne({
      where: { reportId }
    });
  }

  /**
   * Update workflow state fields
   * 
   * @param workflowId UUID of the workflow state
   * @param updates Partial workflow state updates
   * @returns Updated workflow state
   * @throws Error if workflow not found
   */
  async update(
    workflowId: string,
    updates: Partial<WorkflowState>
  ): Promise<WorkflowState> {
    await this.repository.update({ workflowId }, updates);
    
    const updated = await this.findById(workflowId);
    if (!updated) {
      throw new Error(`Workflow state ${workflowId} not found after update`);
    }
    
    return updated;
  }

  /**
   * Update workflow state
   * 
   * @param workflowId UUID of the workflow state
   * @param newState New workflow state
   * @returns Updated workflow state
   */
  async updateState(
    workflowId: string,
    newState: WorkflowStateEnum
  ): Promise<WorkflowState> {
    const updates: Partial<WorkflowState> = {
      currentState: newState
    };

    // Set completedAt timestamp when transitioning to COMPLETED
    if (newState === WorkflowStateEnum.COMPLETED) {
      updates.completedAt = new Date();
    }

    return await this.update(workflowId, updates);
  }

  /**
   * Link a signature to the workflow state
   * 
   * Updates the appropriate signature ID field based on signature type
   * 
   * @param workflowId UUID of the workflow state
   * @param signatureType Type of signature being linked
   * @param signatureId UUID of the signature
   * @returns Updated workflow state
   */
  async linkSignature(
    workflowId: string,
    signatureType: SignatureType,
    signatureId: string
  ): Promise<WorkflowState> {
    const updates: Partial<WorkflowState> = {};

    // Map signature type to appropriate field
    switch (signatureType) {
      case SignatureType.PREPARED_BY:
        updates.preparedBySignatureId = signatureId;
        break;
      case SignatureType.BRANCH_ACKNOWLEDGEMENT:
        updates.branchAckSignatureId = signatureId;
        break;
      case SignatureType.NISD_ACKNOWLEDGEMENT:
        updates.nisdAckSignatureId = signatureId;
        break;
    }

    return await this.update(workflowId, updates);
  }
}
