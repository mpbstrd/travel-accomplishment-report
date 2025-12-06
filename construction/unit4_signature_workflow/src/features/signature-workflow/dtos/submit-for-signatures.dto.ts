import { IsUUID, IsNotEmpty } from 'class-validator';

/**
 * Submit For Signatures DTO
 * 
 * Validates report submission request.
 */
export class SubmitForSignaturesDTO {
  @IsUUID('4', { message: 'Invalid user ID format' })
  @IsNotEmpty({ message: 'User ID is required' })
  userId!: string;
}
