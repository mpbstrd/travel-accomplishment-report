import { SignatureType } from '../enums/signature-type.enum';

/**
 * Available Actions DTO
 * 
 * Describes what actions a user can perform on a report.
 */
export class AvailableActionsDTO {
  actions!: string[];
  canSign!: boolean;
  signatureType!: SignatureType | null;
  message!: string;
}
