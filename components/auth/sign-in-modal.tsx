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
