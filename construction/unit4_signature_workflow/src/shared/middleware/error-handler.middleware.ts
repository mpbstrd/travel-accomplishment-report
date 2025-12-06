import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';
import { ValidationError } from '../errors/validation-error';
import { log } from '../utils/logger';

/**
 * Error Handler Middleware
 * 
 * Centralized error handling for all application errors.
 * Maps error types to appropriate HTTP status codes and formats responses.
 * 
 * PRODUCTION NOTES:
 * - Never expose internal error details to clients
 * - Log all errors with full stack traces for debugging
 * - Consider error tracking service (Sentry, Application Insights)
 * - Implement error alerting for critical errors
 */

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log error
  log.error('Error occurred', {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    userId: req.user?.userId
  });

  // Handle known application errors
  if (error instanceof AppError) {
    const statusCode = error.statusCode;
    const message = error.message;

    // Include validation errors if present
    if (error instanceof ValidationError && error.errors.length > 0) {
      res.status(statusCode).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message,
          details: error.errors
        }
      });
      return;
    }

    // Standard error response
    res.status(statusCode).json({
      success: false,
      error: {
        code: getErrorCode(error),
        message
      }
    });
    return;
  }

  // Handle unknown errors
  // PRODUCTION: Don't expose internal error details
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: isDevelopment ? error.message : 'An unexpected error occurred',
      ...(isDevelopment && { stack: error.stack })
    }
  });
}

/**
 * Get error code based on error type
 */
function getErrorCode(error: AppError): string {
  const statusCode = error.statusCode;
  
  const codeMap: Record<number, string> = {
    400: 'VALIDATION_ERROR',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    409: 'CONFLICT',
    500: 'INTERNAL_ERROR'
  };
  
  return codeMap[statusCode] || 'UNKNOWN_ERROR';
}

/**
 * Async error wrapper
 * 
 * Wraps async route handlers to catch errors and pass to error handler.
 * 
 * @param fn Async route handler function
 * @returns Wrapped function
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
