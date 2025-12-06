import { SignatureValidationService } from '../../../src/features/signature-workflow/services/signature-validation.service';
import { SignatureType } from '../../../src/features/signature-workflow/enums/signature-type.enum';
import { WorkflowStateEnum } from '../../../src/features/signature-workflow/enums/workflow-state.enum';
import { TestDataBuilder } from '../../helpers/test-data-builder';

describe('SignatureValidationService', () => {
  let service: SignatureValidationService;
  let mockSignatureRepository: any;
  let mockWorkflowStateRepository: any;
  let mockReportManagementClient: any;
  let mockUserManagementClient: any;

  beforeEach(() => {
    mockSignatureRepository = {
      findByReportAndType: jest.fn(),
      findByReportId: jest.fn()
    };

    mockWorkflowStateRepository = {
      findByReportId: jest.fn()
    };

    mockReportManagementClient = {
      getReport: jest.fn(),
      validateReportCompleteness: jest.fn(),
      getAssignedSignatory: jest.fn()
    };

    mockUserManagementClient = {
      getUser: jest.fn()
    };

    service = new SignatureValidationService();
    (service as any).signatureRepository = mockSignatureRepository;
    (service as any).workflowStateRepository = mockWorkflowStateRepository;
    (service as any).reportManagementClient = mockReportManagementClient;
    (service as any).userManagementClient = mockUserManagementClient;
  });

  describe('validateDisclaimerAcknowledgement', () => {
    it('should return valid when disclaimer is acknowledged', () => {
      const result = service.validateDisclaimerAcknowledgement(true);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid when disclaimer is not acknowledged', () => {
      const result = service.validateDisclaimerAcknowledgement(false);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Disclaimer must be acknowledged');
    });
  });

  describe('validateSignatoryName', () => {
    it('should return valid for valid name', () => {
      const result = service.validateSignatoryName('John Doe');

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid for empty name', () => {
      const result = service.validateSignatoryName('');

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Signatory name is required');
    });

    it('should return invalid for name exceeding 100 characters', () => {
      const longName = 'a'.repeat(101);
      const result = service.validateSignatoryName(longName);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Signatory name must not exceed 100 characters');
    });

    it('should return valid for name with exactly 100 characters', () => {
      const name = 'a'.repeat(100);
      const result = service.validateSignatoryName(name);

      expect(result.isValid).toBe(true);
    });
  });

  describe('validateWorkflowState', () => {
    it('should return valid when workflow state matches expected signature type', async () => {
      const reportId = 'report-123';
      const workflowState = TestDataBuilder.buildWorkflowState({
        reportId,
        currentState: WorkflowStateEnum.PENDING_PREPARED_BY
      });
      mockWorkflowStateRepository.findByReportId.mockResolvedValue(workflowState);

      const result = await service.validateWorkflowState(reportId, SignatureType.PREPARED_BY);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid when workflow state does not match expected signature type', async () => {
      const reportId = 'report-123';
      const workflowState = TestDataBuilder.buildWorkflowState({
        reportId,
        currentState: WorkflowStateEnum.PENDING_PREPARED_BY
      });
      mockWorkflowStateRepository.findByReportId.mockResolvedValue(workflowState);

      const result = await service.validateWorkflowState(reportId, SignatureType.BRANCH_ACKNOWLEDGEMENT);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should return invalid when workflow is in DRAFT state', async () => {
      const reportId = 'report-123';
      const workflowState = TestDataBuilder.buildWorkflowState({
        reportId,
        currentState: WorkflowStateEnum.DRAFT
      });
      mockWorkflowStateRepository.findByReportId.mockResolvedValue(workflowState);

      const result = await service.validateWorkflowState(reportId, SignatureType.PREPARED_BY);

      expect(result.isValid).toBe(false);
    });

    it('should return invalid when workflow is COMPLETED', async () => {
      const reportId = 'report-123';
      const workflowState = TestDataBuilder.buildWorkflowState({
        reportId,
        currentState: WorkflowStateEnum.COMPLETED
      });
      mockWorkflowStateRepository.findByReportId.mockResolvedValue(workflowState);

      const result = await service.validateWorkflowState(reportId, SignatureType.PREPARED_BY);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Workflow is already completed');
    });
  });

  describe('validateSignatureEligibility', () => {
    it('should return valid when all conditions are met', async () => {
      const reportId = 'report-123';
      const userId = 'user-123';
      const signatureType = SignatureType.PREPARED_BY;

      const workflowState = TestDataBuilder.buildWorkflowState({
        reportId,
        currentState: WorkflowStateEnum.PENDING_PREPARED_BY
      });

      mockWorkflowStateRepository.findByReportId.mockResolvedValue(workflowState);
      mockSignatureRepository.findByReportAndType.mockResolvedValue(null);
      mockSignatureRepository.findByReportId.mockResolvedValue([]);
      mockReportManagementClient.getAssignedSignatory.mockResolvedValue(userId);

      const result = await service.validateSignatureEligibility(reportId, userId, signatureType);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid when signature already exists', async () => {
      const reportId = 'report-123';
      const userId = 'user-123';
      const signatureType = SignatureType.PREPARED_BY;

      const existingSignature = TestDataBuilder.buildSignature({ reportId, signatureType });
      const workflowState = TestDataBuilder.buildWorkflowState({
        reportId,
        currentState: WorkflowStateEnum.PENDING_PREPARED_BY
      });

      mockWorkflowStateRepository.findByReportId.mockResolvedValue(workflowState);
      mockSignatureRepository.findByReportAndType.mockResolvedValue(existingSignature);

      const result = await service.validateSignatureEligibility(reportId, userId, signatureType);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Signature already exists for this type');
    });

    it('should return invalid when user is not assigned to signature role', async () => {
      const reportId = 'report-123';
      const userId = 'user-123';
      const signatureType = SignatureType.PREPARED_BY;

      const workflowState = TestDataBuilder.buildWorkflowState({
        reportId,
        currentState: WorkflowStateEnum.PENDING_PREPARED_BY
      });

      mockWorkflowStateRepository.findByReportId.mockResolvedValue(workflowState);
      mockSignatureRepository.findByReportAndType.mockResolvedValue(null);
      mockSignatureRepository.findByReportId.mockResolvedValue([]);
      mockReportManagementClient.getAssignedSignatory.mockResolvedValue('different-user');

      const result = await service.validateSignatureEligibility(reportId, userId, signatureType);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('User is not assigned to this signature role');
    });

    it('should return invalid when user has already signed in different role', async () => {
      const reportId = 'report-123';
      const userId = 'user-123';
      const signatureType = SignatureType.BRANCH_ACKNOWLEDGEMENT;

      const existingSignature = TestDataBuilder.buildSignature({
        reportId,
        signatureType: SignatureType.PREPARED_BY,
        signatoryUserId: userId
      });

      const workflowState = TestDataBuilder.buildWorkflowState({
        reportId,
        currentState: WorkflowStateEnum.PENDING_BRANCH_ACK
      });

      mockWorkflowStateRepository.findByReportId.mockResolvedValue(workflowState);
      mockSignatureRepository.findByReportAndType.mockResolvedValue(null);
      mockSignatureRepository.findByReportId.mockResolvedValue([existingSignature]);
      mockReportManagementClient.getAssignedSignatory.mockResolvedValue(userId);

      const result = await service.validateSignatureEligibility(reportId, userId, signatureType);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('User has already signed this report in a different role');
    });
  });

  describe('validateReportCompleteness', () => {
    it('should return valid when report is complete', async () => {
      const reportId = 'report-123';
      mockReportManagementClient.validateReportCompleteness.mockResolvedValue({
        isValid: true,
        errors: []
      });

      const result = await service.validateReportCompleteness(reportId);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid when report is incomplete', async () => {
      const reportId = 'report-123';
      mockReportManagementClient.validateReportCompleteness.mockResolvedValue({
        isValid: false,
        errors: ['Missing required field: destination']
      });

      const result = await service.validateReportCompleteness(reportId);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing required field: destination');
    });
  });
});
