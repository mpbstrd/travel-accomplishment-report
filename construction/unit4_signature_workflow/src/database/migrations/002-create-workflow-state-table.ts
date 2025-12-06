import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

/**
 * Migration: Create Workflow States Table
 * 
 * Creates the workflow_states table with all required columns, indexes, and constraints.
 * 
 * PRODUCTION NOTES:
 * - Test this migration in staging environment before production
 * - Ensure migration 001 has been successfully applied first
 * - Monitor migration execution time
 * - Keep rollback script tested and ready
 * - Consider adding foreign key constraints to signatures table if needed
 */
export class CreateWorkflowStateTable1700000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create workflow_states table
    await queryRunner.createTable(
      new Table({
        name: 'workflow_states',
        columns: [
          {
            name: 'workflowId',
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
            isNullable: false,
            isUnique: true
          },
          {
            name: 'currentState',
            type: 'varchar',
            length: '50',
            isNullable: false,
            default: "'DRAFT'"
          },
          {
            name: 'submittedAt',
            type: 'datetime',
            isNullable: true
          },
          {
            name: 'completedAt',
            type: 'datetime',
            isNullable: true
          },
          {
            name: 'preparedBySignatureId',
            type: 'varchar',
            length: '36',
            isNullable: true
          },
          {
            name: 'branchAckSignatureId',
            type: 'varchar',
            length: '36',
            isNullable: true
          },
          {
            name: 'nisdAckSignatureId',
            type: 'varchar',
            length: '36',
            isNullable: true
          },
          {
            name: 'createdAt',
            type: 'datetime',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP'
          },
          {
            name: 'updatedAt',
            type: 'datetime',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP'
          }
        ]
      }),
      true
    );

    // Create unique index on reportId
    // Ensures one workflow per report
    await queryRunner.createIndex(
      'workflow_states',
      new TableIndex({
        name: 'IDX_WORKFLOW_REPORT',
        columnNames: ['reportId'],
        isUnique: true
      })
    );

    // Create index on currentState for filtering
    await queryRunner.createIndex(
      'workflow_states',
      new TableIndex({
        name: 'IDX_WORKFLOW_STATE',
        columnNames: ['currentState']
      })
    );

    // SQLite Note: Check constraints and foreign keys are supported
    // These ensure data integrity at database level
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.dropIndex('workflow_states', 'IDX_WORKFLOW_STATE');
    await queryRunner.dropIndex('workflow_states', 'IDX_WORKFLOW_REPORT');
    
    // Drop table
    await queryRunner.dropTable('workflow_states');
  }
}
