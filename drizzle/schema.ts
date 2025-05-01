import { pgTable, text, uuid, numeric, timestamp, date, integer, foreignKey } from "drizzle-orm/pg-core";

export const campaigns = pgTable('campaigns', {
  id: uuid('id').primaryKey().defaultRandom(),
  campaignTitle: text('campaign_title').notNull(),
  brandName: text('brand_name').notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  budget: numeric('budget').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

export const campaignImages = pgTable('campaign_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  campaignId: uuid('campaign_id').notNull().references(() => campaigns.id, { onDelete: 'cascade' }),
  fileName: text('file_name').notNull(),
  filePath: text('file_path').notNull(),
  fileSize: integer('file_size').notNull(),
  contentType: text('content_type').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});