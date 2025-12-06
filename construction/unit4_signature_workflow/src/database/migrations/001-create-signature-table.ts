import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

/**
 * Migration: Create Signatures Table
 * 
 * Creates the signatures table with all required columns, indexes, and constraints.
 * 
 * PRODUCTION NOTES:
 * - Test this migration in staging environment before production
 * - Ensure database user has CREATE TABLE permissions
 * - Monitor migration execution time for large databases
 * - Keep rollback script (down method) tested and ready
 * - Consider maintenance window for production deployment
 */
export class CreateSignatureTable1700000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create signatures table
    await queryRunner.createTable(
      new Table({
        name: 'signatures',
        columns: [
          {
            name: 'signatureId',
            type: 'varchar',
            length: '36',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid'
          },
          {
            name: 'reportId',
            type: 'varchar',
            length: '36',
            isNullable: false
          },
          {
            name: 'signatureType',
            type: 'varchar',
            length: '50',
            isNullable: false
          },
          {
            name: 'signatoryName',
            type: 'varchar',
            length: '100',
            isNullable: false
          },
          {
            name: 'signatoryUserId',
            type: 'varchar',
            length: '36',
            isNullable: false
          },
          {
            name: 'signedAt',
            type: 'datetime',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP'
          },
          {
            name: 'ipAddress',
            type: 'varchar',
            length: '45',
            isNullable: false
          },
          {
            name: 'disclaimerAcknowledged',
            type: 'boolean',
            isNullable: false,
            default: false
          },
          {
            name: 'createdAt',
            type: 'datetime',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP'
          }
        ]
      }),
      true
    );

    // Create unique composite index on (reportId, signatureType)
    // Ensures only one signature of each type per report
    await queryRunner.createIndex(
      'signatures',
      new TableIndex({
        name: 'IDX_SIGNATURE_REPORT_TYPE',
        columnNames: ['reportId', 'signatureType'],
        isUnique: true
      })
    );

    // Create index on reportId for fast lookups
    await queryRunner.createIndex(
      'signatures',
      new TableIndex({
        name: 'IDX_SIGNATURE_REPORT',
        columnNames: ['reportId']
      })
    );

    // Create index on signatoryUserId for user-based queries
    await queryRunner.createIndex(
      'signatures',
      new TableIndex({
        name: 'IDX_SIGNATURE_USER',
        columnNames: ['signatoryUserId']
      })
    );

    // SQLite Note: Check constraints are supported but syntax is simpler
    // These constraints ensure data integrity at database level
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.dropIndex('signatures', 'IDX_SIGNATURE_USER');
    await queryRunner.dropIndex('signatures', 'IDX_SIGNATURE_REPORT');
    await queryRunner.dropIndex('signatures', 'IDX_SIGNATURE_REPORT_TYPE');
    
    // Drop table
    await queryRunner.dropTable('signatures');
  }
}
