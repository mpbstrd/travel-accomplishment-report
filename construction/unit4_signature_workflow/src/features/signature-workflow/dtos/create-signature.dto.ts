import { IsEnum, IsString, IsBoolean, IsUUID, IsNotEmpty, MaxLength, Equals } from 'class-validator';
import { SignatureType } from '../enums/signature-type.enum';

/**
 * Create Signature DTO
 * 
 * Validates signature creation request data.
 * All fields are required and validated using class-validator decorators.
 */
export class CreateSignatureDTO {
  @IsEnum(SignatureType, { message: 'Invalid signature type' })
  @IsNotEmpty({ message: 'Signature type is required' })
  signatureType!: SignatureType;

  @IsString({ message: 'Signatory name must be a string' })
  @MaxLength(100, { message: 'Signatory name cannot exceed 100 characters' })
  @IsNotEmpty({ message: 'Signatory name is required' })
  signatoryName!: string;

  @IsBoolean({ message: 'Disclaimer acknowledgement must be a boolean' })
  @Equals(true, { message: 'You must acknowledge the disclaimer to proceed' })
  disclaimerAcknowledged!: boolean;

  @IsUUID('4', { message: 'Invalid user ID format' })
  @IsNotEmpty({ message: 'User ID is required' })
  userId!: string;
}
