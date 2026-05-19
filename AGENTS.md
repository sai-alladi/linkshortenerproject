---
name: linkshortener-project-standards
description: Coding standards, best practices, and architectural guidelines for the Link Shortener project. Use when implementing features, fixing bugs, reviewing code, or making architectural decisions. All LLM contributions must follow these standards.
applyTo: "**/*.{ts,tsx,js,jsx,css}"
---

# Link Shortener Project - Agent Instructions

This document defines the comprehensive coding standards, best practices, and architectural guidelines for the Link Shortener project. All code contributions must adhere to these standards to maintain consistency, quality, and maintainability.

## Project Overview

- **Framework**: Next.js 16.2.4 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 + Shadcn UI
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **Authentication**: Clerk
- **UI Components**: Shadcn UI + custom components
- **Package Manager**: npm

## Code Organization

### Files
- Use kebab-case for filenames: `user-service.ts`, `login-form.tsx`
- Group related files in directories: `components/dashboard/`, `lib/auth/`
- Keep files focused and under 300 lines when possible

### Imports
```typescript
// Order: external → absolute (@/*) → relative
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { userService } from './user-service';
```

### Exports
- Use named exports for better tree-shaking
- Default exports only for page components and layout files
- Export types separately from implementations

## TypeScript Enforced Rules

- Strict mode: `"strict": true`
- No implicit any: `"noImplicitAny": true`
- ESNext target with Node module resolution
- Path aliases: `@/*` maps to project root

## ESLint Configuration

The project uses ESLint with Next.js recommended config. All code must pass linting:
- Run `npm run lint` to check
- Fix issues before committing
- Follow ESLint-config-next standards

## Common Patterns

### Handling Async Operations
```typescript
// Server Component - async/await directly
async function UserProfile({ id }: { id: string }) {
  const user = await db.query.users.findFirst({ where: { id } });
  if (!user) return <NotFound />;
  return <div>{user.name}</div>;
}

// Client Component - useEffect pattern
'use client';
function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(setUsers);
  }, []);
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

### Conditional Styling
```typescript
import { cn } from '@/lib/utils';

<button className={cn(
  'px-4 py-2 rounded transition-colors',
  isActive && 'bg-blue-600 text-white',
  !isActive && 'bg-gray-200 text-gray-900',
  className
)}>
  Click me
</button>
```

### Database Queries
```typescript
// Eager loading with relations
const user = await db.query.users.findFirst({
  where: eq(users.id, userId),
  with: {
    shortLinks: {
      orderBy: desc(shortLinks.createdAt),
    },
  },
});

// Safe mutations with transactions
await db.transaction(async (tx) => {
  await tx.insert(users).values(userData);
  await tx.insert(shortLinks).values(linkData);
});
```

## Naming Conventions

| Category | Convention | Example |
|----------|-----------|---------|
| Files | kebab-case | `user-service.ts` |
| Directories | kebab-case | `components/dashboard/` |
| Components | PascalCase | `UserCard.tsx` |
| Functions | camelCase | `getShortCode()` |
| Variables | camelCase | `userService` |
| Constants | UPPER_SNAKE_CASE | `MAX_URL_LENGTH` |
| Types/Interfaces | PascalCase | `User`, `IAuthProvider` |
| Boolean variables | `is` or `has` prefix | `isLoading`, `hasError` |

## Performance Guidelines

- ✅ Use Server Components for data fetching
- ✅ Use `next/image` for all images
- ✅ Implement proper caching strategies
- ✅ Use `React.memo` for expensive components only
- ✅ Lazy load heavy components with `dynamic()`
- ❌ Don't fetch data in Client Components when possible
- ❌ Don't render large lists without virtualization
- ❌ Don't inline large objects in render methods

## Accessibility Standards

- Use semantic HTML (`<button>`, `<nav>`, `<section>`)
- Provide `alt` text for all images
- Include `aria-label` for screen readers where needed
- Ensure keyboard navigation support
- Maintain WCAG AA color contrast minimum
- Use `htmlFor` on labels linked to inputs

## Testing Considerations

- Write components to be testable
- Avoid tight coupling to external services
- Use dependency injection for services
- Export test-friendly variants of components
- Mock API calls in tests

## Git Workflow

- **Commit messages**: Be descriptive and concise
- **Feature branches**: Use `feature/` prefix for new features
- **Bug fixes**: Use `fix/` prefix
- **Code review**: All PRs should be reviewed before merging
- **Standards check**: Ensure code passes TypeScript, ESLint, and follows this guide