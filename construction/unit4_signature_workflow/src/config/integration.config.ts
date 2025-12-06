import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Integration Configuration
 * 
 * Configuration for external service endpoints and integration settings.
 * 
 * PRODUCTION NOTES:
 * - Update URLs to actual production service endpoints
 * - Implement service discovery if using microservices architecture
 * - Add authentication/authorization for service-to-service calls
 * - Configure appropriate timeout and retry settings
 * - Consider using API gateway for centralized routing
 * - Implement circuit breaker pattern for resilience
 */

export const integrationConfig = {
  // Mock Mode - Set to true to use mock implementations for testing
  useMockServices: process.env.USE_MOCK_SERVICES === 'true',
  
  // User Management Service
  userManagement: {
    baseUrl: process.env.USER_MGMT_URL || 'http://localhost:3001/api',
    timeout: parseInt(process.env.USER_MGMT_TIMEOUT || '5000'),
    retryAttempts: parseInt(process.env.USER_MGMT_RETRY || '3')
  },
  
  // Report Management Service
  reportManagement: {
    baseUrl: process.env.REPORT_MGMT_URL || 'http://localhost:3002/api',
    timeout: parseInt(process.env.REPORT_MGMT_TIMEOUT || '5000'),
    retryAttempts: parseInt(process.env.REPORT_MGMT_RETRY || '3')
  },
  
  // Notification Service
  notification: {
    baseUrl: process.env.NOTIFICATION_URL || 'http://localhost:3005/api',
    timeout: parseInt(process.env.NOTIFICATION_TIMEOUT || '5000'),
    retryAttempts: parseInt(process.env.NOTIFICATION_RETRY || '3'),
    // Notification failures should not block workflow
    failSilently: true
  }
};
