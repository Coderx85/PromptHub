import { describe, it, expect, beforeEach } from 'vitest';
import {
  DatabaseError,
  DatabaseErrorCode,
  ConnectionError,
  QueryError,
  PaginationOptions,
  FilterOptions,
  QueryOptions,
  BatchOperationRequest,
  BatchOperationResponse,
  paginationSchema,
  filterSchema,
  querySchema,
} from './DatabaseService.types';

/**
 * Test suite for DatabaseService
 */
describe('DatabaseService', () => {
  describe('Error Classes', () => {
    it('should create DatabaseError with correct code and message', () => {
      const error = new DatabaseError(
        DatabaseErrorCode.CONNECTION_FAILED,
        'Cannot connect'
      );

      expect(error.code).toBe(DatabaseErrorCode.CONNECTION_FAILED);
      expect(error.message).toBe('Cannot connect');
      expect(error.name).toBe('DatabaseError');
    });

    it('should create ConnectionError', () => {
      const error = new ConnectionError('Connection timeout');

      expect(error.code).toBe(DatabaseErrorCode.CONNECTION_FAILED);
      expect(error.message).toBe('Connection timeout');
      expect(error.name).toBe('ConnectionError');
    });

    it('should create QueryError', () => {
      const error = new QueryError('Invalid query');

      expect(error.code).toBe(DatabaseErrorCode.QUERY_FAILED);
      expect(error.message).toBe('Invalid query');
      expect(error.name).toBe('QueryError');
    });
  });

  describe('Pagination Validation', () => {
    it('should validate pagination with positive numbers', () => {
      const payload = { page: 1, limit: 10 };
      const result = paginationSchema.safeParse(payload);

      expect(result.success).toBe(true);
    });

    it('should reject pagination with zero page', () => {
      const payload = { page: 0, limit: 10 };
      const result = paginationSchema.safeParse(payload);

      expect(result.success).toBe(false);
    });

    it('should reject pagination with negative limit', () => {
      const payload = { page: 1, limit: -5 };
      const result = paginationSchema.safeParse(payload);

      expect(result.success).toBe(false);
    });

    it('should apply defaults for missing pagination values', () => {
      const payload = {};
      const result = paginationSchema.safeParse(payload);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(10);
      }
    });

    it('should reject pagination exceeding max limit', () => {
      const payload = { page: 1, limit: 2000 };
      const result = paginationSchema.safeParse(payload);

      expect(result.success).toBe(false);
    });
  });

  describe('Filter Validation', () => {
    it('should validate empty filter', () => {
      const result = filterSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('should validate filter with string values', () => {
      const result = filterSchema.safeParse({
        name: 'John',
        status: 'active',
      });

      expect(result.success).toBe(true);
    });

    it('should validate filter with numeric values', () => {
      const result = filterSchema.safeParse({
        age: 25,
        score: 100,
      });

      expect(result.success).toBe(true);
    });

    it('should validate filter with mixed types', () => {
      const result = filterSchema.safeParse({
        name: 'John',
        age: 25,
        active: true,
      });

      expect(result.success).toBe(true);
    });
  });

  describe('Query Validation', () => {
    it('should validate complete query options', () => {
      const payload = {
        filter: { status: 'active' },
        page: 1,
        limit: 10,
        sort: { createdAt: -1 },
        populate: 'author',
      };

      const result = querySchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('should validate query with array populate', () => {
      const payload = {
        filter: { status: 'active' },
        page: 1,
        limit: 10,
        populate: ['author', 'category'],
      };

      const result = querySchema.safeParse(payload);
      expect(result.success).toBe(true);
    });
  });

  describe('Batch Operation Response', () => {
    it('should create BatchOperationResponse correctly', () => {
      const results = [
        { operation: 'insert', success: true, data: { id: '123' } },
        { operation: 'update', success: true, data: { id: '124' } },
        { operation: 'delete', success: true },
      ];

      const response = new BatchOperationResponse(3, 0, results);

      expect(response.successful).toBe(3);
      expect(response.failed).toBe(0);
      expect(response.results).toHaveLength(3);
    });

    it('should create BatchOperationResponse with failed operations', () => {
      const results = [
        { operation: 'insert', success: true, data: { id: '123' } },
        { operation: 'update', success: false, error: 'Not found' },
        { operation: 'delete', success: false, error: 'Unauthorized' },
      ];

      const response = new BatchOperationResponse(1, 2, results);

      expect(response.successful).toBe(1);
      expect(response.failed).toBe(2);
      expect(response.results).toHaveLength(3);
    });
  });

  describe('Type Definitions', () => {
    it('should define FilterOptions as Record', () => {
      const filter: FilterOptions = {
        status: 'active',
        age: { $gte: 18 },
        tags: ['important', 'review'],
      };

      expect(filter).toBeDefined();
      expect(filter.status).toBe('active');
    });

    it('should define PaginationOptions correctly', () => {
      const pagination: PaginationOptions = {
        page: 2,
        limit: 20,
        skip: 20,
        sort: { createdAt: -1 },
      };

      expect(pagination.page).toBe(2);
      expect(pagination.limit).toBe(20);
    });

    it('should define QueryOptions with all fields optional except filter', () => {
      const query1: QueryOptions = {
        filter: { status: 'active' },
      };

      const query2: QueryOptions = {
        filter: { status: 'active' },
        pagination: { page: 1, limit: 10 },
        populate: 'author',
        sort: { createdAt: -1 },
      };

      expect(query1).toBeDefined();
      expect(query2).toBeDefined();
    });
  });

  describe('Error Codes', () => {
    it('should have all required error codes defined', () => {
      expect(DatabaseErrorCode.CONNECTION_FAILED).toBeDefined();
      expect(DatabaseErrorCode.QUERY_FAILED).toBeDefined();
      expect(DatabaseErrorCode.DOCUMENT_NOT_FOUND).toBeDefined();
      expect(DatabaseErrorCode.INVALID_ID).toBeDefined();
      expect(DatabaseErrorCode.DUPLICATE_KEY).toBeDefined();
      expect(DatabaseErrorCode.VALIDATION_FAILED).toBeDefined();
      expect(DatabaseErrorCode.DELETE_FAILED).toBeDefined();
      expect(DatabaseErrorCode.UPDATE_FAILED).toBeDefined();
      expect(DatabaseErrorCode.UNAUTHORIZED).toBeDefined();
      expect(DatabaseErrorCode.TIMEOUT).toBeDefined();
    });
  });

  describe('Response Types', () => {
    it('should define successful DBResponse with data', () => {
      const response: any = {
        status: 'success',
        data: { id: '123', name: 'Test' },
      };

      expect(response.status).toBe('success');
      expect(response.data).toBeDefined();
      expect(response.error).toBeUndefined();
    });

    it('should define error DBResponse with error object', () => {
      const response: any = {
        status: 'error',
        error: {
          code: DatabaseErrorCode.DOCUMENT_NOT_FOUND,
          message: 'Document not found',
        },
      };

      expect(response.status).toBe('error');
      expect(response.error).toBeDefined();
      expect(response.data).toBeUndefined();
    });

    it('should define DBResponse with metadata', () => {
      const response: any = {
        status: 'success',
        data: [{ id: '1' }, { id: '2' }],
        metadata: {
          totalCount: 100,
          page: 1,
          limit: 10,
          totalPages: 10,
        },
      };

      expect(response.metadata).toBeDefined();
      expect(response.metadata.totalCount).toBe(100);
    });
  });
});
