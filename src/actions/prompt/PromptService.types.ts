import { z } from 'zod';

/**
 * Error codes for Prompt Service
 */
export enum PromptErrorCode {
  INVALID_PROMPT = 'PROMPT_ERR_001',
  INVALID_TAG = 'PROMPT_ERR_002',
  PROMPT_NOT_FOUND = 'PROMPT_ERR_003',
  UNAUTHORIZED = 'PROMPT_ERR_004',
  DATABASE_ERROR = 'PROMPT_ERR_005',
  VALIDATION_ERROR = 'PROMPT_ERR_006',
  INVALID_USER_ID = 'PROMPT_ERR_007',
  DUPLICATE_PROMPT = 'PROMPT_ERR_008',
}

/**
 * Response status types
 */
export type ResponseStatus = 'success' | 'error';

/**
 * Generic Action Response wrapper
 */
export interface ActionResponse<T> {
  status: ResponseStatus;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Prompt Data Transfer Object
 */
export class PromptDTO {
  constructor(
    public _id: string,
    public creator: CreatorDTO,
    public prompt: string,
    public tag: string,
    public likes?: number,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
}

/**
 * Creator Data Transfer Object
 */
export class CreatorDTO {
  constructor(
    public _id: string,
    public username: string,
    public email: string,
    public image?: string
  ) {}
}

/**
 * Request DTOs
 */
export class CreatePromptRequest {
  constructor(
    public prompt: string,
    public tag: string,
    public userId: string
  ) {}
}

export class UpdatePromptRequest {
  constructor(
    public promptId: string,
    public prompt: string,
    public tag: string,
    public userId: string
  ) {}
}

export class DeletePromptRequest {
  constructor(public promptId: string, public userId: string) {}
}

export class FetchPromptRequest {
  constructor(public promptId: string) {}
}

export class FetchAllPromptsRequest {
  constructor(public page: number = 1, public limit: number = 10) {}
}

export class FetchUserPromptsRequest {
  constructor(
    public userId: string,
    public page: number = 1,
    public limit: number = 10
  ) {}
}

/**
 * Response DTOs
 */
export class PromptResponse {
  constructor(
    public _id: string,
    public creator: CreatorDTO,
    public prompt: string,
    public tag: string,
    public likes: number = 0,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
}

export class CreatePromptResponse {
  constructor(
    public promptId: string,
    public message: string
  ) {}
}

/**
 * Custom Error Classes
 */
export class PromptError extends Error {
  constructor(public code: PromptErrorCode, message: string) {
    super(message);
    this.name = 'PromptError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validation Schemas using Zod
 */
export const createPromptSchema = z.object({
  prompt: z
    .string()
    .min(10, 'Prompt must be at least 10 characters long')
    .max(5000, 'Prompt must not exceed 5000 characters'),
  tag: z
    .string()
    .min(1, 'Tag is required')
    .max(50, 'Tag must not exceed 50 characters')
    .regex(/^#/, 'Tag must start with #'),
  userId: z.string().min(1, 'User ID is required'),
});

export const updatePromptSchema = z.object({
  promptId: z.string().min(1, 'Prompt ID is required'),
  prompt: z
    .string()
    .min(10, 'Prompt must be at least 10 characters long')
    .max(5000, 'Prompt must not exceed 5000 characters'),
  tag: z
    .string()
    .min(1, 'Tag is required')
    .max(50, 'Tag must not exceed 50 characters')
    .regex(/^#/, 'Tag must start with #'),
  userId: z.string().min(1, 'User ID is required'),
});

export const deletePromptSchema = z.object({
  promptId: z.string().min(1, 'Prompt ID is required'),
  userId: z.string().min(1, 'User ID is required'),
});

export const fetchPromptSchema = z.object({
  promptId: z.string().min(1, 'Prompt ID is required'),
});

export const fetchAllPromptsSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(10),
});

export const fetchUserPromptsSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(10),
});

export interface createPromptInput extends z.infer<typeof createPromptSchema> {}
export type updatePromptInput = z.infer<typeof updatePromptSchema>;
export type deletePromptInput = z.infer<typeof deletePromptSchema>;
export type fetchPromptInput = z.infer<typeof fetchPromptSchema>;
export type fetchAllPromptsInput = z.infer<typeof fetchAllPromptsSchema>;
export type fetchUserPromptsInput = z.infer<typeof fetchUserPromptsSchema>;

/**
 * Service Interface
 */
export interface IPromptService {
  createPrompt(
    request: createPromptInput
  ): Promise<CreatePromptResponse>;
  updatePrompt(request: UpdatePromptRequest): Promise<PromptResponse>;
  deletePrompt(request: DeletePromptRequest): Promise<void>;
  getPromptById(request: FetchPromptRequest): Promise<PromptResponse>;
  getAllPrompts(
    request: FetchAllPromptsRequest
  ): Promise<PromptResponse[]>;
  getUserPrompts(
    request: FetchUserPromptsRequest
  ): Promise<PromptResponse[]>;
}
