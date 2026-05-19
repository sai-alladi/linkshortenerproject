'use server';

import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { createLinkRecord, updateLinkRecord, deleteLinkRecord } from '@/data/links';

const createLinkSchema = z.object({
  originalUrl: z
    .string()
    .min(1, 'URL is required')
    .url('Please enter a valid URL'),
});

const updateLinkSchema = z.object({
  id: z.number(),
  originalUrl: z
    .string()
    .min(1, 'URL is required')
    .url('Please enter a valid URL'),
});

const deleteLinkSchema = z.object({
  id: z.number(),
});

export async function createLinkAction(input: unknown) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { error: 'Unauthorized: User must be logged in' };
    }

    const validatedData = createLinkSchema.parse(input);

    const link = await createLinkRecord(userId, validatedData.originalUrl);

    return { success: true, data: link };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }

    return { error: 'Failed to create link. Please try again.' };
  }
}

export async function updateLinkAction(input: unknown) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { error: 'Unauthorized: User must be logged in' };
    }

    const validatedData = updateLinkSchema.parse(input);

    const link = await updateLinkRecord(validatedData.id, userId, validatedData.originalUrl);

    return { success: true, data: link };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }

    if (error instanceof Error && error.message.includes('unauthorized')) {
      return { error: 'Unauthorized: This link does not belong to you' };
    }

    return { error: 'Failed to update link. Please try again.' };
  }
}

export async function deleteLinkAction(input: unknown) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { error: 'Unauthorized: User must be logged in' };
    }

    const validatedData = deleteLinkSchema.parse(input);

    await deleteLinkRecord(validatedData.id, userId);

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }

    if (error instanceof Error && error.message.includes('unauthorized')) {
      return { error: 'Unauthorized: This link does not belong to you' };
    }

    return { error: 'Failed to delete link. Please try again.' };
  }
}
