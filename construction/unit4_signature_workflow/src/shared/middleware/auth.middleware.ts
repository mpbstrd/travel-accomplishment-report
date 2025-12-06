import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response-formatter';

/**
 * Authentication Middleware
 * 
 * Validates JWT tokens and extracts user information.
 * Attaches user info to request object for downstream use.
 * 
 * PRODUCTION NOTES:
 * - Ensure JWT_SECRET is stored securely (Key Vault, Secrets Manager)
 * - Use strong, randomly generated secrets (minimum 32 characters)
 * - Consider token rotation and refresh token strategy
 * - Implement token blacklisting for logout functionality
 * - Add rate limiting to prevent brute force attacks
 */

interface JWTPayload {
  userId: string;
  email?: string;
  role?: string;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      sendError(res, 'Authorization header is required', 401);
      return;
    }

    // Expected format: "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      sendError(res, 'Invalid authorization header format. Expected: Bearer <token>', 401);
      return;
    }

    const token = parts[1];

    // Verify token
    const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      sendError(res, 'Invalid token', 401);
    } else if (error instanceof jwt.TokenExpiredError) {
      sendError(res, 'Token has expired', 401);
    } else {
      sendError(res, 'Authentication failed', 401);
    }
  }
}

/**
 * Optional authentication middleware
 * 
 * Extracts user info if token is present, but doesn't require it.
 * Useful for endpoints that work differently for authenticated vs anonymous users.
 */
export function optionalAuthMiddleware(req: Request, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
      const parts = authHeader.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        const token = parts[1];
        const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
        const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
        
        req.user = {
          userId: decoded.userId,
          email: decoded.email,
          role: decoded.role
        };
      }
    }
    
    next();
  } catch (error) {
    // Ignore errors for optional auth
    next();
  }
}
