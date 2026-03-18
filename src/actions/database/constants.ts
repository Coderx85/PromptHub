/**
 * Database Service Error Messages
 */
export const DATABASE_ERROR_MESSAGES = {
  CONNECTION_FAILED: 'Failed to connect to database',
  QUERY_FAILED: 'Database query failed',
  DOCUMENT_NOT_FOUND: 'Document not found',
  INVALID_ID: 'Invalid document ID',
  DUPLICATE_KEY: 'Duplicate key error',
  VALIDATION_FAILED: 'Data validation failed',
  DELETE_FAILED: 'Failed to delete document',
  UPDATE_FAILED: 'Failed to update document',
  UNAUTHORIZED: 'Unauthorized database access',
  TIMEOUT: 'Database operation timeout',
  INVALID_FILTER: 'Invalid filter provided',
  INVALID_PAGINATION: 'Invalid pagination options',
  BATCH_FAILED: 'Batch operation failed',
} as const;

/**
 * Database Service Configuration
 */
export const DATABASE_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 1000,
  CONNECTION_TIMEOUT_MS: 30000, // 30 seconds
  QUERY_TIMEOUT_MS: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000, // 1 second
  MAX_BATCH_SIZE: 1000,
  CACHE_DURATION_MS: 300000, // 5 minutes
} as const;

/**
 * Database Success Messages
 */
export const DATABASE_SUCCESS_MESSAGES = {
  DOCUMENT_CREATED: 'Document created successfully',
  DOCUMENT_UPDATED: 'Document updated successfully',
  DOCUMENT_DELETED: 'Document deleted successfully',
  DOCUMENTS_DELETED: 'Documents deleted successfully',
  BATCH_OPERATION_COMPLETED: 'Batch operation completed',
} as const;

/**
 * Pagination Default Values
 */
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

/**
 * Sort Order
 */
export const SORT_ORDER = {
  ASC: 1,
  DESC: -1,
} as const;

/**
 * Common MongoDB error codes
 */
export const MONGODB_ERROR_CODES = {
  DUPLICATE_KEY: 11000,
  DUPLICATE_KEY_ALT: 11001,
  WRITE_CONCERN_FAILED: 64,
  NOT_FOUND: 69,
  COMMAND_NOT_FOUND: 59,
} as const;
