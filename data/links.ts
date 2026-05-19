import { db } from '@/db';
import { shortLinks } from '@/db/schema';
import { eq, desc, and, isNull } from 'drizzle-orm';

export async function getUserLinks(userId: string) {
  const links = await db
    .select()
    .from(shortLinks)
    .where(
      and(
        eq(shortLinks.userId, userId),
        isNull(shortLinks.deletedAt)
      )
    )
    .orderBy(desc(shortLinks.createdAt));

  return links;
}

export async function getLinkByShortCode(shortCode: string) {
  const link = await db
    .select()
    .from(shortLinks)
    .where(
      and(
        eq(shortLinks.shortCode, shortCode),
        isNull(shortLinks.deletedAt)
      )
    )
    .limit(1);

  return link[0] || null;
}

function generateShortCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function createLinkRecord(
  userId: string,
  originalUrl: string
) {
  let shortCode = generateShortCode();
  let attempts = 0;
  const maxAttempts = 5;

  // Retry if short code already exists
  while (attempts < maxAttempts) {
    try {
      const result = await db
        .insert(shortLinks)
        .values({
          userId,
          originalUrl,
          shortCode,
        })
        .returning();

      return result[0];
    } catch (error) {
      attempts++;
      if (attempts >= maxAttempts) {
        throw new Error('Failed to generate unique short code');
      }
      shortCode = generateShortCode();
    }
  }
}

export async function updateLinkRecord(
  linkId: number,
  userId: string,
  originalUrl: string
) {
  const result = await db
    .update(shortLinks)
    .set({
      originalUrl,
    })
    .where(and(eq(shortLinks.id, linkId), eq(shortLinks.userId, userId)))
    .returning();

  if (result.length === 0) {
    throw new Error('Link not found or unauthorized');
  }

  return result[0];
}

export async function deleteLinkRecord(linkId: number, userId: string) {
  const result = await db
    .update(shortLinks)
    .set({
      deletedAt: new Date(),
    })
    .where(and(eq(shortLinks.id, linkId), eq(shortLinks.userId, userId)))
    .returning();

  if (result.length === 0) {
    throw new Error('Link not found or unauthorized');
  }

  return result[0];
}
