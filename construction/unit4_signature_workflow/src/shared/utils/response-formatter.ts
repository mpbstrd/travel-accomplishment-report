import { Response } from 'express';

/**
 * Response Formatter Utility
 * 
 * Provides consistent response formatting across all API endpoints.
 */

/**
 * Send success response
 */
export function sendSuccess<T>(res: Response, data: T, message?: string, statusCode: number = 200): Response {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

/**
 * Send error response
 */
export function sendError(
  res: Response,
  message: string,
  statusCode: number = 500,
  errors?: string[]
): Response {
  return res.status(statusCode).json({
    success: false,
    error: {
      message,
      details: errors
    }
  });
}

/**
 * Send created response (201)
 */
export function sendCreated<T>(res: Response, data: T, message?: string): Response {
  return sendSuccess(res, data, message, 201);
}
