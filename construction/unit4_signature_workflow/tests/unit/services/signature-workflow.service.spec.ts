import { SignatureWorkflowService } from '../../../src/features/signature-workflow/services/signature-workflow.service';
import { SignatureType } from '../../../src/features/signature-workflow/enums/signature-type.enum';
import { WorkflowStateEnum } from '../../../src/features/signature-workflow/enums/workflow-state.enum';
import { TestDataBuilder } from '../../helpers/test-data-builder';
import { ValidationError } from '../../../src/shared/errors/validation-error';

describe('SignatureWorkflowService', () => {
  let service: SignatureWorkflowService;
  let mockSignatureRepository: any;
  let mockWorkflowStateRepository: any;
  let mockWorkflowStateService: any;
  let mockValidationService: any;
  let mockNotificationService: any;
  let mockReportManagementClient: any;

  beforeEach(() => {
    mockSignatureRepository = {
      create: jest.fn(),
      findByReportId: jest.fn(),
      findByReportAndType: jest.fn()
    };

    mockWorkflowStateRepository = {
      create: jest.fn(),
      findByReportId: jest.fn(),
      update: jest.fn()
    };

    mockWorkflowStateService = {
      getWorkflowState: jest.fn(),
      transitionWorkflowState: jest.fn(),
      getNextRequiredSignature: jest.fn(),
      isWorkflowComplete: jest.fn(),
      linkSignatureToWorkflow: jest.fn()
    };

    mockValidationService = {
      validateReportCompleteness: jest.fn(),
      validateSignatureEligibility: jest.fn()
    };

    mockNotificationService = {
      notifyNextSignatory: jest.fn(),
      notifyWorkflowComplete: jest.fn(),
      notifySignatureRecorded: jest.fn()
    };

    mockReportManagementClient = {
      updateReportStatus: jest.fn()
    };

    service = new SignatureWorkflowService();
    (service as any).signatureRepository = mockSignatureRepository;
    (service as any).workflowStateRepository = mockWorkflowStateRepository;
    (service as any).workflowStateService = mockWorkflowStateService;
    (service as any).validationService = mockValidationService;
    (service as any).notificationService = mockNotificationService;
    (service as any).reportManagementClient = mockReportManagementClient;
  });

  describe('submitForSignatures', () => {
    it('should submit report for signatures when valid', async () => {
      const reportId = 'report-123';
      const userId = 'user-123';

      mockValidationService.validateReportCompleteness.mockResolvedValue({
        isValid: true,
        errors: []
      });

      const workflowState = TestDataBuilder.buildWorkflowState({
        reportId,
        currentState: WorkflowStateEnum.PENDING_PREPARED_BY,
        submittedAt: new Date()
      });

      mockWorkflowStateRepository.create.mockResolvedValue(workflowState);
      mockNotificationService.notifyNextSignatory.mockResolvedValue(undefined);
      mockReportManagementClient.updateReportStatus.mockResolvedValue(undefined);

      const result = await service.submitForSignatures(reportId, userId);

      expect(result.currentState).toEqual(WorkflowStateEnum.PENDING_PREPARED_BY);
      expect(mockWorkflowStateRepository.create).toHaveBeenCalled();
      expect(mockNotificationService.notifyNextSignatory).toHaveBeenCalledWith(
        reportId,
        SignatureType.PREPARED_BY
      );
    });

    it('should throw ValidationError when report is incomplete', async () => {
      const reportId = 'report-123';
      const userId = 'user-123';

      mockValidationService.validateReportCompleteness.mockResolvedValue({
        isValid: false,
        errors: ['Report is incomplete']
      });

      await expect(service.submitForSignatures(reportId, userId)).rejects.toThrow(ValidationError);
    });
  });

  describe('getSignatureStatus', () => {
    it('should return comprehensive signature status', async () => {
      const reportId = 'report-123';
      const userId = 'user-123';

      const workflowState = TestDataBuilder.buildWorkflowState({
        reportId,
        currentState: WorkflowStateEnum.PENDING_BRANCH_ACK
      });

      const signatures = [
        TestDataBuilder.buildSignature({
          reportId,
          signatureType: SignatureType.PREPARED_BY
        })
      ];

      mockWorkflowStateService.getWorkflowState.mockResolvedValue(workflowState);
      mockSignatureRepository.findByReportId.mockResolvedValue(signatures);
      mockWorkflowStateService.getNextRequiredSignature.mockResolvedValue(
        SignatureType.BRANCH_ACKNOWLEDGEMENT
      );

      const result = await service.getSignatureStatus(reportId, userId);

      expect(result.workflowState).toEqual(workflowState);
      expect(result.signatures).toEqual(signatures);
      expect(result.nextRequired).toEqual(SignatureType.BRANCH_ACKNOWLEDGEMENT);
      expect(result.progress.completed).toBe(1);
      expect(result.progress.total).toBe(3);
    });
  });

  describe('getSignatureHistory', () => {
    it('should return all signatures for report', async () => {
      const reportId = 'report-123';
      const signatures = [
        TestDataBuilder.buildSignature({ reportId, signatureType: SignatureType.PREPARED_BY }),
        TestDataBuilder.buildSignature({ reportId, signatureType: SignatureType.BRANCH_ACKNOWLEDGEMENT })
      ];

      mockSignatureRepository.findByReportId.mockResolvedValue(signatures);

      const result = await service.getSignatureHistory(reportId);

      expect(result).toEqual(signatures);
      expect(mockSignatureRepository.findByReportId).toHaveBeenCalledWith(reportId);
    });
  });
});
