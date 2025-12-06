import { Signature } from '../entities/signature.entity';
import { WorkflowState } from '../entities/workflow-state.entity';
import { SignatureType } from '../enums/signature-type.enum';

/**
 * Record Signature Result DTO
 * 
 * Response after successfully recording a signature.
 * Includes the created signature, updated workflow state, and next steps.
 */
export class RecordSignatureResultDTO {
  signature!: Signature;
  workflowState!: WorkflowState;
  message!: string;
  nextSignatureRequired!: SignatureType | null;
}
