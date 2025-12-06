/**
 * Validation Result DTO
 * 
 * Standard structure for validation results throughout the application.
 */
export class ValidationResultDTO {
  isValid!: boolean;
  errors!: string[];

  constructor(isValid: boolean, errors: string[] = []) {
    this.isValid = isValid;
    this.errors = errors;
  }

  static success(): ValidationResultDTO {
    return new ValidationResultDTO(true, []);
  }

  static failure(errors: string[]): ValidationResultDTO {
    return new ValidationResultDTO(false, errors);
  }
}
