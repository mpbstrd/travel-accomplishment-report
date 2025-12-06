import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError as ClassValidatorError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { sendError } from '../utils/response-formatter';
import { appConfig } from '../../config/app.config';

/**
 * Validation Middleware Factory
 * 
 * Creates middleware to validate request body against a DTO class.
 * Uses class-validator decorators for validation rules.
 * 
 * @param dtoClass DTO class with validation decorators
 * @returns Express middleware function
 */
export function validateBody<T extends object>(dtoClass: new () => T) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Transform plain object to class instance
      const dtoInstance = plainToClass(dtoClass, req.body);

      // Validate
      const errors = await validate(dtoInstance);

      if (errors.length > 0) {
        // Format validation errors
        const formattedErrors = errors.map((error: ClassValidatorError) => {
          const constraints = error.constraints || {};
          return Object.values(constraints).join(', ');
        });

        sendError(res, 'Validation failed', 400, formattedErrors);
        return;
      }

      // Replace request body with validated instance
      req.body = dtoInstance;
      next();
    } catch (error) {
      sendError(res, 'Validation error', 400);
    }
  };
}

/**
 * Validate UUID parameter
 * 
 * Validates that a route parameter is a valid UUID v4.
 * In development mode with ALLOW_TEST_REPORT_IDS=true, allows test values like "test", "demo".
 * 
 * @param paramName Name of the parameter to validate
 * @returns Express middleware function
 */
export function validateUuidParam(paramName: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const paramValue = req.params[paramName];
    
    if (!paramValue) {
      sendError(res, `Parameter ${paramName} is required`, 400);
      return;
    }

    // UUID v4 regex
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    // Check if it's a valid UUID
    if (uuidRegex.test(paramValue)) {
      next();
      return;
    }

    // In development mode with test mode enabled, allow specific test values
    if (appConfig.allowTestReportIds && paramName === 'reportId') {
      const allowedTestValues = ['test', 'demo', 'sample'];
      if (allowedTestValues.includes(paramValue.toLowerCase())) {
        next();
        return;
      }
    }

    sendError(res, `Invalid ${paramName} format. Expected UUID v4.`, 400);
  };
}
