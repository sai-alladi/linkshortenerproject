'use client';

import { SignUp } from '@clerk/nextjs';
import { X } from 'lucide-react';

interface SignUpModalProps {
  onClose: () => void;
}

export function SignUpModal({ onClose }: SignUpModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>
        <SignUp
          routing="hash"
        />
      </div>
    </div>
  );
}
