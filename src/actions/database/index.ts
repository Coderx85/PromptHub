// Export server actions
export {
  useCreateDocument,
  useFindById,
  useFind,
  useUpdateDocument,
  useDeleteDocument,
} from './DatabaseService.server';

// Export types
export type {
  IDatabaseService,
  DBResponse,
  FilterOptions,
  QueryOptions,
  PaginationOptions,
  BulkWriteResult,
  CollectionMetadata,
  DatabaseStats,
} from './DatabaseService.types';

export {
  DatabaseError,
  ConnectionError,
  QueryError,
  BatchOperationRequest,
  BatchOperationResponse,
  DatabaseErrorCode,
  paginationSchema,
  filterSchema,
  querySchema,
} from './DatabaseService.types';

// Export constants
export {
  DATABASE_ERROR_MESSAGES,
  DATABASE_SUCCESS_MESSAGES,
  DATABASE_CONFIG,
  PAGINATION_DEFAULTS,
  SORT_ORDER,
  MONGODB_ERROR_CODES,
} from './constants';
