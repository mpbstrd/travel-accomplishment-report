/**
 * Express Type Extensions
 * 
 * Extends Express Request type to include custom properties.
 */

declare namespace Express {
  export interface Request {
    user?: {
      userId: string;
      email?: string;
      role?: string;
    };
  }
}
