import { Request, Response, NextFunction } from 'express';
import { log } from '../utils/logger';

/**
 * Logging Middleware
 * 
 * Logs HTTP requests and responses for monitoring and debugging.
 * 
 * PRODUCTION NOTES:
 * - Ensure sensitive data (passwords, tokens) is never logged
 * - Consider log sampling for high-traffic endpoints
 * - Use structured logging for better searchability
 * - Integrate with log aggregation service
 */

export function loggingMiddleware(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();

  // Log incoming request
  log.info('Incoming request', {
    method: req.method,
    path: req.path,
    query: req.query,
    userId: req.user?.userId,
    ip: req.ip
  });

  // Capture response
  const originalSend = res.send;
  res.send = function (data: any): Response {
    const duration = Date.now() - startTime;

    // Log response
    log.info('Outgoing response', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.userId
    });

    return originalSend.call(this, data);
  };

  next();
}
