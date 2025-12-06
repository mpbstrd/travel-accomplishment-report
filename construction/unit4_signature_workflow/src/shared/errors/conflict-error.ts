import { AppError } from './app-error';

/**
 * Conflict Error
 * 
 * Thrown when there's a conflict with the current state of the resource.
 * Examples: duplicate signature, invalid state transition
 * HTTP Status: 409 Conflict
 */
export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}
