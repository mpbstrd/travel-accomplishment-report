import { WorkflowStateRepository } from '../../../src/features/signature-workflow/repositories/workflow-state.repository';
import { WorkflowState } from '../../../src/features/signature-workflow/entities/workflow-state.entity';
import { WorkflowStateEnum } from '../../../src/features/signature-workflow/enums/workflow-state.enum';
import { SignatureType } from '../../../src/features/signature-workflow/enums/signature-type.enum';
import { MockFactory } from '../../helpers/mock-factory';
import { TestDataBuilder } from '../../helpers/test-data-builder';

describe('WorkflowStateRepository', () => {
  let repository: WorkflowStateRepository;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = MockFactory.createMockRepository<WorkflowState>();
    repository = new WorkflowStateRepository();
    (repository as any).repository = mockRepository;
  });

  describe('create', () => {
    it('should create a new workflow state', async () => {
      const workflowData = {
        reportId: 'report-123',
        currentState: WorkflowStateEnum.DRAFT
      };

      const expectedWorkflow = TestDataBuilder.buildWorkflowState(workflowData);
      mockRepository.create.mockReturnValue(expectedWorkflow);
      mockRepository.save.mockResolvedValue(expectedWorkflow);

      const result = await repository.create(workflowData);

      expect(mockRepository.create).toHaveBeenCalledWith(workflowData);
      expect(mockRepository.save).toHaveBeenCalledWith(expectedWorkflow);
      expect(result).toEqual(expectedWorkflow);
    });
  });

  describe('findById', () => {
    it('should find workflow state by ID', async () => {
      const workflowId = 'wf-123';
      const expectedWorkflow = TestDataBuilder.buildWorkflowState({ workflowId });
      mockRepository.findOneBy.mockResolvedValue(expectedWorkflow);

      const result = await repository.findById(workflowId);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ workflowId });
      expect(result).toEqual(expectedWorkflow);
    });

    it('should return null if workflow not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('findByReportId', () => {
    it('should find workflow state by report ID', async () => {
      const reportId = 'report-123';
      const expectedWorkflow = TestDataBuilder.buildWorkflowState({ reportId });
      mockRepository.findOneBy.mockResolvedValue(expectedWorkflow);

      const result = await repository.findByReportId(reportId);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ reportId });
      expect(result).toEqual(expectedWorkflow);
    });

    it('should return null if workflow not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await repository.findByReportId('report-123');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update workflow state', async () => {
      const workflowId = 'wf-123';
      const updates = { currentState: WorkflowStateEnum.PENDING_PREPARED_BY };
      const existingWorkflow = TestDataBuilder.buildWorkflowState({ workflowId });
      const updatedWorkflow = { ...existingWorkflow, ...updates };

      mockRepository.findOneBy.mockResolvedValue(existingWorkflow);
      mockRepository.save.mockResolvedValue(updatedWorkflow);

      const result = await repository.update(workflowId, updates);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ workflowId });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result.currentState).toEqual(WorkflowStateEnum.PENDING_PREPARED_BY);
    });

    it('should throw error if workflow not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(repository.update('non-existent', {})).rejects.toThrow();
    });
  });

  describe('updateState', () => {
    it('should update workflow state', async () => {
      const workflowId = 'wf-123';
      const newState = WorkflowStateEnum.PENDING_BRANCH_ACK;
      const existingWorkflow = TestDataBuilder.buildWorkflowState({ 
        workflowId,
        currentState: WorkflowStateEnum.PENDING_PREPARED_BY
      });
      const updatedWorkflow = { ...existingWorkflow, currentState: newState };

      mockRepository.findOneBy.mockResolvedValue(existingWorkflow);
      mockRepository.save.mockResolvedValue(updatedWorkflow);

      const result = await repository.updateState(workflowId, newState);

      expect(result.currentState).toEqual(newState);
    });
  });

  describe('linkSignature', () => {
    it('should link PreparedBy signature to workflow', async () => {
      const workflowId = 'wf-123';
      const signatureId = 'sig-123';
      const existingWorkflow = TestDataBuilder.buildWorkflowState({ workflowId });
      const updatedWorkflow = { ...existingWorkflow, preparedBySignatureId: signatureId };

      mockRepository.findOneBy.mockResolvedValue(existingWorkflow);
      mockRepository.save.mockResolvedValue(updatedWorkflow);

      const result = await repository.linkSignature(workflowId, SignatureType.PREPARED_BY, signatureId);

      expect(result.preparedBySignatureId).toEqual(signatureId);
    });

    it('should link BranchAcknowledgement signature to workflow', async () => {
      const workflowId = 'wf-123';
      const signatureId = 'sig-456';
      const existingWorkflow = TestDataBuilder.buildWorkflowState({ workflowId });
      const updatedWorkflow = { ...existingWorkflow, branchAckSignatureId: signatureId };

      mockRepository.findOneBy.mockResolvedValue(existingWorkflow);
      mockRepository.save.mockResolvedValue(updatedWorkflow);

      const result = await repository.linkSignature(workflowId, SignatureType.BRANCH_ACKNOWLEDGEMENT, signatureId);

      expect(result.branchAckSignatureId).toEqual(signatureId);
    });

    it('should link NISDcknowledgement signature to workflow', async () => {
      const workflowId = 'wf-123';
      const signatureId = 'sig-789';
      const existingWorkflow = TestDataBuilder.buildWorkflowState({ workflowId });
      const updatedWorkflow = { ...existingWorkflow, nisdAckSignatureId: signatureId };

      mockRepository.findOneBy.mockResolvedValue(existingWorkflow);
      mockRepository.save.mockResolvedValue(updatedWorkflow);

      const result = await repository.linkSignature(workflowId, SignatureType.NISD_ACKNOWLEDGEMENT, signatureId);

      expect(result.nisdAckSignatureId).toEqual(signatureId);
    });
  });
});
