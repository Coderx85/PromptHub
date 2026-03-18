import { z } from 'zod';

/**
 * Error codes for Database Service
 */
export enum DatabaseErrorCode {
  CONNECTION_FAILED = 'DB_ERR_001',
  QUERY_FAILED = 'DB_ERR_002',
  DOCUMENT_NOT_FOUND = 'DB_ERR_003',
  INVALID_ID = 'DB_ERR_004',
  DUPLICATE_KEY = 'DB_ERR_005',
  VALIDATION_FAILED = 'DB_ERR_006',
  DELETE_FAILED = 'DB_ERR_007',
  UPDATE_FAILED = 'DB_ERR_008',
  UNAUTHORIZED = 'DB_ERR_009',
  TIMEOUT = 'DB_ERR_010',
}

/**
 * Response status types
 */
export type DBResponseStatus = 'success' | 'error';

/**
 * Generic Database Response wrapper
 */
export interface DBResponse<T> {
  status: DBResponseStatus;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  metadata?: {
    totalCount?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  page: number;
  limit: number;
  skip?: number;
  sort?: Record<string, 1 | -1>;
}

/**
 * Filter options for querying
 */
export interface FilterOptions {
  [key: string]: any;
}

/**
 * Query options combining filter and pagination
 */
export interface QueryOptions {
  filter?: FilterOptions;
  pagination?: PaginationOptions;
  populate?: string | string[];
  select?: string | string[];
  sort?: Record<string, 1 | -1>;
}

/**
 * Batch operation request
 */
export class BatchOperationRequest<T> {
  constructor(
    public operations: Array<{
      type: 'insert' | 'update' | 'delete';
      data: T;
    }>
  ) {}
}

/**
 * Batch operation response
 */
export class BatchOperationResponse {
  constructor(
    public successful: number,
    public failed: number,
    public results: Array<{
      operation: string;
      success: boolean;
      data?: any;
      error?: string;
    }>
  ) {}
}

/**
 * Bulk write result
 */
export interface BulkWriteResult {
  insertedCount: number;
  matchedCount: number;
  modifiedCount: number;
  deletedCount: number;
  upsertedCount: number;
}

/**
 * Database Error
 */
export class DatabaseError extends Error {
  constructor(public code: DatabaseErrorCode, message: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

/**
 * Connection Error
 */
export class ConnectionError extends DatabaseError {
  constructor(message: string) {
    super(DatabaseErrorCode.CONNECTION_FAILED, message);
    this.name = 'ConnectionError';
  }
}

/**
 * Query Error
 */
export class QueryError extends DatabaseError {
  constructor(message: string) {
    super(DatabaseErrorCode.QUERY_FAILED, message);
    this.name = 'QueryError';
  }
}

/**
 * Validation schemas
 */
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(1000).default(10),
});

export const filterSchema = z.record(z.string(), z.any()).optional();

export const querySchema = z.object({
  filter: filterSchema,
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(1000).default(10),
  sort: z.record(z.string(), z.union([z.literal(1), z.literal(-1)])).optional(),
  populate: z.union([z.string(), z.array(z.string())]).optional(),
  select: z.union([z.string(), z.array(z.string())]).optional(),
});

/**
 * Generic Database Service Interface
 * Can be implemented for different databases (MongoDB, PostgreSQL, etc)
 */
export interface IDatabaseService<T> {
  /**
   * Connect to database
   */
  connect(): Promise<void>;

  /**
   * Disconnect from database
   */
  disconnect(): Promise<void>;

  /**
   * Check if connected
   */
  isConnected(): boolean;

  /**
   * Create a single document
   */
  create(data: any): Promise<T>;

  /**
   * Create multiple documents
   */
  createMany(data: any[]): Promise<T[]>;

  /**
   * Find a document by ID
   */
  findById(id: string, options?: QueryOptions): Promise<T | null>;

  /**
   * Find documents by filter
   */
  find(
    filter: FilterOptions,
    options?: QueryOptions
  ): Promise<{ data: T[]; total: number }>;

  /**
   * Find all documents
   */
  findAll(options?: QueryOptions): Promise<{ data: T[]; total: number }>;

  /**
   * Find one document
   */
  findOne(filter: FilterOptions, options?: QueryOptions): Promise<T | null>;

  /**
   * Update a document
   */
  update(id: string, data: any, options?: QueryOptions): Promise<T>;

  /**
   * Update multiple documents
   */
  updateMany(
    filter: FilterOptions,
    data: any,
    options?: QueryOptions
  ): Promise<{ modifiedCount: number }>;

  /**
   * Delete a document
   */
  delete(id: string): Promise<void>;

  /**
   * Delete multiple documents
   */
  deleteMany(filter: FilterOptions): Promise<{ deletedCount: number }>;

  /**
   * Count documents
   */
  count(filter?: FilterOptions): Promise<number>;

  /**
   * Check if document exists
   */
  exists(filter: FilterOptions): Promise<boolean>;

  /**
   * Aggregate data
   */
  aggregate(
    pipeline: any[]
  ): Promise<any[]>;

  /**
   * Transaction support
   */
  transaction<R>(
    callback: () => Promise<R>
  ): Promise<R>;

  /**
   * Batch operations
   */
  batch(operations: BatchOperationRequest<T>): Promise<BatchOperationResponse>;
}

/**
 * Collection metadata
 */
export interface CollectionMetadata {
  name: string;
  isConnected: boolean;
  documentCount?: number;
  createdAt?: Date;
  lastModified?: Date;
}

/**
 * Database statistics
 */
export interface DatabaseStats {
  collections: CollectionMetadata[];
  totalDocuments: number;
  isConnected: boolean;
  connectionTime?: Date;
  connectionLocation?: string;
}
