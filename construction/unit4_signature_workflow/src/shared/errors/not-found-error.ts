import { AppError } from './app-error';

/**
 * Not Found Error
 * 
 * Thrown when a requested resource is not found.
 * HTTP Status: 404 Not Found
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
