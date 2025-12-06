import { AppError } from './app-error';

/**
 * Authorization Error
 * 
 * Thrown when user is not authorized to perform an action.
 * HTTP Status: 403 Forbidden
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'You are not authorized to perform this action') {
    super(message, 403);
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}
