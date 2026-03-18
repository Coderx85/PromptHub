/**
 * Prompt Service Error Messages
 */
export const PROMPT_ERROR_MESSAGES = {
  INVALID_PROMPT: 'Prompt content is invalid or empty',
  INVALID_TAG: 'Tag must start with # and be non-empty',
  PROMPT_NOT_FOUND: 'Prompt not found',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  DATABASE_ERROR: 'Database operation failed',
  VALIDATION_ERROR: 'Validation failed',
  INVALID_USER_ID: 'User ID is invalid',
  DUPLICATE_PROMPT: 'This prompt already exists',
} as const;

/**
 * Prompt Service Configuration
 */
export const PROMPT_CONFIG = {
  MAX_PROMPT_LENGTH: 5000,
  MIN_PROMPT_LENGTH: 10,
  MAX_TAG_LENGTH: 50,
  MIN_TAG_LENGTH: 1,
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  CACHE_DURATION_MS: 300000, // 5 minutes
} as const;

/**
 * Prompt Service Success Messages
 */
export const PROMPT_SUCCESS_MESSAGES = {
  PROMPT_CREATED: 'Prompt created successfully',
  PROMPT_UPDATED: 'Prompt updated successfully',
  PROMPT_DELETED: 'Prompt deleted successfully',
  PROMPTS_FETCHED: 'Prompts fetched successfully',
} as const;

/**
 * Pagination constants
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;
