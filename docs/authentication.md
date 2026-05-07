# Authentication & Authorization Guide

This document defines authentication and authorization patterns for the Link Shortener project. All authentication must be handled exclusively through Clerk — no alternative authentication methods are permitted.

## Core Principles

### Single Auth Provider: Clerk Only
- All authentication flows must use Clerk exclusively
- No custom authentication, JWT-based auth, or alternative providers
- Clerk middleware handles all session management
- All protected routes must verify Clerk auth status

### Protected Routes
- `/dashboard` is a protected route requiring authentication
- Unauthenticated users cannot access `/dashboard`
- Logged-in users accessing `/` (homepage) are automatically redirected to `/dashboard`
- All API routes that modify data require authentication verification

### Modal-Based Sign In/Sign Up
- All Clerk modals must launch as modal overlays
- Never use Clerk components as full page redirects
- Sign in and sign up experiences are non-intrusive

## Implementation Patterns

### Protecting the Dashboard Page

Use `auth()` from `@clerk/nextjs/server` to check authentication in Server Components:

```typescript
// app/dashboard/page.tsx
import { auth, redirectToSignIn } from '@clerk/nextjs/server';

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    return redirectToSignIn();
  }

  return (
    <div>
      {/* Dashboard content */}
    </div>
  );
}
```

### Redirecting Authenticated Users from Homepage

Use client-side redirect on the homepage to prevent layout flashing:

```typescript
// app/page.tsx
'use client';

import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace('/dashboard');
    }
  }, [isLoaded, isSignedIn, router]);

  // Show public homepage content only if not signed in
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (isSignedIn) {
    return null; // Redirecting...
  }

  return (
    <div>
      {/* Public homepage content for unauthenticated users */}
    </div>
  );
}
```

### Modal Sign In Component

Create a reusable modal component for authentication:

```typescript
// components/auth/sign-in-modal.tsx
'use client';

import { SignIn } from '@clerk/nextjs';

export function SignInModal() {
  return (
    <SignIn
      mode="modal"
      routing="virtual"
      signUpUrl="/sign-up"
    />
  );
}
```

### Modal Sign Up Component

```typescript
// components/auth/sign-up-modal.tsx
'use client';

import { SignUp } from '@clerk/nextjs';

export function SignUpModal() {
  return (
    <SignUp
      mode="modal"
      routing="virtual"
      signInUrl="/sign-in"
    />
  );
}
```

### Protecting API Routes

Always check authentication in API routes that modify data:

```typescript
// app/api/links/route.ts
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Process authenticated request
  // ...
}
```

### Getting the Current User

For Server Components or API routes:

```typescript
import { auth, currentUser } from '@clerk/nextjs/server';

const { userId } = await auth();
const user = await currentUser(); // Full user object with email, name, etc.
```

For Client Components:

```typescript
'use client';

import { useAuth, useUser } from '@clerk/nextjs';

export function UserGreeting() {
  const { userId } = useAuth();
  const { user } = useUser();

  return <div>Welcome, {user?.firstName}!</div>;
}
```

### Middleware for Protected Routes

If implementing more complex route protection, use Next.js middleware with Clerk:

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest))(?:.*)|api|trpc)(.*)',
  ],
};
```

## Key Clerk Configuration

### Environment Variables

Ensure these are set in `.env.local`:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
CLERK_SECRET_KEY=your_secret_here
```

### App Router Integration

Clerk must be initialized in `layout.tsx`:

```typescript
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

## Best Practices

✅ **Do:**
- Always verify `userId` in protected routes and API endpoints
- Use `redirectToSignIn()` for Server Component protection
- Use `useAuth()` hook for client-side auth checks
- Keep auth state management centralized through Clerk hooks
- Use `isLoaded` from Clerk hooks to prevent flashing UI
- Mark modal components with `'use client'`

❌ **Don't:**
- Implement custom authentication logic
- Use alternative auth libraries alongside Clerk
- Store tokens in localStorage manually
- Redirect to sign-in page instead of using modal overlays
- Skip authentication checks in API routes
- Assume `userId` exists without checking

## Common Patterns

### Conditional Rendering Based on Auth Status

```typescript
'use client';

import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';

export function Navigation() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <nav>{/* Skeleton or loading state */}</nav>;
  }

  return (
    <nav>
      {isSignedIn ? (
        <>
          <Link href="/dashboard">Dashboard</Link>
          <UserMenu />
        </>
      ) : (
        <>
          <Link href="/sign-in">Sign In</Link>
          <Link href="/sign-up">Sign Up</Link>
        </>
      )}
    </nav>
  );
}
```

### Database Associations with Clerk User

When storing data related to users:

```typescript
// db/schema.ts
import { users, pgTable, varchar, timestamp, uuid } from 'drizzle-orm/pg-core';

export const shortLinks = pgTable('short_links', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: varchar('user_id').notNull(), // Stores Clerk userId
  originalUrl: varchar('original_url').notNull(),
  shortCode: varchar('short_code').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
});
```

Always query links by the authenticated user's `userId`:

```typescript
const userLinks = await db.query.shortLinks.findMany({
  where: eq(shortLinks.userId, userId),
  orderBy: desc(shortLinks.createdAt),
});
```

## Testing Authenticated Flows

- Use Clerk's testing token for e2e tests
- Mock `@clerk/nextjs` hooks in unit tests
- Test both authenticated and unauthenticated paths

---

**Last Updated**: May 5, 2026  
**Status**: Active - Reference this guide for all authentication work
