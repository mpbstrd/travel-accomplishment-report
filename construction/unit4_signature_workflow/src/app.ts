import 'reflect-metadata';
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { container } from 'tsyringe';
import { appConfig } from './config/app.config';
import { swaggerSpec } from './config/swagger.config';
import { loggingMiddleware } from './shared/middleware/logging.middleware';
import { errorHandler } from './shared/middleware/error-handler.middleware';
import signatureWorkflowRoutes from './features/signature-workflow/routes/signature-workflow.routes';
import { log } from './shared/utils/logger';
import { integrationConfig } from './config/integration.config';

// Import repositories and services for DI registration
import { SignatureRepository } from './features/signature-workflow/repositories/signature.repository';
import { WorkflowStateRepository } from './features/signature-workflow/repositories/workflow-state.repository';
import { WorkflowStateService } from './features/signature-workflow/services/workflow-state.service';
import { SignatureValidationService } from './features/signature-workflow/services/signature-validation.service';
import { SignatureNotificationService } from './features/signature-workflow/services/signature-notification.service';
import { SignatureWorkflowService } from './features/signature-workflow/services/signature-workflow.service';
import { UserManagementClient } from './integrations/user-management/user-management.client';
import { ReportManagementClient } from './integrations/report-management/report-management.client';
import { NotificationClient } from './integrations/notification-service/notification.client';
// Mock implementations
import { MockUserManagementClient } from './mocks/mock-user-management.client';
import { MockReportManagementClient } from './mocks/mock-report-management.client';
import { MockNotificationClient } from './mocks/mock-notification.client';

/**
 * Express Application Setup
 * 
 * Configures Express application with middleware, routes, and error handling.
 * 
 * PRODUCTION NOTES:
 * - Enable helmet security headers
 * - Configure CORS for specific domains
 * - Implement rate limiting per endpoint if needed
 * - Add request ID middleware for tracing
 * - Enable compression middleware
 * - Configure trust proxy if behind load balancer
 */

/**
 * Register dependencies in DI container
 */
function registerDependencies(): void {
  // Repositories
  container.registerSingleton(SignatureRepository);
  container.registerSingleton(WorkflowStateRepository);
  
  // Services
  container.registerSingleton(WorkflowStateService);
  container.registerSingleton(SignatureValidationService);
  container.registerSingleton(SignatureNotificationService);
  container.registerSingleton(SignatureWorkflowService);
  
  // Integration clients - Use mocks if configured
  if (integrationConfig.useMockServices) {
    log.info('Using MOCK service implementations for testing');
    container.registerSingleton('UserManagementClient', MockUserManagementClient);
    container.registerSingleton('ReportManagementClient', MockReportManagementClient);
    container.registerSingleton('NotificationClient', MockNotificationClient);
  } else {
    log.info('Using REAL service implementations');
    container.registerSingleton('UserManagementClient', UserManagementClient);
    container.registerSingleton('ReportManagementClient', ReportManagementClient);
    container.registerSingleton('NotificationClient', NotificationClient);
  }
  
  log.info('Dependencies registered in DI container');
}

/**
 * Create and configure Express application
 */
export function createApp(): Application {
  const app = express();

  // Register dependencies
  registerDependencies();

  // Trust proxy if behind load balancer
  // PRODUCTION: Enable if using load balancer or reverse proxy
  if (appConfig.nodeEnv === 'production') {
    app.set('trust proxy', 1);
  }

  // Security middleware
  app.use(helmet());

  // CORS configuration
  // PRODUCTION: Configure for specific domains
  app.use(cors({
    origin: appConfig.corsOrigin,
    credentials: true
  }));

  // Body parsing middleware
  app.use(express.json({ limit: appConfig.bodyLimit }));
  app.use(express.urlencoded({ extended: true, limit: appConfig.bodyLimit }));

  // Rate limiting
  // PRODUCTION: Consider per-endpoint rate limiting
  const limiter = rateLimit({
    windowMs: appConfig.rateLimitWindowMs,
    max: appConfig.rateLimitMaxRequests,
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false
  });
  app.use('/api', limiter);

  // Logging middleware
  app.use(loggingMiddleware);

  // Swagger API Documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Signature Workflow API Docs'
  }));

  // Serve static files for web UI
  app.use(express.static('public'));

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'signature-workflow',
      version: '1.0.0',
      mockMode: integrationConfig.useMockServices
    });
  });

  // API routes
  app.use('/api/reports', signatureWorkflowRoutes);

  // 404 handler
  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Endpoint not found'
      }
    });
  });

  // Error handling middleware (must be last)
  app.use(errorHandler);

  return app;
}
