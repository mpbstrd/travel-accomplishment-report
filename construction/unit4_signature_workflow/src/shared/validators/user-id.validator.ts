import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

/**
 * Custom validator for user ID format
 * 
 * In development mode with ALLOW_TEST_REPORT_IDS=true, allows:
 * - Valid UUID v4 format
 * - Test user IDs like "user-001", "test-user", "admin"
 * 
 * In production, only allows UUID v4 format.
 */
export function IsUserIdFormat(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isUserIdFormat',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }

          // UUID v4 regex
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
          
          // Check if it's a valid UUID
          if (uuidRegex.test(value)) {
            return true;
          }

          // In development mode with test mode enabled, allow test user IDs
          if (process.env.NODE_ENV === 'development' && process.env.ALLOW_TEST_REPORT_IDS === 'true') {
            const allowedTestUserIds = [
              'user-001', 'user-002', 'user-003',
              'test-user', 'admin', 'demo-user',
              'john-smith', 'jane-doe', 'bob-johnson'
            ];
            return allowedTestUserIds.includes(value.toLowerCase());
          }

          return false;
        }
      }
    });
  };
}