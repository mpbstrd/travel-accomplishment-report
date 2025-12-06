import { WorkflowStateService } from '../../../src/features/signature-workflow/services/workflow-state.service';
import { WorkflowStateEnum } from '../../../src/features/signature-workflow/enums/workflow-state.enum';
import { SignatureType } from '../../../src/features/signature-workflow/enums/signature-type.enum';
import { TestDataBuilder } from '../../helpers/test-data-builder';
import { NotFoundError } from '../../../src/shared/errors/not-found-error';
import { ValidationError } from '../../../src/shared/errors/validation-error';

describe('WorkflowStateService', () => {
  let service: WorkflowStateService;
  let mockWorkflowStateRepository: any;
  let mockSignatureRepository: any;

  beforeEach(() => {
    mockWorkflowStateRepository = {
      findByReportId: jest.fn(),
      updateState: jest.fn(),
      linkSignature: jest.fn()
    };

    mockSignatureRepository = {
      findByReportId: jest.fn()
    };

    service = new WorkflowStateService();
    (service as any).workflowStateRepository = mockWorkflowStateRepository;
    (service as any).signatureRepository = mockSignatureRepository;
  });

  describe('getWorkflowState', () => {
    it('should return workflow state for valid report', async () => {
      const reportId = 'report-123';
      const workflowState = TestDataBuilder.buildWorkflowState({ reportId });
      mockWorkflowStateRepository.findByReportId.mockResolvedValue(workflowState);

      const result = await service.getWorkflowState(reportId);

      expect(mockWorkflowStateRepository.findByReportId).toHaveBeenCalledWith(reportId);
      expect(result).toEqual(workflowState);
    });

    it('should throw NotFoundError if workflow not found', async () => {
      mockWorkflowStateRepository.findByReportId.mockResolvedValue(null);

      await expect(service.getWorkflowState('report-123')).rejects.toThrow(NotFoundError);
    });
  });

  describe('validateStateTransition', () => {
    it('should allow DRAFT to PENDING_PREPARED_BY transition', () => {
      const result = service.validateStateTransition(
        WorkflowStateEnum.DRAFT,
        WorkflowStateEnum.PENDING_PREPARED_BY
      );
      expect(result).toBe(true);
    });

    it('should allow PENDING_PREPARED_BY to PENDING_BRANCH_ACK transition', () => {
      const result = service.validateStateTransition(
        WorkflowStateEnum.PENDING_PREPARED_BY,
        WorkflowStateEnum.PENDING_BRANCH_ACK
      );
      expect(result).toBe(true);
    });

    it('should allow PENDING_BRANCH_ACK to PENDING_NISD_ACK transition', () => {
      const result = service.validateStateTransition(
        WorkflowStateEnum.PENDING_BRANCH_ACK,
        WorkflowStateEnum.PENDING_NISD_ACK
      );
      expect(result).toBe(true);
    });

    it('should allow PENDING_NISD_ACK to COMPLETED transition', () => {
      const result = service.validateStateTransition(
        WorkflowStateEnum.PENDING_NISD_ACK,
        WorkflowStateEnum.COMPLETED
      );
      expect(result).toBe(true);
    });

    it('should not allow skipping states', () => {
      const result = service.validateStateTransition(
        WorkflowStateEnum.DRAFT,
        WorkflowStateEnum.PENDING_BRANCH_ACK
      );
      expect(result).toBe(false);
    });

    it('should not allow backward transitions', () => {
      const result = service.validateStateTransition(
        WorkflowStateEnum.PENDING_BRANCH_ACK,
        WorkflowStateEnum.PENDING_PREPARED_BY
      );
      expect(result).toBe(false);
    });

    it('should not allow transitions from COMPLETED', () => {
      const result = service.validateStateTransition(
        WorkflowStateEnum.COMPLETED,
        WorkflowStateEnum.DRAFT
      );
      expect(result).toBe(false);
    });
  });

  describe('transitionWorkflowState', () => {
    it('should transition workflow state when valid', async () => {
      const reportId = 'report-123';
      const currentWorkflow = TestDataBuilder.buildWorkflowState({
        reportId,
        currentState: WorkflowStateEnum.DRAFT
      });
      const updatedWorkflow = {
        ...currentWorkflow,
        currentState: WorkflowStateEnum.PENDING_PREPARED_BY
      };

      mockWorkflowStateRepository.findByReportId.mockResolvedValue(currentWorkflow);
      mockWorkflowStateRepository.updateState.mockResolvedValue(updatedWorkflow);

      const result = await service.transitionWorkflowState(
        reportId,
        WorkflowStateEnum.PENDING_PREPARED_BY
      );

      expect(result.currentState).toEqual(WorkflowStateEnum.PENDING_PREPARED_BY);
    });

    it('should throw ValidationError for invalid transition', async () => {
      const reportId = 'report-123';
      const currentWorkflow = TestDataBuilder.buildWorkflowState({
        reportId,
        currentState: WorkflowStateEnum.DRAFT
      });

      mockWorkflowStateRepository.findByReportId.mockResolvedValue(currentWorkflow);

      await expect(
        service.transitionWorkflowState(reportId, WorkflowStateEnum.PENDING_BRANCH_ACK)
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('getNextRequiredSignature', () => {
    it('should return PREPARED_BY for PENDING_PREPARED_BY state', async () => {
      const reportId = 'report-123';
      const workflowState = TestDataBuilder.buildWorkflowState({
        reportId,
        currentState: WorkflowStateEnum.PENDING_PREPARED_BY
      });
      mockWorkflowStateRepository.findByReportId.mockResolvedValue(workflowState);

      const result = await service.getNextRequiredSignature(reportId);

      expect(result).toEqual(SignatureType.PREPARED_BY);
    });

    it('should return BRANCH_ACKNOWLEDGEMENT for PENDING_BRANCH_ACK state', async () => {
      const reportId = 'report-123';
      const workflowState = TestDataBuilder.buildWorkflowState({
        reportId,
        currentState: WorkflowStateEnum.PENDING_BRANCH_ACK
      });
      mockWorkflowStateRepository.findByReportId.mockResolvedValue(workflowState);

      const result = await service.getNextRequiredSignature(reportId);

      expect(result).toEqual(SignatureType.BRANCH_ACKNOWLEDGEMENT);
    });

    it('should return NISD_ACKNOWLEDGEMENT for PENDING_NISD_ACK state', async () => {
      const reportId = 'report-123';
      const workflowState = TestDataBuilder.buildWorkflowState({
        reportId,
        currentState: WorkflowStateEnum.PENDING_NISD_ACK
      });
      mockWorkflowStateRepository.findByReportId.mockResolvedValue(workflowState);

      const result = await service.getNextRequiredSignature(reportId);

      expect(result).toEqual(SignatureType.NISD_ACKNOWLEDGEMENT);
    });

    it('should return null for COMPLETED state', async () => {
      const reportId = 'report-123';
      const workflowState = TestDataBuilder.buildWorkflowState({
        reportId,
        currentState: WorkflowStateEnum.COMPLETED
      });
      mockWorkflowStateRepository.findByReportId.mockResolvedValue(workflowState);

      const result = await service.getNextRequiredSignature(reportId);

      expect(result).toBeNull();
    });

    it('should return null for DRAFT state', async () => {
      const reportId = 'report-123';
      const workflowState = TestDataBuilder.buildWorkflowState({
        reportId,
        currentState: WorkflowStateEnum.DRAFT
      });
      mockWorkflowStateRepository.findByReportId.mockResolvedValue(workflowState);

      const result = await service.getNextRequiredSignature(reportId);

      expect(result).toBeNull();
    });
  });

  describe('isWorkflowComplete', () => {
    it('should return true for COMPLETED state', async () => {
      const reportId = 'report-123';
      const workflowState = TestDataBuilder.buildWorkflowState({
        reportId,
        currentState: WorkflowStateEnum.COMPLETED
      });
      mockWorkflowStateRepository.findByReportId.mockResolvedValue(workflowState);

      const result = await service.isWorkflowComplete(reportId);

      expect(result).toBe(true);
    });

    it('should return false for non-COMPLETED state', async () => {
      const reportId = 'report-123';
      const workflowState = TestDataBuilder.buildWorkflowState({
        reportId,
        currentState: WorkflowStateEnum.PENDING_PREPARED_BY
      });
      mockWorkflowStateRepository.findByReportId.mockResolvedValue(workflowState);

      const result = await service.isWorkflowComplete(reportId);

      expect(result).toBe(false);
    });
  });

  describe('linkSignatureToWorkflow', () => {
    it('should link signature to workflow', async () => {
      const workflowId = 'wf-123';
      const signatureId = 'sig-123';
      const signatureType = SignatureType.PREPARED_BY;
      const updatedWorkflow = TestDataBuilder.buildWorkflowState({
        workflowId,
        preparedBySignatureId: signatureId
      });

      mockWorkflowStateRepository.linkSignature.mockResolvedValue(updatedWorkflow);

      const result = await service.linkSignatureToWorkflow(workflowId, signatureType, signatureId);

      expect(mockWorkflowStateRepository.linkSignature).toHaveBeenCalledWith(
        workflowId,
        signatureType,
        signatureId
      );
      expect(result).toEqual(updatedWorkflow);
    });
  });
});
