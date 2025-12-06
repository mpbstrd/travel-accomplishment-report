import winston from 'winston';

/**
 * Logger Utility
 * 
 * Centralized logging using Winston.
 * Provides structured logging with different levels and formats.
 * 
 * PRODUCTION NOTES:
 * - Set LOG_LEVEL to 'error' or 'warn' in production
 * - Configure log aggregation (ELK, Splunk, Azure Monitor)
 * - Enable log rotation to prevent disk space issues
 * - Consider using external logging service for production
 * - Ensure sensitive data (passwords, tokens) is never logged
 */

const logLevel = process.env.LOG_LEVEL || 'info';

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
  })
);

// Create logger instance
export const logger = winston.createLogger({
  level: logLevel,
  format: logFormat,
  defaultMeta: { service: 'signature-workflow' },
  transports: [
    // Console transport for all environments
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'production' ? logFormat : consoleFormat
    })
    
    // PRODUCTION: Add file transports or external service
    // new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

/**
 * Log helper functions
 */
export const log = {
  error: (message: string, meta?: any) => logger.error(message, meta),
  warn: (message: string, meta?: any) => logger.warn(message, meta),
  info: (message: string, meta?: any) => logger.info(message, meta),
  debug: (message: string, meta?: any) => logger.debug(message, meta)
};
