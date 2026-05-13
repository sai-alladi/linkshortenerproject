import { pgTable, text, timestamp, varchar, integer, index, uniqueIndex } from 'drizzle-orm/pg-core';

export const shortLinks = pgTable(
  'short_links',
  {
    id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    originalUrl: text('original_url').notNull(),
    shortCode: varchar('short_code', { length: 12 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    uniqueIndex('idx_short_code_unique').on(table.shortCode),
    index('idx_user_id').on(table.userId),
    index('idx_user_id_deleted_at').on(table.userId, table.deletedAt),
  ]
);
