import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

/**
 * Database Configuration for SQLite
 * 
 * This configuration uses SQLite for local development - a file-based database
 * that requires no server installation or Docker.
 * 
 * LOCAL DEVELOPMENT:
 * - Uses SQLite file-based database (./data/signature_workflow.db)
 * - No server required - just a file
 * - Perfect for development and testing
 * - Database file is created automatically
 * 
 * PRODUCTION MIGRATION NOTES:
 * 
 * When migrating to production, you can switch to any database supported by TypeORM:
 * 
 * 1. POSTGRESQL (Recommended for Production):
 *    type: 'postgres',
 *    host: process.env.DB_HOST,
 *    port: 5432,
 *    database: process.env.DB_NAME,
 *    username: process.env.DB_USER,
 *    password: process.env.DB_PASSWORD,
 *    ssl: { rejectUnauthorized: false }
 * 
 * 2. MS SQL SERVER / AZURE SQL:
 *    type: 'mssql',
 *    host: process.env.DB_HOST,
 *    port: 1433,
 *    database: process.env.DB_NAME,
 *    username: process.env.DB_USER,
 *    password: process.env.DB_PASSWORD,
 *    options: { encrypt: true, trustServerCertificate: false }
 * 
 * 3. MYSQL / MARIADB:
 *    type: 'mysql',
 *    host: process.env.DB_HOST,
 *    port: 3306,
 *    database: process.env.DB_NAME,
 *    username: process.env.DB_USER,
 *    password: process.env.DB_PASSWORD
 * 
 * MIGRATION STRATEGY:
 * - All entities are database-agnostic (no SQLite-specific code)
 * - Migrations will need to be regenerated for production database
 * - Data can be exported from SQLite and imported to production DB
 * - Test migrations in staging environment first
 * 
 * SECURITY NOTES:
 * - Store production credentials in secure vault (Azure Key Vault, AWS Secrets Manager)
 * - Never commit database files to version control (add to .gitignore)
 * - Use environment variables for all configuration
 * - Enable SSL/TLS for production database connections
 */

// Determine database path
const dbPath = process.env.DB_PATH || path.join(__dirname, '../../data/signature_workflow.db');

export const databaseConfig: DataSourceOptions = {
  type: 'sqlite',
  
  // SQLite database file path
  database: dbPath,
  
  // Entity and migration paths
  entities: ['src/features/**/entities/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  
  // Synchronization
  // PRODUCTION: ALWAYS set to false, use migrations instead
  synchronize: process.env.NODE_ENV === 'development',
  
  // Logging
  // PRODUCTION: Set to ['error'] or false to reduce log volume
  logging: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error']
};
