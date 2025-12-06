import { Repository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';

/**
 * Mock Factory - Creates mock objects for testing
 */

export class MockFactory {
  /**
   * Create a mock TypeORM Repository
   */
  static createMockRepository<T>(): jest.Mocked<Repository<T>> {
    return {
      find: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn(),
      manager: {} as any,
      metadata: {} as any,
      target: {} as any,
      query: jest.fn(),
      clear: jest.fn(),
      count: jest.fn(),
      countBy: jest.fn(),
      decrement: jest.fn(),
      exist: jest.fn(),
      existsBy: jest.fn(),
      extend: jest.fn(),
      findAndCount: jest.fn(),
      findAndCountBy: jest.fn(),
      findBy: jest.fn(),
      findOneByOrFail: jest.fn(),
      findOneOrFail: jest.fn(),
      getId: jest.fn(),
      hasId: jest.fn(),
      increment: jest.fn(),
      insert: jest.fn(),
      merge: jest.fn(),
      preload: jest.fn(),
      recover: jest.fn(),
      remove: jest.fn(),
      restore: jest.fn(),
      softDelete: jest.fn(),
      softRemove: jest.fn(),
      sum: jest.fn(),
      average: jest.fn(),
      maximum: jest.fn(),
      minimum: jest.fn(),
      upsert: jest.fn()
    } as any;
  }

  /**
   * Create a mock Express Request
   */
  static createMockRequest(overrides?: Partial<Request>): Partial<Request> {
    return {
      params: {},
      query: {},
      body: {},
      headers: {},
      user: undefined,
      ip: '127.0.0.1',
      ...overrides
    };
  }

  /**
   * Create a mock Express Response
   */
  static createMockResponse(): Partial<Response> {
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      sendStatus: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis()
    };
    return res;
  }

  /**
   * Create a mock Express NextFunction
   */
  static createMockNext(): NextFunction {
    return jest.fn();
  }

  /**
   * Create a mock User Management Client
   */
  static createMockUserManagementClient() {
    return {
      getUser: jest.fn(),
      validateUserRole: jest.fn()
    };
  }

  /**
   * Create a mock Report Management Client
   */
  static createMockReportManagementClient() {
    return {
      getReport: jest.fn(),
      validateReportCompleteness: jest.fn(),
      updateReportStatus: jest.fn(),
      getAssignedSignatory: jest.fn()
    };
  }

  /**
   * Create a mock Notification Client
   */
  static createMockNotificationClient() {
    return {
      sendNotification: jest.fn(),
      sendBulkNotification: jest.fn()
    };
  }

  /**
   * Create a mock Logger
   */
  static createMockLogger() {
    return {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn()
    };
  }
}
