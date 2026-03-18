'use server';

import mongoose from 'mongoose';
import { connectToDB } from '@/utils/database';
import {
  IDatabaseService,
  DBResponse,
  FilterOptions,
  QueryOptions,
  PaginationOptions,
  DatabaseError,
  DatabaseErrorCode,
  BatchOperationRequest,
  BatchOperationResponse,
} from './DatabaseService.types';
import {
  DATABASE_ERROR_MESSAGES,
  DATABASE_CONFIG,
  DATABASE_SUCCESS_MESSAGES,
  MONGODB_ERROR_CODES,
} from './constants';

/**
 * MongoDB Database Service Implementation
 * Generic CRUD operations for any MongoDB model
 */
class MongoDBService<T> implements IDatabaseService<T> {
  private model: mongoose.Model<any>;
  private isConnectedFlag: boolean = false;

  constructor(model: mongoose.Model<any>) {
    this.model = model;
  }

  /**
   * Connect to database
   */
  async connect(): Promise<void> {
    try {
      await connectToDB();
      this.isConnectedFlag = true;
    } catch (error) {
      console.error('Database connection error:', error);
      throw new DatabaseError(
        DatabaseErrorCode.CONNECTION_FAILED,
        DATABASE_ERROR_MESSAGES.CONNECTION_FAILED
      );
    }
  }

  /**
   * Disconnect from database
   */
  async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      this.isConnectedFlag = false;
    } catch (error) {
      console.error('Database disconnection error:', error);
      throw new DatabaseError(
        DatabaseErrorCode.CONNECTION_FAILED,
        DATABASE_ERROR_MESSAGES.CONNECTION_FAILED
      );
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.isConnectedFlag || mongoose.connection.readyState === 1;
  }

  /**
   * Create a single document
   */
  async create(data: any): Promise<T> {
    try {
      await this.ensureConnection();

      const document = new this.model(data);
      const savedDocument = await document.save();
      return savedDocument.toObject() as T;
    } catch (error) {
      console.error('Create document error:', error);
      if (this.isDuplicateKeyError(error)) {
        throw new DatabaseError(
          DatabaseErrorCode.DUPLICATE_KEY,
          DATABASE_ERROR_MESSAGES.DUPLICATE_KEY
        );
      }
      throw new DatabaseError(
        DatabaseErrorCode.QUERY_FAILED,
        DATABASE_ERROR_MESSAGES.QUERY_FAILED
      );
    }
  }

  /**
   * Create multiple documents
   */
  async createMany(data: any[]): Promise<T[]> {
    try {
      await this.ensureConnection();

      const documents = await this.model.insertMany(data);
      return documents.map((doc) => doc.toObject() as T);
    } catch (error) {
      console.error('Create many documents error:', error);
      throw new DatabaseError(
        DatabaseErrorCode.QUERY_FAILED,
        DATABASE_ERROR_MESSAGES.QUERY_FAILED
      );
    }
  }

  /**
   * Find document by ID
   */
  async findById(id: string, options?: QueryOptions): Promise<T | null> {
    try {
      await this.ensureConnection();

      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new DatabaseError(
          DatabaseErrorCode.INVALID_ID,
          DATABASE_ERROR_MESSAGES.INVALID_ID
        );
      }

      let query = this.model.findById(id);

      if (options?.populate) {
        query = query.populate(options.populate);
      }

      if (options?.select) {
        query = query.select(options.select);
      }

      const document = await query.exec();
      return document ? (document.toObject() as T) : null;
    } catch (error) {
      console.error('Find by ID error:', error);
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError(
        DatabaseErrorCode.QUERY_FAILED,
        DATABASE_ERROR_MESSAGES.QUERY_FAILED
      );
    }
  }

  /**
   * Find documents by filter
   */
  async find(
    filter: FilterOptions,
    options?: QueryOptions
  ): Promise<{ data: T[]; total: number }> {
    try {
      await this.ensureConnection();

      // Get total count
      const total = await this.model.countDocuments(filter);

      // Apply pagination
      const pagination = this.getPagination(options?.pagination);
      let query = this.model
        .find(filter)
        .skip(pagination.skip)
        .limit(pagination.limit);

      // Apply sort
      if (options?.sort) {
        query = query.sort(options.sort);
      }

      // Apply populate
      if (options?.populate) {
        query = query.populate(options.populate);
      }

      // Apply select
      if (options?.select) {
        query = query.select(options.select);
      }

      const documents = await query.exec();
      return {
        data: documents.map((doc) => doc.toObject() as T),
        total,
      };
    } catch (error) {
      console.error('Find documents error:', error);
      throw new DatabaseError(
        DatabaseErrorCode.QUERY_FAILED,
        DATABASE_ERROR_MESSAGES.QUERY_FAILED
      );
    }
  }

  /**
   * Find all documents with pagination
   */
  async findAll(options?: QueryOptions): Promise<{ data: T[]; total: number }> {
    try {
      await this.ensureConnection();

      const total = await this.model.countDocuments();
      const pagination = this.getPagination(options?.pagination);

      let query = this.model
        .find()
        .skip(pagination.skip)
        .limit(pagination.limit);

      if (options?.sort) {
        query = query.sort(options.sort);
      }

      if (options?.populate) {
        query = query.populate(options.populate);
      }

      if (options?.select) {
        query = query.select(options.select);
      }

      const documents = await query.exec();
      return {
        data: documents.map((doc) => doc.toObject() as T),
        total,
      };
    } catch (error) {
      console.error('Find all documents error:', error);
      throw new DatabaseError(
        DatabaseErrorCode.QUERY_FAILED,
        DATABASE_ERROR_MESSAGES.QUERY_FAILED
      );
    }
  }

  /**
   * Find one document
   */
  async findOne(
    filter: FilterOptions,
    options?: QueryOptions
  ): Promise<T | null> {
    try {
      await this.ensureConnection();

      let query = this.model.findOne(filter);

      if (options?.populate) {
        query = query.populate(options.populate);
      }

      if (options?.select) {
        query = query.select(options.select);
      }

      const document = await query.exec();
      return document ? (document.toObject() as T) : null;
    } catch (error) {
      console.error('Find one document error:', error);
      throw new DatabaseError(
        DatabaseErrorCode.QUERY_FAILED,
        DATABASE_ERROR_MESSAGES.QUERY_FAILED
      );
    }
  }

  /**
   * Update a document
   */
  async update(
    id: string,
    data: any,
    options?: QueryOptions
  ): Promise<T> {
    try {
      await this.ensureConnection();

      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new DatabaseError(
          DatabaseErrorCode.INVALID_ID,
          DATABASE_ERROR_MESSAGES.INVALID_ID
        );
      }

      let query = this.model.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (options?.populate) {
        query = query.populate(options.populate);
      }

      const document = await query.exec();
      if (!document) {
        throw new DatabaseError(
          DatabaseErrorCode.DOCUMENT_NOT_FOUND,
          DATABASE_ERROR_MESSAGES.DOCUMENT_NOT_FOUND
        );
      }

      return document.toObject() as T;
    } catch (error) {
      console.error('Update document error:', error);
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError(
        DatabaseErrorCode.UPDATE_FAILED,
        DATABASE_ERROR_MESSAGES.UPDATE_FAILED
      );
    }
  }

  /**
   * Update multiple documents
   */
  async updateMany(
    filter: FilterOptions,
    data: any,
    options?: QueryOptions
  ): Promise<{ modifiedCount: number }> {
    try {
      await this.ensureConnection();

      const result = await this.model.updateMany(filter, data, {
        runValidators: true,
      });

      return { modifiedCount: result.modifiedCount };
    } catch (error) {
      console.error('Update many documents error:', error);
      throw new DatabaseError(
        DatabaseErrorCode.UPDATE_FAILED,
        DATABASE_ERROR_MESSAGES.UPDATE_FAILED
      );
    }
  }

  /**
   * Delete a document
   */
  async delete(id: string): Promise<void> {
    try {
      await this.ensureConnection();

      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new DatabaseError(
          DatabaseErrorCode.INVALID_ID,
          DATABASE_ERROR_MESSAGES.INVALID_ID
        );
      }

      const result = await this.model.findByIdAndDelete(id);
      if (!result) {
        throw new DatabaseError(
          DatabaseErrorCode.DOCUMENT_NOT_FOUND,
          DATABASE_ERROR_MESSAGES.DOCUMENT_NOT_FOUND
        );
      }
    } catch (error) {
      console.error('Delete document error:', error);
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError(
        DatabaseErrorCode.DELETE_FAILED,
        DATABASE_ERROR_MESSAGES.DELETE_FAILED
      );
    }
  }

  /**
   * Delete multiple documents
   */
  async deleteMany(filter: FilterOptions): Promise<{ deletedCount: number }> {
    try {
      await this.ensureConnection();

      const result = await this.model.deleteMany(filter);
      return { deletedCount: result.deletedCount };
    } catch (error) {
      console.error('Delete many documents error:', error);
      throw new DatabaseError(
        DatabaseErrorCode.DELETE_FAILED,
        DATABASE_ERROR_MESSAGES.DELETE_FAILED
      );
    }
  }

  /**
   * Count documents
   */
  async count(filter?: FilterOptions): Promise<number> {
    try {
      await this.ensureConnection();

      return await this.model.countDocuments(filter || {});
    } catch (error) {
      console.error('Count documents error:', error);
      throw new DatabaseError(
        DatabaseErrorCode.QUERY_FAILED,
        DATABASE_ERROR_MESSAGES.QUERY_FAILED
      );
    }
  }

  /**
   * Check if document exists
   */
  async exists(filter: FilterOptions): Promise<boolean> {
    try {
      await this.ensureConnection();

      const document = await this.model.findOne(filter).exec();
      return document !== null;
    } catch (error) {
      console.error('Exists check error:', error);
      throw new DatabaseError(
        DatabaseErrorCode.QUERY_FAILED,
        DATABASE_ERROR_MESSAGES.QUERY_FAILED
      );
    }
  }

  /**
   * Aggregate data
   */
  async aggregate(pipeline: any[]): Promise<any[]> {
    try {
      await this.ensureConnection();

      return await this.model.aggregate(pipeline).exec();
    } catch (error) {
      console.error('Aggregate error:', error);
      throw new DatabaseError(
        DatabaseErrorCode.QUERY_FAILED,
        DATABASE_ERROR_MESSAGES.QUERY_FAILED
      );
    }
  }

  /**
   * Transaction support (MongoDB sessions)
   */
  async transaction<R>(callback: () => Promise<R>): Promise<R> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const result = await callback();
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      console.error('Transaction error:', error);
      throw error;
    } finally {
      await session.endSession();
    }
  }

  /**
   * Batch operations
   */
  async batch(
    operations: BatchOperationRequest<T>
  ): Promise<BatchOperationResponse> {
    try {
      await this.ensureConnection();

      const results: any[] = [];
      let successful = 0;
      let failed = 0;

      for (const operation of operations.operations) {
        try {
          let result;
          switch (operation.type) {
            case 'insert':
              result = await this.create(operation.data);
              successful++;
              results.push({
                operation: 'insert',
                success: true,
                data: result,
              });
              break;

            case 'update':
              result = await this.update((operation.data as any)._id, operation.data);
              successful++;
              results.push({
                operation: 'update',
                success: true,
                data: result,
              });
              break;

            case 'delete':
              await this.delete((operation.data as any)._id);
              successful++;
              results.push({
                operation: 'delete',
                success: true,
              });
              break;
          }
        } catch (error) {
          failed++;
          results.push({
            operation: operation.type,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }

      return new BatchOperationResponse(successful, failed, results);
    } catch (error) {
      console.error('Batch operation error:', error);
      throw new DatabaseError(
        DatabaseErrorCode.QUERY_FAILED,
        DATABASE_ERROR_MESSAGES.QUERY_FAILED
      );
    }
  }

  /**
   * Helper: Ensure database connection
   */
  private async ensureConnection(): Promise<void> {
    if (!this.isConnected()) {
      await this.connect();
    }
  }

  /**
   * Helper: Get pagination options
   */
  private getPagination(pagination?: PaginationOptions): {
    skip: number;
    limit: number;
  } {
    const page = pagination?.page || DATABASE_CONFIG.DEFAULT_PAGE;
    const limit = Math.min(
      pagination?.limit || DATABASE_CONFIG.DEFAULT_LIMIT,
      DATABASE_CONFIG.MAX_LIMIT
    );
    const skip = (page - 1) * limit;

    return { skip, limit };
  }

  /**
   * Helper: Check if error is duplicate key error
   */
  private isDuplicateKeyError(error: any): boolean {
    return (
      error.code === MONGODB_ERROR_CODES.DUPLICATE_KEY ||
      error.code === MONGODB_ERROR_CODES.DUPLICATE_KEY_ALT ||
      (error.message && error.message.includes('duplicate key'))
    );
  }
}

/**
 * Create database service instance
 * Note: This is NOT a server action - it's a plain factory function
 */
function createDatabaseServiceInstance<T>(
  model: mongoose.Model<any>
): IDatabaseService<T> {
  return new MongoDBService<T>(model);
}

/**
 * Server Action: Generic create operation
 */
export async function useCreateDocument<T>(
  model: mongoose.Model<any>,
  data: any
): Promise<DBResponse<T>> {
  try {
    const service = createDatabaseServiceInstance<T>(model);
    const result = await service.create(data);
    return {
      status: 'success',
      data: result,
    };
  } catch (error) {
    console.error('Server action error:', error);
    if (error instanceof DatabaseError) {
      return {
        status: 'error',
        error: {
          code: error.code,
          message: error.message,
        },
      };
    }
    return {
      status: 'error',
      error: {
        code: DatabaseErrorCode.QUERY_FAILED,
        message: DATABASE_ERROR_MESSAGES.QUERY_FAILED,
      },
    };
  }
}

/**
 * Server Action: Generic find by ID operation
 */
export async function useFindById<T>(
  model: mongoose.Model<any>,
  id: string,
  options?: QueryOptions
): Promise<DBResponse<T | null>> {
  try {
    const service = createDatabaseServiceInstance<T>(model);
    const result = await service.findById(id, options);
    return {
      status: 'success',
      data: result,
    };
  } catch (error) {
    console.error('Server action error:', error);
    if (error instanceof DatabaseError) {
      return {
        status: 'error',
        error: {
          code: error.code,
          message: error.message,
        },
      };
    }
    return {
      status: 'error',
      error: {
        code: DatabaseErrorCode.QUERY_FAILED,
        message: DATABASE_ERROR_MESSAGES.QUERY_FAILED,
      },
    };
  }
}

/**
 * Server Action: Generic find operation
 */
export async function useFind<T>(
  model: mongoose.Model<any>,
  filter: FilterOptions,
  options?: QueryOptions
): Promise<
  DBResponse<{ data: T[]; total: number }>
> {
  try {
    const service = createDatabaseServiceInstance<T>(model);
    const result = await service.find(filter, options);
    return {
      status: 'success',
      data: result,
      metadata: {
        totalCount: result.total,
        page: options?.pagination?.page || 1,
        limit: options?.pagination?.limit || DATABASE_CONFIG.DEFAULT_LIMIT,
      },
    };
  } catch (error) {
    console.error('Server action error:', error);
    if (error instanceof DatabaseError) {
      return {
        status: 'error',
        error: {
          code: error.code,
          message: error.message,
        },
      };
    }
    return {
      status: 'error',
      error: {
        code: DatabaseErrorCode.QUERY_FAILED,
        message: DATABASE_ERROR_MESSAGES.QUERY_FAILED,
      },
    };
  }
}

/**
 * Server Action: Generic update operation
 */
export async function useUpdateDocument<T>(
  model: mongoose.Model<any>,
  id: string,
  data: any,
  options?: QueryOptions
): Promise<DBResponse<T>> {
  try {
    const service = createDatabaseServiceInstance<T>(model);
    const result = await service.update(id, data, options);
    return {
      status: 'success',
      data: result,
    };
  } catch (error) {
    console.error('Server action error:', error);
    if (error instanceof DatabaseError) {
      return {
        status: 'error',
        error: {
          code: error.code,
          message: error.message,
        },
      };
    }
    return {
      status: 'error',
      error: {
        code: DatabaseErrorCode.UPDATE_FAILED,
        message: DATABASE_ERROR_MESSAGES.UPDATE_FAILED,
      },
    };
  }
}

/**
 * Server Action: Generic delete operation
 */
export async function useDeleteDocument(
  model: mongoose.Model<any>,
  id: string
): Promise<DBResponse<{ message: string }>> {
  try {
    const service = createDatabaseServiceInstance(model);
    await service.delete(id);
    return {
      status: 'success',
      data: { message: DATABASE_SUCCESS_MESSAGES.DOCUMENT_DELETED },
    };
  } catch (error) {
    console.error('Server action error:', error);
    if (error instanceof DatabaseError) {
      return {
        status: 'error',
        error: {
          code: error.code,
          message: error.message,
        },
      };
    }
    return {
      status: 'error',
      error: {
        code: DatabaseErrorCode.DELETE_FAILED,
        message: DATABASE_ERROR_MESSAGES.DELETE_FAILED,
      },
    };
  }
}
