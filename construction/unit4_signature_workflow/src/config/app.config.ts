import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Application Configuration
 * 
 * Centralized configuration for application settings.
 * 
 * PRODUCTION NOTES:
 * - Store sensitive values in environment variables
 * - Use Azure Key Vault or AWS Secrets Manager for secrets
 * - Adjust rate limiting based on load testing
 * - Enable CORS only for trusted domains
 * - Set appropriate timeout values based on requirements
 */

export const appConfig = {
  // Server settings
  port: parseInt(process.env.PORT || '3004'),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // JWT settings
  // PRODUCTION: Use strong, randomly generated secret (minimum 32 characters)
  // Store in secure key vault
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  
  // CORS settings
  // PRODUCTION: Set to specific frontend domain(s)
  // Example: ['https://yourdomain.com', 'https://app.yourdomain.com']
  corsOrigin: process.env.CORS_ORIGIN || '*',
  
  // Rate limiting
  // PRODUCTION: Adjust based on expected traffic patterns
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  
  // Logging
  // PRODUCTION: Set to 'error' or 'warn' to reduce log volume
  logLevel: process.env.LOG_LEVEL || 'info',
  
  // Request settings
  requestTimeout: parseInt(process.env.REQUEST_TIMEOUT || '30000'), // 30 seconds
  bodyLimit: process.env.BODY_LIMIT || '10mb',
  
  // Feature flags
  enableSwagger: process.env.ENABLE_SWAGGER === 'true',
  enableMetrics: process.env.ENABLE_METRICS === 'true'
};
