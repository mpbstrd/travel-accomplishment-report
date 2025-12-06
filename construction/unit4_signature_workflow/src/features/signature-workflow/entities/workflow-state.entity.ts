import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { WorkflowStateEnum } from '../enums/workflow-state.enum';

/**
 * WorkflowState Entity
 * 
 * Tracks the current state and progression of the signature workflow for each report.
 * Maintains references to all three signatures and tracks workflow timestamps.
 * 
 * Database Table: workflow_states
 * 
 * Relationships:
 * - One-to-one with Report (via reportId)
 * - References to three Signature records (nullable until signatures are recorded)
 * 
 * PRODUCTION NOTE: 
 * - Ensure reportId has unique constraint to enforce one workflow per report
 * - Index on currentState for filtering workflows by state
 * - Consider adding check constraints for state transition validation at DB level
 */
@Entity('workflow_states')
@Index(['reportId'], { unique: true })
@Index(['currentState'])
export class WorkflowState {
  @PrimaryGeneratedColumn('uuid')
  workflowId!: string;

  @Column({
    type: 'uuid',
    unique: true
  })
  reportId!: string;

  @Column({
    type: 'varchar',
    length: 50,
    enum: WorkflowStateEnum,
    default: WorkflowStateEnum.DRAFT
  })
  currentState!: WorkflowStateEnum;

  @Column({
    type: 'datetime',
    nullable: true
  })
  submittedAt!: Date | null;

  @Column({
    type: 'datetime',
    nullable: true
  })
  completedAt!: Date | null;

  @Column({
    type: 'varchar',
    nullable: true
  })
  preparedBySignatureId!: string | null;

  @Column({
    type: 'varchar',
    nullable: true
  })
  branchAckSignatureId!: string | null;

  @Column({
    type: 'varchar',
    nullable: true
  })
  nisdAckSignatureId!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
