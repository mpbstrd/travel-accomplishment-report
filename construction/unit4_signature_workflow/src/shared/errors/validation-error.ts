import { AppError } from './app-error';

/**
 * Validation Error
 * 
 * Thrown when input validation fails.
 * HTTP Status: 400 Bad Request
 */
export class ValidationError extends AppError {
  public readonly errors: string[];

  constructor(message: string, errors: string[] = []) {
    super(message, 400);
    this.errors = errors;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
