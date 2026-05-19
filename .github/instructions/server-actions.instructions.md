---
name: server-actions
description: Rules for implementing server actions and data mutations in the Link Shortener project. Use when creating or modifying any data mutation, handling form submissions, or implementing server-side operations that modify data.
applyTo: "**/actions.ts"
---

# Server Actions & Data Mutations

All data mutations in the Link Shortener project must be implemented via Next.js Server Actions following this strict pattern.

## Core Rules

### 0. Error Handling Philosophy
- **NEVER** throw errors in server actions
- **ALWAYS** return an object with either `error` or `success` property
- This ensures predictable error handling on the client side
- Wrap all logic in try-catch and catch all error types gracefully

### 1. File Organization
- Server action files **MUST** be named `actions.ts`
- Server actions **MUST** be colocated in the same directory as the component that calls them
- Example: If `components/dashboard/create-link-form.tsx` needs to create a link, create `components/dashboard/actions.ts`

### 2. Calling Server Actions
- Server actions **MUST** be called from Client Components only
- Add `'use client'` directive to the component file
- Use the server action directly as a function or via form `action` prop

```typescript
// components/dashboard/create-link-form.tsx
'use client';
import { createShortLink } from './actions';

export function CreateLinkForm() {
  async function handleSubmit(formData: FormData) {
    const result = await createShortLink(formData);
    // Handle result
  }
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

### 3. Type Safety
- **DO NOT** use the TypeScript `FormData` type for server action parameters
- Define explicit TypeScript interfaces or types for all input data
- Extract and parse form data before passing to server actions

```typescript
// components/dashboard/actions.ts
'use server';
import { z } from 'zod';

interface CreateLinkInput {
  originalUrl: string;
  customSlug?: string;
  expiresAt?: Date;
}

export async function createShortLink(input: CreateLinkInput) {
  // Implementation
}
```

### 4. Data Validation
- **ALL** input data **MUST** be validated using Zod
- Validation must occur at the start of the server action
- Return validation errors to the client for display

```typescript
// components/dashboard/actions.ts
'use server';
import { z } from 'zod';

const createLinkSchema = z.object({
  originalUrl: z.string().url('Invalid URL'),
  customSlug: z.string().min(3).optional(),
  expiresAt: z.date().optional(),
});

export async function createShortLink(input: unknown) {
  const validatedData = createLinkSchema.parse(input);
  // Continue with operation
}
```

### 5. Authentication Check
- **ALL** server actions **MUST** check for authenticated user first
- Check before any database operations
- Use Clerk's `auth()` function at the start of the action
- Return an error response object if user is not authenticated

```typescript
'use server';
import { auth } from '@clerk/nextjs/server';

export async function createShortLink(input: CreateLinkInput) {
  const { userId } = auth();
  
  if (!userId) {
    return { error: 'Unauthorized: User must be logged in' };
  }
  
  // Safe to proceed with database operations
}
```

### 6. Database Operations
- **DO NOT** use Drizzle ORM directly in server actions
- **MUST** use helper functions from the `/data` directory
- These helpers encapsulate database logic and handle queries safely

```typescript
// components/dashboard/actions.ts
'use server';
import { createLinkRecord } from '@/data/links'; // Helper function

export async function createShortLink(input: CreateLinkInput) {
  try {
    const { userId } = auth();
    if (!userId) return { error: 'Unauthorized' };
    
    const validated = createLinkSchema.parse(input);
    const result = await createLinkRecord(userId, validated);
    
    return { success: true, data: result };
  } catch (error) {
    return { error: 'Failed to create link' };
  }
}
```

### 7. Data Helper Functions
- Create reusable database helpers in `/data` directory
- Each helper should handle a specific database operation
- Helpers should accept typed parameters and return typed results

```typescript
// data/links.ts
import { db } from '@/db';
import { shortLinks } from '@/db/schema';

interface CreateLinkParams {
  originalUrl: string;
  customSlug?: string;
  expiresAt?: Date;
}

export async function createLinkRecord(
  userId: string,
  params: CreateLinkParams
) {
  return db.insert(shortLinks).values({
    userId,
    originalUrl: params.originalUrl,
    customSlug: params.customSlug,
    expiresAt: params.expiresAt,
  }).returning();
}
```

## Error Handling Pattern

**Never throw errors to the client. Always wrap logic in try-catch and return error/success objects.**

```typescript
'use server';
import { auth } from '@clerk/nextjs/server';
import { createLinkRecord } from '@/data/links';

export async function createShortLink(input: unknown) {
  try {
    // 1. Authenticate
    const { userId } = auth();
    if (!userId) {
      return { error: 'Unauthorized' };
    }
    
    // 2. Validate
    const validated = createLinkSchema.parse(input);
    
    // 3. Execute
    const result = await createLinkRecord(userId, validated);
    
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: 'Validation failed', details: error.errors };
    }
    // Always return error object, never throw
    return { error: 'An error occurred' };
  }
}
```

## Summary Checklist

- [ ] Server action file named `actions.ts` and colocated with component
- [ ] Component has `'use client'` directive
- [ ] Input has explicit TypeScript type (not `FormData`)
- [ ] Zod schema validates all input data
- [ ] `auth()` check happens before database operations
- [ ] Database operations use `/data` helpers, not Drizzle directly
- [ ] Proper error handling with typed responses
