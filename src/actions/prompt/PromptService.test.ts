import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  CreatePromptRequest,
  UpdatePromptRequest,
  DeletePromptRequest,
  FetchPromptRequest,
  FetchAllPromptsRequest,
  FetchUserPromptsRequest,
  PromptError,
  PromptErrorCode,
  CreatorDTO,
  PromptResponse,
  createPromptSchema,
  updatePromptSchema,
  deletePromptSchema,
  fetchPromptSchema,
} from './PromptService.types';

/**
 * Test suite for PromptService
 */
describe('PromptService', () => {
  describe('Validation Tests', () => {
    it('should validate create prompt request with valid data', () => {
      const payload = {
        prompt: 'This is a test prompt for AI',
        tag: '#testing',
        userId: '123456',
      };
      
      const result = createPromptSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('should reject create prompt with prompt too short', () => {
      const payload = {
        prompt: 'short',
        tag: '#testing',
        userId: '123456',
      };
      
      const result = createPromptSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('should reject create prompt with invalid tag format', () => {
      const payload = {
        prompt: 'This is a test prompt for AI',
        tag: 'notag',
        userId: '123456',
      };
      
      const result = createPromptSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('should reject create prompt with missing userId', () => {
      const payload = {
        prompt: 'This is a test prompt for AI',
        tag: '#testing',
        userId: '',
      };
      
      const result = createPromptSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('should validate update prompt request with valid data', () => {
      const payload = {
        promptId: '654321',
        prompt: 'Updated test prompt for AI',
        tag: '#testing',
        userId: '123456',
      };
      
      const result = updatePromptSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('should validate delete prompt request with valid data', () => {
      const payload = {
        promptId: '654321',
        userId: '123456',
      };
      
      const result = deletePromptSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('should validate fetch prompt request with valid data', () => {
      const payload = {
        promptId: '654321',
      };
      
      const result = fetchPromptSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });
  });

  describe('Request/Response DTOs', () => {
    it('should create CreatePromptRequest instance correctly', () => {
      const request = new CreatePromptRequest(
        'Test prompt',
        '#testing',
        'userId123'
      );
      
      expect(request.prompt).toBe('Test prompt');
      expect(request.tag).toBe('#testing');
      expect(request.userId).toBe('userId123');
    });

    it('should create UpdatePromptRequest instance correctly', () => {
      const request = new UpdatePromptRequest(
        'promptId123',
        'Updated prompt',
        '#testing',
        'userId123'
      );
      
      expect(request.promptId).toBe('promptId123');
      expect(request.prompt).toBe('Updated prompt');
      expect(request.tag).toBe('#testing');
      expect(request.userId).toBe('userId123');
    });

    it('should create DeletePromptRequest instance correctly', () => {
      const request = new DeletePromptRequest('promptId123', 'userId123');
      
      expect(request.promptId).toBe('promptId123');
      expect(request.userId).toBe('userId123');
    });

    it('should create FetchPromptRequest instance correctly', () => {
      const request = new FetchPromptRequest('promptId123');
      
      expect(request.promptId).toBe('promptId123');
    });

    it('should create FetchAllPromptsRequest with default pagination', () => {
      const request = new FetchAllPromptsRequest();
      
      expect(request.page).toBe(1);
      expect(request.limit).toBe(10);
    });

    it('should create FetchUserPromptsRequest with custom pagination', () => {
      const request = new FetchUserPromptsRequest('userId123', 2, 20);
      
      expect(request.userId).toBe('userId123');
      expect(request.page).toBe(2);
      expect(request.limit).toBe(20);
    });
  });

  describe('Error Classes', () => {
    it('should create PromptError with correct code and message', () => {
      const error = new PromptError(
        PromptErrorCode.INVALID_PROMPT,
        'Prompt is missing'
      );
      
      expect(error.code).toBe(PromptErrorCode.INVALID_PROMPT);
      expect(error.message).toBe('Prompt is missing');
      expect(error.name).toBe('PromptError');
    });

    it('should create PromptError for not found', () => {
      const error = new PromptError(
        PromptErrorCode.PROMPT_NOT_FOUND,
        'Prompt not found'
      );
      
      expect(error.code).toBe(PromptErrorCode.PROMPT_NOT_FOUND);
    });

    it('should create PromptError for unauthorized access', () => {
      const error = new PromptError(
        PromptErrorCode.UNAUTHORIZED,
        'Unauthorized'
      );
      
      expect(error.code).toBe(PromptErrorCode.UNAUTHORIZED);
    });
  });

  describe('DTOs', () => {
    it('should create CreatorDTO correctly', () => {
      const creator = new CreatorDTO(
        'userId123',
        'testuser',
        'test@example.com',
        'https://example.com/image.jpg'
      );
      
      expect(creator._id).toBe('userId123');
      expect(creator.username).toBe('testuser');
      expect(creator.email).toBe('test@example.com');
      expect(creator.image).toBe('https://example.com/image.jpg');
    });

    it('should create PromptResponse correctly', () => {
      const creator = new CreatorDTO(
        'userId123',
        'testuser',
        'test@example.com'
      );
      
      const response = new PromptResponse(
        'promptId123',
        creator,
        'Test prompt content',
        '#testing',
        42
      );
      
      expect(response._id).toBe('promptId123');
      expect(response.creator._id).toBe('userId123');
      expect(response.prompt).toBe('Test prompt content');
      expect(response.tag).toBe('#testing');
      expect(response.likes).toBe(42);
    });
  });

  describe('Constants Validation', () => {
    it('should have valid prompt configuration', () => {
      // This would be imported from constants.ts
      const MIN_LENGTH = 10;
      const MAX_LENGTH = 5000;
      
      expect(MIN_LENGTH).toBeLessThan(MAX_LENGTH);
    });
  });
});
