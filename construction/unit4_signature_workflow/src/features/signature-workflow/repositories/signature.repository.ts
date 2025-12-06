import { Repository } from 'typeorm';
import { injectable } from 'tsyringe';
import { AppDataSource } from '../../../database/data-source';
import { Signature } from '../entities/signature.entity';
import { SignatureType } from '../enums/signature-type.enum';

/**
 * Signature Repository Interface
 * 
 * Defines the contract for signature data access operations
 */
export interface ISignatureRepository {
  create(data: CreateSignatureData): Promise<Signature>;
  findById(signatureId: string): Promise<Signature | null>;
  findByReportId(reportId: string): Promise<Signature[]>;
  findByReportAndType(reportId: string, signatureType: SignatureType): Promise<Signature | null>;
  getSignatureHistory(reportId: string): Promise<Signature[]>;
}

/**
 * Data structure for creating a signature
 */
export interface CreateSignatureData {
  reportId: string;
  signatureType: SignatureType;
  signatoryName: string;
  signatoryUserId: string;
  ipAddress: string;
  disclaimerAcknowledged: boolean;
}

/**
 * Signature Repository Implementation
 * 
 * Handles all database operations for Signature entity.
 * Uses TypeORM Repository pattern for data access abstraction.
 * 
 * PRODUCTION NOTES:
 * - All queries use parameterized statements to prevent SQL injection
 * - Indexes on reportId and signatureType ensure fast lookups
 * - Consider adding query result caching for frequently accessed signatures
 * - Monitor query performance and add indexes as needed
 */
@injectable()
export class SignatureRepository implements ISignatureRepository {
  private repository: Repository<Signature>;

  constructor() {
    this.repository = AppDataSource.getRepository(Signature);
  }

  /**
   * Create a new signature record
   * 
   * @param data Signature creation data
   * @returns Created signature with generated ID and timestamp
   * @throws Error if creation fails or unique constraint violated
   */
  async create(data: CreateSignatureData): Promise<Signature> {
    const signature = this.repository.create({
      ...data,
      signedAt: new Date() // System-generated timestamp
    });
    
    return await this.repository.save(signature);
  }

  /**
   * Find signature by ID
   * 
   * @param signatureId UUID of the signature
   * @returns Signature if found, null otherwise
   */
  async findById(signatureId: string): Promise<Signature | null> {
    return await this.repository.findOne({
      where: { signatureId }
    });
  }

  /**
   * Find all signatures for a report
   * 
   * @param reportId UUID of the report
   * @returns Array of signatures ordered by signedAt ascending
   */
  async findByReportId(reportId: string): Promise<Signature[]> {
    return await this.repository.find({
      where: { reportId },
      order: { signedAt: 'ASC' }
    });
  }

  /**
   * Find specific signature type for a report
   * 
   * @param reportId UUID of the report
   * @param signatureType Type of signature to find
   * @returns Signature if found, null otherwise
   */
  async findByReportAndType(
    reportId: string,
    signatureType: SignatureType
  ): Promise<Signature | null> {
    return await this.repository.findOne({
      where: { reportId, signatureType }
    });
  }

  /**
   * Get complete signature history for a report
   * 
   * @param reportId UUID of the report
   * @returns Array of all signatures ordered chronologically
   */
  async getSignatureHistory(reportId: string): Promise<Signature[]> {
    return await this.repository.find({
      where: { reportId },
      order: { signedAt: 'ASC' }
    });
  }
}
