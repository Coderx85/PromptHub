'use server';

import { connectToDB } from '@/utils/database';
import Prompt from '@/models/prompt.modal';
import User from '@/models/user.modal';
import {
  IPromptService,
  CreatePromptRequest,
  UpdatePromptRequest,
  DeletePromptRequest,
  FetchPromptRequest,
  FetchAllPromptsRequest,
  FetchUserPromptsRequest,
  PromptResponse,
  CreatePromptResponse,
  PromptError,
  ValidationError,
  PromptErrorCode,
  CreatorDTO,
  createPromptSchema,
  createPromptInput,
  updatePromptSchema,
  deletePromptSchema,
  fetchPromptSchema,
  fetchAllPromptsSchema,
  fetchUserPromptsSchema,
  ActionResponse,
} from './PromptService.types';
import {
  PROMPT_ERROR_MESSAGES,
  PROMPT_SUCCESS_MESSAGES,
  PROMPT_CONFIG,
} from './constants';

/**
 * PromptService Implementation
 * Handles all business logic for prompt operations
 */
class PromptServiceImpl implements IPromptService {
  /**
   * Create a new prompt
   */
  async createPrompt(
    request: createPromptInput
  ): Promise<CreatePromptResponse> {
    try {
      // Validate input
      const validated = createPromptSchema.parse({
        prompt: request.prompt,
        tag: request.tag,
        userId: request.userId,
      });

      // Connect to database
      await connectToDB();

      // Verify user exists
      const user = await User.findOne({ _id: validated.userId } as any);
      if (!user) {
        throw new PromptError(
          PromptErrorCode.INVALID_USER_ID,
          PROMPT_ERROR_MESSAGES.INVALID_USER_ID
        );
      }

      // Create prompt
      const newPrompt = new Prompt({
        creator: validated.userId,
        prompt: validated.prompt,
        tag: validated.tag,
      });

      const savedPrompt = await newPrompt.save();

      return new CreatePromptResponse(
        savedPrompt._id.toString(),
        PROMPT_SUCCESS_MESSAGES.PROMPT_CREATED
      );
    } catch (error) {
      if (error instanceof ValidationError || error instanceof PromptError) {
        throw error;
      }
      console.error('Create prompt error:', error);
      throw new PromptError(
        PromptErrorCode.DATABASE_ERROR,
        PROMPT_ERROR_MESSAGES.DATABASE_ERROR
      );
    }
  }

  /**
   * Update an existing prompt
   */
  async updatePrompt(
    request: UpdatePromptRequest
  ): Promise<PromptResponse> {
    try {
      // Validate input
      const validated = updatePromptSchema.parse({
        promptId: request.promptId,
        prompt: request.prompt,
        tag: request.tag,
        userId: request.userId,
      });

      // Connect to database
      await connectToDB();

      // Find prompt
      const prompt = await Prompt.findOne({ _id: validated.promptId } as any).populate(
        'creator'
      );
      if (!prompt) {
        throw new PromptError(
          PromptErrorCode.PROMPT_NOT_FOUND,
          PROMPT_ERROR_MESSAGES.PROMPT_NOT_FOUND
        );
      }

      // Check authorization
      if (prompt.creator._id.toString() !== validated.userId) {
        throw new PromptError(
          PromptErrorCode.UNAUTHORIZED,
          PROMPT_ERROR_MESSAGES.UNAUTHORIZED
        );
      }

      // Update prompt
      prompt.prompt = validated.prompt;
      prompt.tag = validated.tag;
      const updatedPrompt = await prompt.save();

      // Populate creator details
      await updatedPrompt.populate('creator');

      return this.mapToPromptResponse(updatedPrompt);
    } catch (error) {
      if (error instanceof ValidationError || error instanceof PromptError) {
        throw error;
      }
      console.error('Update prompt error:', error);
      throw new PromptError(
        PromptErrorCode.DATABASE_ERROR,
        PROMPT_ERROR_MESSAGES.DATABASE_ERROR
      );
    }
  }

  /**
   * Delete a prompt
   */
  async deletePrompt(request: DeletePromptRequest): Promise<void> {
    try {
      // Validate input
      const validated = deletePromptSchema.parse({
        promptId: request.promptId,
        userId: request.userId,
      });

      // Connect to database
      await connectToDB();

      // Find prompt
      const prompt = await Prompt.findOne({ _id: validated.promptId } as any).populate(
        'creator'
      );
      if (!prompt) {
        throw new PromptError(
          PromptErrorCode.PROMPT_NOT_FOUND,
          PROMPT_ERROR_MESSAGES.PROMPT_NOT_FOUND
        );
      }

      // Check authorization
      if (prompt.creator._id.toString() !== validated.userId) {
        throw new PromptError(
          PromptErrorCode.UNAUTHORIZED,
          PROMPT_ERROR_MESSAGES.UNAUTHORIZED
        );
      }

      // Delete prompt
      await Prompt.deleteOne({ _id: validated.promptId } as any);
    } catch (error) {
      if (error instanceof ValidationError || error instanceof PromptError) {
        throw error;
      }
      console.error('Delete prompt error:', error);
      throw new PromptError(
        PromptErrorCode.DATABASE_ERROR,
        PROMPT_ERROR_MESSAGES.DATABASE_ERROR
      );
    }
  }

  /**
   * Get a single prompt by ID
   */
  async getPromptById(
    request: FetchPromptRequest
  ): Promise<PromptResponse> {
    try {
      // Validate input
      const validated = fetchPromptSchema.parse({
        promptId: request.promptId,
      });

      // Connect to database
      await connectToDB();

      // Find prompt
      const prompt = await Prompt.findOne({ _id: validated.promptId } as any).populate(
        'creator'
      );
      if (!prompt) {
        throw new PromptError(
          PromptErrorCode.PROMPT_NOT_FOUND,
          PROMPT_ERROR_MESSAGES.PROMPT_NOT_FOUND
        );
      }

      return this.mapToPromptResponse(prompt);
    } catch (error) {
      if (error instanceof ValidationError || error instanceof PromptError) {
        throw error;
      }
      console.error('Fetch prompt by ID error:', error);
      throw new PromptError(
        PromptErrorCode.DATABASE_ERROR,
        PROMPT_ERROR_MESSAGES.DATABASE_ERROR
      );
    }
  }

  /**
   * Get all prompts with pagination
   */
  async getAllPrompts(
    request: FetchAllPromptsRequest
  ): Promise<PromptResponse[]> {
    try {
      // Validate input
      const validated = fetchAllPromptsSchema.parse({
        page: request.page || 1,
        limit: Math.min(request.limit || 10, PROMPT_CONFIG.MAX_LIMIT),
      });

      // Connect to database
      await connectToDB();

      // Calculate skip
      const skip = (validated.page - 1) * validated.limit;

      // Fetch prompts
      const prompts = await Prompt.find()
        .populate('creator')
        .skip(skip)
        .limit(validated.limit)
        .sort({ createdAt: -1 })
        .exec();

      return prompts.map((prompt) => this.mapToPromptResponse(prompt));
    } catch (error) {
      if (error instanceof ValidationError || error instanceof PromptError) {
        throw error;
      }
      console.error('Fetch all prompts error:', error);
      throw new PromptError(
        PromptErrorCode.DATABASE_ERROR,
        PROMPT_ERROR_MESSAGES.DATABASE_ERROR
      );
    }
  }

  /**
   * Get all prompts by a specific user
   */
  async getUserPrompts(
    request: FetchUserPromptsRequest
  ): Promise<PromptResponse[]> {
    try {
      // Validate input
      const validated = fetchUserPromptsSchema.parse({
        userId: request.userId,
        page: request.page || 1,
        limit: Math.min(request.limit || 10, PROMPT_CONFIG.MAX_LIMIT),
      });

      // Connect to database
      await connectToDB();

      // Verify user exists
      const user = await User.findOne({ _id: validated.userId } as any);
      if (!user) {
        throw new PromptError(
          PromptErrorCode.INVALID_USER_ID,
          PROMPT_ERROR_MESSAGES.INVALID_USER_ID
        );
      }

      // Calculate skip
      const skip = (validated.page - 1) * validated.limit;

      // Fetch prompts
      const prompts = await Prompt.find({ creator: validated.userId } as any)
        .populate('creator')
        .skip(skip)
        .limit(validated.limit)
        .sort({ createdAt: -1 })
        .exec();

      return prompts.map((prompt) => this.mapToPromptResponse(prompt));
    } catch (error) {
      if (error instanceof ValidationError || error instanceof PromptError) {
        throw error;
      }
      console.error('Fetch user prompts error:', error);
      throw new PromptError(
        PromptErrorCode.DATABASE_ERROR,
        PROMPT_ERROR_MESSAGES.DATABASE_ERROR
      );
    }
  }

  /**
   * Helper method to map database object to PromptResponse
   */
  private mapToPromptResponse(prompt: any): PromptResponse {
    const creator = prompt.creator;
    return new PromptResponse(
      prompt._id.toString(),
      new CreatorDTO(
        creator._id.toString(),
        creator.username || 'Unknown',
        creator.email,
        creator.image
      ),
      prompt.prompt,
      prompt.tag,
      prompt.likes || 0,
      prompt.createdAt,
      prompt.updatedAt
    );
  }
}

// Create service instance
const promptService = new PromptServiceImpl();

/**
 * Server Action: Create a new prompt
 */
export async function useCreatePrompt(
  input: createPromptInput
): Promise<ActionResponse<CreatePromptResponse>> {
  try {
    const validated = createPromptSchema.parse(input);

    const result = await promptService.createPrompt(
      new CreatePromptRequest(validated.prompt, validated.tag, validated.userId)
    );
    return {
      status: 'success',
      data: result,
    };
  } catch (error) {
    console.error('Server action error:', error);
    if (error instanceof PromptError) {
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
        code: PromptErrorCode.DATABASE_ERROR,
        message: PROMPT_ERROR_MESSAGES.DATABASE_ERROR,
      },
    };
  }
}

/**
 * Server Action: Update a prompt
 */
export async function useUpdatePrompt(
  input: unknown
): Promise<ActionResponse<PromptResponse>> {
  try {
    const validated = updatePromptSchema.parse(input);
    const result = await promptService.updatePrompt(
      new UpdatePromptRequest(
        validated.promptId,
        validated.prompt,
        validated.tag,
        validated.userId
      )
    );
    return {
      status: 'success',
      data: result,
    };
  } catch (error) {
    console.error('Server action error:', error);
    if (error instanceof PromptError) {
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
        code: PromptErrorCode.DATABASE_ERROR,
        message: PROMPT_ERROR_MESSAGES.DATABASE_ERROR,
      },
    };
  }
}

/**
 * Server Action: Delete a prompt
 */
export async function useDeletePrompt(
  input: unknown
): Promise<ActionResponse<{ message: string }>> {
  try {
    const validated = deletePromptSchema.parse(input);
    await promptService.deletePrompt(
      new DeletePromptRequest(validated.promptId, validated.userId)
    );
    return {
      status: 'success',
      data: { message: PROMPT_SUCCESS_MESSAGES.PROMPT_DELETED },
    };
  } catch (error) {
    console.error('Server action error:', error);
    if (error instanceof PromptError) {
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
        code: PromptErrorCode.DATABASE_ERROR,
        message: PROMPT_ERROR_MESSAGES.DATABASE_ERROR,
      },
    };
  }
}

/**
 * Server Action: Get prompt by ID
 */
export async function useGetPromptById(
  input: unknown
): Promise<ActionResponse<PromptResponse>> {
  try {
    const validated = fetchPromptSchema.parse(input);
    const result = await promptService.getPromptById(
      new FetchPromptRequest(validated.promptId)
    );
    return {
      status: 'success',
      data: result,
    };
  } catch (error) {
    console.error('Server action error:', error);
    if (error instanceof PromptError) {
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
        code: PromptErrorCode.DATABASE_ERROR,
        message: PROMPT_ERROR_MESSAGES.DATABASE_ERROR,
      },
    };
  }
}

/**
 * Server Action: Get all prompts
 */
export async function useGetAllPrompts(
  input: unknown
): Promise<ActionResponse<PromptResponse[]>> {
  try {
    const validated = fetchAllPromptsSchema.parse(input || {});
    const result = await promptService.getAllPrompts(
      new FetchAllPromptsRequest(validated.page, validated.limit)
    );
    return {
      status: 'success',
      data: result,
    };
  } catch (error) {
    console.error('Server action error:', error);
    if (error instanceof PromptError) {
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
        code: PromptErrorCode.DATABASE_ERROR,
        message: PROMPT_ERROR_MESSAGES.DATABASE_ERROR,
      },
    };
  }
}

/**
 * Server Action: Get user's prompts
 */
export async function useGetUserPrompts(
  input: unknown
): Promise<ActionResponse<PromptResponse[]>> {
  try {
    const validated = fetchUserPromptsSchema.parse(input);
    const result = await promptService.getUserPrompts(
      new FetchUserPromptsRequest(
        validated.userId,
        validated.page,
        validated.limit
      )
    );
    return {
      status: 'success',
      data: result,
    };
  } catch (error) {
    console.error('Server action error:', error);
    if (error instanceof PromptError) {
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
        code: PromptErrorCode.DATABASE_ERROR,
        message: PROMPT_ERROR_MESSAGES.DATABASE_ERROR,
      },
    };
  }
}
