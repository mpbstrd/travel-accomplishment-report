import 'reflect-metadata';
import { createApp } from './app';
import { initializeDatabase, closeDatabase } from './database/data-source';
import { appConfig } from './config/app.config';
import { log } from './shared/utils/logger';

/**
 * Server Entry Point
 * 
 * Initializes database connection and starts Express server.
 * Handles graceful shutdown on termination signals.
 * 
 * PRODUCTION NOTES:
 * - Implement health checks for load balancer
 * - Add readiness and liveness probes for Kubernetes
 * - Configure graceful shutdown timeout
 * - Implement connection draining
 * - Add process monitoring (PM2, systemd)
 */

async function startServer(): Promise<void> {
  try {
    // Initialize database connection
    log.info('Initializing database connection...');
    await initializeDatabase();

    // Create Express app
    const app = createApp();

    // Start server
    const server = app.listen(appConfig.port, () => {
      log.info(`✓ Server started successfully`);
      log.info(`  Environment: ${appConfig.nodeEnv}`);
      log.info(`  Port: ${appConfig.port}`);
      log.info(`  URL: http://localhost:${appConfig.port}`);
      log.info(`  Health: http://localhost:${appConfig.port}/health`);
    });

    // Graceful shutdown handler
    const gracefulShutdown = async (signal: string) => {
      log.info(`${signal} received. Starting graceful shutdown...`);

      // Stop accepting new connections
      server.close(async () => {
        log.info('HTTP server closed');

        try {
          // Close database connection
          await closeDatabase();
          log.info('✓ Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          log.error('Error during shutdown', error);
          process.exit(1);
        }
      });

      // Force shutdown after timeout
      setTimeout(() => {
        log.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000); // 10 seconds timeout
    };

    // Register shutdown handlers
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught errors
    process.on('uncaughtException', (error) => {
      log.error('Uncaught exception', error);
      gracefulShutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason, promise) => {
      log.error('Unhandled rejection', { reason, promise });
      gracefulShutdown('unhandledRejection');
    });

  } catch (error) {
    log.error('Failed to start server', error);
    process.exit(1);
  }
}

// Start the server
startServer();
