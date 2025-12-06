/**
 * Workflow State Enumeration
 * 
 * Defines the possible states in the signature workflow state machine:
 * - DRAFT: Initial state, report not yet submitted
 * - PENDING_PREPARED_BY: Awaiting first signature
 * - PENDING_BRANCH_ACK: Awaiting second signature
 * - PENDING_NISD_ACK: Awaiting third signature
 * - COMPLETED: All signatures collected, workflow complete
 * 
 * Valid transitions:
 * DRAFT → PENDING_PREPARED_BY → PENDING_BRANCH_ACK → PENDING_NISD_ACK → COMPLETED
 */
export enum WorkflowStateEnum {
  DRAFT = 'DRAFT',
  PENDING_PREPARED_BY = 'PENDING_PREPARED_BY',
  PENDING_BRANCH_ACK = 'PENDING_BRANCH_ACK',
  PENDING_NISD_ACK = 'PENDING_NISD_ACK',
  COMPLETED = 'COMPLETED'
}
