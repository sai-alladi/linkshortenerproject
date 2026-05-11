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
