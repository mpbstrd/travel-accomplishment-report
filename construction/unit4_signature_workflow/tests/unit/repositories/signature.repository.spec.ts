import { SignatureRepository } from '../../../src/features/signature-workflow/repositories/signature.repository';
import { Signature } from '../../../src/features/signature-workflow/entities/signature.entity';
import { SignatureType } from '../../../src/features/signature-workflow/enums/signature-type.enum';
import { MockFactory } from '../../helpers/mock-factory';
import { TestDataBuilder } from '../../helpers/test-data-builder';

describe('SignatureRepository', () => {
  let repository: SignatureRepository;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = MockFactory.createMockRepository<Signature>();
    repository = new SignatureRepository();
    (repository as any).repository = mockRepository;
  });

  describe('create', () => {
    it('should create a new signature', async () => {
      const signatureData = {
        reportId: 'report-123',
        signatureType: SignatureType.PREPARED_BY,
        signatoryName: 'John Doe',
        signatoryUserId: 'user-123',
        ipAddress: '192.168.1.1',
        disclaimerAcknowledged: true
      };

      const expectedSignature = TestDataBuilder.buildSignature(signatureData);
      mockRepository.create.mockReturnValue(expectedSignature);
      mockRepository.save.mockResolvedValue(expectedSignature);

      const result = await repository.create(signatureData);

      expect(mockRepository.create).toHaveBeenCalledWith(signatureData);
      expect(mockRepository.save).toHaveBeenCalledWith(expectedSignature);
      expect(result).toEqual(expectedSignature);
    });
  });

  describe('findById', () => {
    it('should find signature by ID', async () => {
      const signatureId = 'sig-123';
      const expectedSignature = TestDataBuilder.buildSignature({ signatureId });
      mockRepository.findOneBy.mockResolvedValue(expectedSignature);

      const result = await repository.findById(signatureId);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ signatureId });
      expect(result).toEqual(expectedSignature);
    });

    it('should return null if signature not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('findByReportId', () => {
    it('should find all signatures for a report', async () => {
      const reportId = 'report-123';
      const signatures = [
        TestDataBuilder.buildSignature({ reportId, signatureType: SignatureType.PREPARED_BY }),
        TestDataBuilder.buildSignature({ reportId, signatureType: SignatureType.BRANCH_ACKNOWLEDGEMENT })
      ];
      mockRepository.find.mockResolvedValue(signatures);

      const result = await repository.findByReportId(reportId);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { reportId },
        order: { signedAt: 'ASC' }
      });
      expect(result).toEqual(signatures);
    });

    it('should return empty array if no signatures found', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await repository.findByReportId('report-123');

      expect(result).toEqual([]);
    });
  });

  describe('findByReportAndType', () => {
    it('should find signature by report ID and type', async () => {
      const reportId = 'report-123';
      const signatureType = SignatureType.PREPARED_BY;
      const expectedSignature = TestDataBuilder.buildSignature({ reportId, signatureType });
      mockRepository.findOneBy.mockResolvedValue(expectedSignature);

      const result = await repository.findByReportAndType(reportId, signatureType);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ reportId, signatureType });
      expect(result).toEqual(expectedSignature);
    });

    it('should return null if signature not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await repository.findByReportAndType('report-123', SignatureType.PREPARED_BY);

      expect(result).toBeNull();
    });
  });

  describe('getSignatureHistory', () => {
    it('should return signatures ordered by signedAt', async () => {
      const reportId = 'report-123';
      const signatures = [
        TestDataBuilder.buildSignature({ 
          reportId, 
          signatureType: SignatureType.PREPARED_BY,
          signedAt: new Date('2024-01-01')
        }),
        TestDataBuilder.buildSignature({ 
          reportId, 
          signatureType: SignatureType.BRANCH_ACKNOWLEDGEMENT,
          signedAt: new Date('2024-01-02')
        })
      ];
      mockRepository.find.mockResolvedValue(signatures);

      const result = await repository.getSignatureHistory(reportId);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { reportId },
        order: { signedAt: 'ASC' }
      });
      expect(result).toEqual(signatures);
    });
  });
});
