import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';
import { SignatureType } from '../enums/signature-type.enum';

/**
 * Signature Entity
 * 
 * Represents an individual signature record in the database.
 * Each signature is immutable once created and captures:
 * - Who signed (name and user ID)
 * - When they signed (system-generated timestamp)
 * - What type of signature (PreparedBy, BranchAck, NISDck)
 * - Disclaimer acknowledgement
 * - IP address for audit trail
 * 
 * Database Table: signatures
 * 
 * PRODUCTION NOTE: Ensure proper indexes are created for performance:
 * - Composite unique index on (reportId, signatureType)
 * - Index on reportId for fast lookups
 * - Index on signatoryUserId for user-based queries
 */
@Entity('signatures')
@Index(['reportId', 'signatureType'], { unique: true })
@Index(['reportId'])
@Index(['signatoryUserId'])
export class Signature {
  @PrimaryGeneratedColumn('uuid')
  signatureId!: string;

  @Column('uuid')
  reportId!: string;

  @Column({
    type: 'varchar',
    length: 50,
    enum: SignatureType
  })
  signatureType!: SignatureType;

  @Column({
    type: 'varchar',
    length: 100
  })
  signatoryName!: string;

  @Column('uuid')
  signatoryUserId!: string;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP'
  })
  signedAt!: Date;

  @Column({
    type: 'varchar',
    length: 45
  })
  ipAddress!: string;

  @Column({
    type: 'boolean',
    default: false
  })
  disclaimerAcknowledged!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
