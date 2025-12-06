import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { databaseConfig } from '../config/database.config';

/**
 * TypeORM DataSource
 * 
 * Central database connection manager for the application.
 * Used by:
 * - Application runtime for database operations
 * - Migration CLI for running migrations
 * - Seeding scripts for test data
 * 
 * PRODUCTION NOTE:
 * - Ensure connection is properly closed on application shutdown
 * - Implement connection retry logic for transient failures
 * - Monitor connection health and implement circuit breaker pattern
 */
export const AppDataSource = new DataSource(databaseConfig);

/**
 * Initialize database connection
 * 
 * @returns Promise<DataSource> Initialized data source
 * @throws Error if connection fails
 */
export async function initializeDatabase(): Promise<DataSource> {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✓ Database connection established successfully');
    }
    return AppDataSource;
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    throw error;
  }
}

/**
 * Close database connection
 * 
 * Should be called during graceful shutdown
 */
export async function closeDatabase(): Promise<void> {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('✓ Database connection closed');
    }
  } catch (error) {
    console.error('✗ Error closing database connection:', error);
    throw error;
  }
}
