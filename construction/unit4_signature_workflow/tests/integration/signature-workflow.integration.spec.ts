import request from 'supertest';
import { Application } from 'express';
import { createApp } from '../../src/app';
import { AppDataSource } from '../../src/database/data-source';

/**
 * Integration Tests for Signature Workflow API
 * 
 * These tests verify the complete request/response flow including:
 * - HTTP request handling
 * - Authentication/authorization
 * - Validation middleware
 * - Service layer execution
 * - Database operations
 * - Response formatting
 * 
 * NOTE: These tests require a running database.
 * Run `npm run migration:run` and `npm run seed` before running tests.
 */

describe('Signature Workflow API Integration Tests', () => {
  let app: Application;
  const mockToken = 'Bearer mock-jwt-token';

  beforeAll(async () => {
    // Initialize database connection
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    
    // Create Express app
    app = createApp();
  });

  afterAll(async () => {
    // Close database connection
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  describe('GET /api/reports/:reportId/signatures/status', () => {
    it('should return signature status for existing report', async () => {
      const response = await request(app)
        .get('/api/reports/report-001/signatures/status')
        .set('Authorization', mockToken)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('workflowState');
      expect(response.body).toHaveProperty('signatures');
      expect(response.body).toHaveProperty('progress');
      expect(response.body.workflowState.reportId).toBe('report-001');
    });

    it('should return 404 for non-existent report', async () => {
      const response = await request(app)
        .get('/api/reports/non-existent-report/signatures/status')
        .set('Authorization', mockToken)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should include user-specific information when userId provided', async () => {
      const response = await request(app)
        .get('/api/reports/report-001/signatures/status?userId=user-001')
        .set('Authorization', mockToken)
        .expect(200);

      expect(response.body).toHaveProperty('canCurrentUserSign');
    });
  });

  describe('GET /api/reports/:reportId/signatures/history', () => {
    it('should return signature history for completed workflow', async () => {
      const response = await request(app)
        .get('/api/reports/report-001/signatures/history')
        .set('Authorization', mockToken)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('signatures');
      expect(Array.isArray(response.body.signatures)).toBe(true);
      expect(response.body.signatures.length).toBeGreaterThan(0);
    });

    it('should return empty array for report with no signatures', async () => {
      const response = await request(app)
        .get('/api/reports/report-002/signatures/history')
        .set('Authorization', mockToken)
        .expect(200);

      expect(response.body.signatures).toEqual([]);
    });
  });

  describe('POST /api/reports/:reportId/signatures/submit', () => {
    it('should reject submission of incomplete report', async () => {
      const response = await request(app)
        .post('/api/reports/report-002/signatures/submit')
        .set('Authorization', mockToken)
        .send({ userId: 'user-002' })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject submission without userId', async () => {
      const response = await request(app)
        .post('/api/reports/report-001/signatures/submit')
        .set('Authorization', mockToken)
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/reports/:reportId/signatures', () => {
    it('should reject signature without disclaimer acknowledgement', async () => {
      const response = await request(app)
        .post('/api/reports/report-003/signatures')
        .set('Authorization', mockToken)
        .send({
          signatureType: 'BRANCH_ACKNOWLEDGEMENT',
          signatoryName: 'John Doe',
          disclaimerAcknowledged: false
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject signature with invalid signature type', async () => {
      const response = await request(app)
        .post('/api/reports/report-003/signatures')
        .set('Authorization', mockToken)
        .send({
          signatureType: 'INVALID_TYPE',
          signatoryName: 'John Doe',
          disclaimerAcknowledged: true
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject signature with empty signatory name', async () => {
      const response = await request(app)
        .post('/api/reports/report-003/signatures')
        .set('Authorization', mockToken)
        .send({
          signatureType: 'BRANCH_ACKNOWLEDGEMENT',
          signatoryName: '',
          disclaimerAcknowledged: true
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject signature with name exceeding 100 characters', async () => {
      const longName = 'a'.repeat(101);
      const response = await request(app)
        .post('/api/reports/report-003/signatures')
        .set('Authorization', mockToken)
        .send({
          signatureType: 'BRANCH_ACKNOWLEDGEMENT',
          signatoryName: longName,
          disclaimerAcknowledged: true
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/reports/:reportId/signatures/available-actions', () => {
    it('should return available actions for user', async () => {
      const response = await request(app)
        .get('/api/reports/report-003/signatures/available-actions?userId=user-001')
        .set('Authorization', mockToken)
        .expect(200);

      expect(response.body).toHaveProperty('actions');
      expect(response.body).toHaveProperty('canSign');
      expect(Array.isArray(response.body.actions)).toBe(true);
    });

    it('should require userId parameter', async () => {
      const response = await request(app)
        .get('/api/reports/report-003/signatures/available-actions')
        .set('Authorization', mockToken)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Health Check', () => {
    it('should return healthy status', async () => {
      const response = await request(app)
        .get('/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.status).toBe('healthy');
      expect(response.body.service).toBe('signature-workflow');
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for non-existent endpoint', async () => {
      const response = await request(app)
        .get('/api/non-existent-endpoint')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });
});
