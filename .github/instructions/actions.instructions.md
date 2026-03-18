---
model: gpt-4
temperature: 0.2
---

# Instructions for Creating Server Action Files in the Project

To create a Server Action file for a service/feature in the project using test-driven development, follow these steps using the **SERVICE PATTERN** architecture.

## Workflow: Test-Driven Development (TDD)

1. **Create a test file** that defines the expected behavior of the service.
2. **Create type definitions** - interfaces, classes, DTOs, error enums.
3. **Create the service implementation** - class implementing the interface.
4. **Run tests** to ensure they fail (red phase).
5. **Implement the logic** to satisfy test cases (green phase).
6. **Refactor and optimize** the implementation (refactor phase).
7. **Export everything** through the barrel index file.

## File Structure: SERVICE PATTERN ⭐

```
src/
  actions/
    [service]/
      [Service].server.ts    (implementation with 'use server' directive)
      [Service].types.ts     (interfaces, classes, DTOs, enums)
      [Service].test.ts      (complete test suite)
      constants.ts           (error codes, configurations, metadata)
      index.ts               (barrel export - export all)
```

### File Descriptions

- **`[Service].server.ts`** - Server Action implementation file containing:
  - Service class implementing the interface from `.types.ts`
  - All business logic and methods
  - AsyncPeter functions with 'use server' directive
  - Error handling and validation

- **`[Service].types.ts`** - Type definitions and contracts containing:
  - Service interface (e.g., `IAuthService`)
  - Request/Response classes (DTOs)
  - Error classes extending `Error`
  - Enums and constants types
  - Validation schemas (Zod)
  - Response wrapper types

- **`[Service].test.ts`** - Test suite using Vitest containing:
  - Unit tests for all service methods
  - Error scenario testing
  - Integration tests
  - Mocking database/external services

- **`constants.ts`** - Centralized configuration containing:
  - Error code enums (e.g., `AUTH_ERRORS`, `PAYMENT_ERRORS`)
  - Configuration constants (timeouts, expiry times, max attempts)
  - Metadata and service configuration

- **`index.ts`** - Barrel export file exporting:
  - Service functions (server actions)
  - All types and interfaces
  - Constants and error codes

## Step 1: Create Type Definitions

1. Navigate to the `src/actions/[service]` directory (create if it doesn't exist).
2. Create a file named `[Service].types.ts` (replace `[Service]` with your service name - e.g., `AuthService`, `PaymentService`, `DatabaseManager`).
3. Define the following in this file:
   - **Service Interface**: Define what methods the service will provide (e.g., `IAuthService`)
   - **Request Classes**: Create DTOs for inputs (e.g., `LoginRequest`)
   - **Response Classes**: Create DTOs for outputs (e.g., `LoginResponse`, `UserDTO`)
   - **Error Classes**: Extend `Error` class with error codes (e.g., `AuthenticationError`)
   - **Enums**: Define status types, error codes, provider types, etc.
   - **Validation Schemas**: Use Zod for runtime validation (e.g., `loginRequestSchema`)
   - **Response Types**: Define generic response wrapper (e.g., `ActionResponse<T>`)
4. Commit with message: "Add type definitions for [Service]"

### Example: `AuthService.types.ts`

```typescript
export enum AuthErrorCode {
  INVALID_EMAIL = 'AUTH_ERR_001',
  INVALID_PASSWORD = 'AUTH_ERR_002',
  USER_NOT_FOUND = 'AUTH_ERR_003',
  ACCOUNT_LOCKED = 'AUTH_ERR_004',
}

export class LoginRequest {
  constructor(public email: string, public password: string) {}
}

export class AuthenticationError extends Error {
  constructor(public code: AuthErrorCode, message: string) {
    super(message);
  }
}

export interface IAuthService {
  login(request: LoginRequest): Promise<LoginResponse>;
  logout(userId: string): Promise<void>;
}
```

## Step 2: Create the Test File

1. In the same `src/actions/[service]` directory, create a file named `[Service].test.ts`.
2. Write comprehensive test cases that define the expected behavior:
   - **Happy path**: successful operation
   - **Error scenarios**: validation errors, not found, rate limiting
   - **Edge cases**: boundary conditions, timeouts
3. Use **Vitest** framework with clear test descriptions:
   ```typescript
   describe('[Service]', () => {
     it('should [describe expected behavior]', async () => {
       // Arrange - set up test data
       // Act - call the service
       // Assert - verify the result
     });
   });
   ```
4. Run tests to ensure they **FAIL** (red phase - confirms implementation is not done yet)
5. Mock external dependencies (database, payment providers)
6. Commit with message: "Add test cases for [Service]"

### Example: `AuthService.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { useAuthLogin } from './AuthService.server';

describe('AuthService', () => {
  it('should successfully login with valid credentials', async () => {
    const result = await useAuthLogin({
      email: 'user@example.com',
      password: 'securePass123',
    });
    expect(result.status).toBe('success');
  });

  it('should return error for invalid email', async () => {
    const result = await useAuthLogin({
      email: 'invalid',
      password: 'securePass123',
    });
    expect(result.status).toBe('error');
  });
});
```


## Step 3: Create the Service Implementation

1. Create a file named `[Service].server.ts` in the same directory.
2. Mark the file with `'use server'` directive at the top for Next.js Server Actions.
3. Implement the service class that satisfies the interface from `.types.ts`:
   - Implement all methods defined in the interface
   - Add private helper methods as needed
   - Include error handling using custom error classes
   - Add input validation using Zod schemas
4. Export server action functions that wrap the service methods:
   ```typescript
   export async function useAuthLogin(input: unknown): Promise<AuthActionResponse<LoginResponse>> {
     // Validation, error handling, direct call to service
   }
   ```
5. Run tests to ensure they **PASS** (green phase)
6. Commit with message: "Implement [Service] with business logic"

### Example: `AuthService.server.ts`

```typescript
'use server';

import { AuthService, IAuthService, LoginRequest } from './AuthService.types';

class AuthServiceImpl implements IAuthService {
  async login(request: LoginRequest): Promise<LoginResponse> {
    if (!request.validate()) {
      throw new AuthenticationError(AuthErrorCode.INVALID_EMAIL, 'Invalid email');
    }
    // Implementation logic
  }
}

const authService = new AuthServiceImpl();

export async function useAuthLogin(input: unknown) {
  try {
    const validated = loginRequestSchema.parse(input);
    const result = await authService.login(new LoginRequest(validated.email, validated.password));
    return { status: 'success', data: result };
  } catch (error) {
    return { status: 'error', error };
  }
}
```

## Step 4: Create Constants File (Optional but Recommended)

1. Create a file named `constants.ts` in the same directory.
2. Define all constants, enums, and configuration:
   - Error codes and error messages
   - Timeout values and rate limits
   - API keys or configuration
   - Metadata about the service
3. Commit with message: "Add constants and configuration for [Service]"

### Example: `constants.ts`

```typescript
export const AUTH_ERRORS = {
  INVALID_EMAIL: 'AUTH_ERR_001',
  INVALID_PASSWORD: 'AUTH_ERR_002',
  ACCOUNT_LOCKED: 'AUTH_ERR_004',
} as const;

export const AUTH_CONFIG = {
  TOKEN_EXPIRY_MS: 3600000,          // 1 hour
  REFRESH_TOKEN_EXPIRY_MS: 604800000, // 7 days
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION_MS: 900000,        // 15 minutes
} as const;
```

## Step 5: Create Barrel Export File

1. Create or update `index.ts` in the `src/actions/[service]` directory.
2. Export all public exports:
   ```typescript
   // Export server actions
   export { useAuthLogin, useAuthLogout } from './AuthService.server';
   
   // Export types
   export type { IAuthService, LoginResponse } from './AuthService.types';
   export { AuthenticationError, LoginRequest } from './AuthService.types';
   
   // Export constants
   export { AUTH_ERRORS, AUTH_CONFIG } from './constants';
   ```
3. This allows clean imports from other parts of the application
4. Commit with message: "Add barrel export for [Service]"

## Naming Convention Summary

| File | Naming Pattern | Example |
|------|:-----------:|:-----------:|
| Implementation | `[Service].server.ts` | `AuthService.server.ts` |
| Types/Contracts | `[Service].types.ts` | `AuthService.types.ts` |
| Tests | `[Service].test.ts` | `AuthService.test.ts` |
| Constants | `constants.ts` | `constants.ts` |
| Barrel Export | `index.ts` | `index.ts` |

## Best Practices

✅ **DO:**
- Use class-based architecture for services with multiple related methods
- Define interfaces first, then implement
- Keep types and implementation in separate files
- Always use error classes for consistent error handling
- Write tests before implementation (TDD)
- Group related constant definitions

❌ **DON'T:**
- Use `[action].action.ts` (redundant naming)
- Mix types and implementation in one file
- Create action functions without interfaces
- Skip error code definitions
- Forget to export from `index.ts`