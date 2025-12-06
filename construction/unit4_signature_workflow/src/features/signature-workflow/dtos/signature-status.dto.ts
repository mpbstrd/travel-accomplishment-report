import { WorkflowState } from '../entities/workflow-state.entity';
import { Signature } from '../entities/signature.entity';
import { SignatureType } from '../enums/signature-type.enum';

/**
 * Signature Status DTO
 * 
 * Comprehensive signature status response including:
 * - Current workflow state
 * - All signatures collected
 * - Next required signature
 * - Progress indicator
 * - User-specific actions
 */
export class SignatureStatusDTO {
  workflowState!: WorkflowState;
  signatures!: Signature[];
  nextRequired!: SignatureType | null;
  progress!: {
    completed: number;
    total: number;
  };
  canCurrentUserSign!: boolean;
  currentUserSignatureType!: SignatureType | null;
}
