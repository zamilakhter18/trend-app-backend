import {
  pgTable,
  uuid,
  text,
  integer,
  decimal,
  timestamp,
  boolean,
  jsonb,
  primaryKey,
  pgSchema,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Supabase Auth schema reference
export const authSchema = pgSchema('auth');
export const users = authSchema.table('users', {
  id: uuid('id').primaryKey(),
});

// User Profile
export const userProfile = pgTable('user_profile', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  username: text('username').unique(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  trendScore: decimal('trend_score', { precision: 10, scale: 2 }).default('0'),
  level: integer('level').default(1),
  badges: text('badges')
    .array()
    .default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Trends
export const trends = pgTable('trends', {
  id: uuid('id').primaryKey().defaultRandom(),
  creatorId: uuid('creator_id').references(() => userProfile.userId, {
    onDelete: 'set null',
  }),
  title: text('title').notNull(),
  description: text('description'),
  phase: text('phase', { enum: ['emerging', 'rising', 'peak', 'fading'] }).default(
    'emerging',
  ),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Trend Content
export const trendContent = pgTable('trend_content', {
  id: uuid('id').primaryKey().defaultRandom(),
  trendId: uuid('trend_id').references(() => trends.id, { onDelete: 'cascade' }),
  contentUrl: text('content_url').notNull(),
  contentType: text('content_type').notNull(), // 'video', 'image', 'link'
  isPrimary: boolean('is_primary').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Trend Metadata
export const trendMetadata = pgTable('trend_metadata', {
  trendId: uuid('trend_id')
    .primaryKey()
    .references(() => trends.id, { onDelete: 'cascade' }),
  tags: text('tags').array().default([]),
  categories: text('categories').array().default([]),
  sentimentScore: decimal('sentiment_score', { precision: 5, scale: 2 }),
  aiSummary: text('ai_summary'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Engagements
export const engagements = pgTable('engagements', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => userProfile.userId, {
    onDelete: 'cascade',
  }),
  trendId: uuid('trend_id').references(() => trends.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // 'like', 'comment', 'share'
  content: text('content'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Saves
export const saves = pgTable(
  'saves',
  {
    userId: uuid('user_id').references(() => userProfile.userId, {
      onDelete: 'cascade',
    }),
    trendId: uuid('trend_id').references(() => trends.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.trendId] }),
  }),
);

// Products
export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  trendId: uuid('trend_id').references(() => trends.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 12, scale: 2 }),
  currency: text('currency').default('USD'),
  affiliateUrl: text('affiliate_url').notNull(),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Clickouts
export const clickouts = pgTable('clickouts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => userProfile.userId, {
    onDelete: 'set null',
  }),
  productId: uuid('product_id').references(() => products.id, {
    onDelete: 'cascade',
  }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// AI Analysis
export const aiAnalysis = pgTable('ai_analysis', {
  trendId: uuid('trend_id')
    .primaryKey()
    .references(() => trends.id, { onDelete: 'cascade' }),
  rawAnalysis: jsonb('raw_analysis'),
  refinedSummary: text('refined_summary'),
  keywords: text('keywords').array().default([]),
  visionData: jsonb('vision_data'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Trend Scores
export const trendScores = pgTable('trend_scores', {
  trendId: uuid('trend_id')
    .primaryKey()
    .references(() => trends.id, { onDelete: 'cascade' }),
  score: decimal('score', { precision: 12, scale: 2 }).default('0'),
  velocity: decimal('velocity', { precision: 12, scale: 2 }).default('0'),
  engagementCount: integer('engagement_count').default(0),
  lastUpdated: timestamp('last_updated', { withTimezone: true }).defaultNow(),
});

// Sponsored Content
export const sponsoredContent = pgTable('sponsored_content', {
  trendId: uuid('trend_id')
    .primaryKey()
    .references(() => trends.id, { onDelete: 'cascade' }),
  advertiserId: uuid('advertiser_id').references(() => userProfile.userId, {
    onDelete: 'set null',
  }),
  budget: decimal('budget', { precision: 12, scale: 2 }),
  bidAmount: decimal('bid_amount', { precision: 12, scale: 2 }),
  isActive: boolean('is_active').default(true),
  startsAt: timestamp('starts_at', { withTimezone: true }),
  endsAt: timestamp('ends_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Relations
export const userProfileRelations = relations(userProfile, ({ many }) => ({
  trends: many(trends),
  engagements: many(engagements),
  saves: many(saves),
  clickouts: many(clickouts),
  sponsoredContent: many(sponsoredContent),
}));

export const trendsRelations = relations(trends, ({ one, many }) => ({
  creator: one(userProfile, {
    fields: [trends.creatorId],
    references: [userProfile.userId],
  }),
  content: many(trendContent),
  metadata: one(trendMetadata, {
    fields: [trends.id],
    references: [trendMetadata.trendId],
  }),
  engagements: many(engagements),
  saves: many(saves),
  products: many(products),
  aiAnalysis: one(aiAnalysis, {
    fields: [trends.id],
    references: [aiAnalysis.trendId],
  }),
  score: one(trendScores, {
    fields: [trends.id],
    references: [trendScores.trendId],
  }),
  sponsoredContent: one(sponsoredContent, {
    fields: [trends.id],
    references: [sponsoredContent.trendId],
  }),
}));

export const trendContentRelations = relations(trendContent, ({ one }) => ({
  trend: one(trends, {
    fields: [trendContent.trendId],
    references: [trends.id],
  }),
}));

export const trendMetadataRelations = relations(trendMetadata, ({ one }) => ({
  trend: one(trends, {
    fields: [trendMetadata.trendId],
    references: [trends.id],
  }),
}));

export const engagementsRelations = relations(engagements, ({ one }) => ({
  user: one(userProfile, {
    fields: [engagements.userId],
    references: [userProfile.userId],
  }),
  trend: one(trends, {
    fields: [engagements.trendId],
    references: [trends.id],
  }),
}));

export const savesRelations = relations(saves, ({ one }) => ({
  user: one(userProfile, {
    fields: [saves.userId],
    references: [userProfile.userId],
  }),
  trend: one(trends, {
    fields: [saves.trendId],
    references: [trends.id],
  }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  trend: one(trends, {
    fields: [products.trendId],
    references: [trends.id],
  }),
  clickouts: many(clickouts),
}));

export const clickoutsRelations = relations(clickouts, ({ one }) => ({
  user: one(userProfile, {
    fields: [clickouts.userId],
    references: [userProfile.userId],
  }),
  product: one(products, {
    fields: [clickouts.productId],
    references: [products.id],
  }),
}));

export const aiAnalysisRelations = relations(aiAnalysis, ({ one }) => ({
  trend: one(trends, {
    fields: [aiAnalysis.trendId],
    references: [trends.id],
  }),
}));

export const trendScoresRelations = relations(trendScores, ({ one }) => ({
  trend: one(trends, {
    fields: [trendScores.trendId],
    references: [trends.id],
  }),
}));

export const sponsoredContentRelations = relations(sponsoredContent, ({ one }) => ({
  trend: one(trends, {
    fields: [sponsoredContent.trendId],
    references: [trends.id],
  }),
  advertiser: one(userProfile, {
    fields: [sponsoredContent.advertiserId],
    references: [userProfile.userId],
  }),
}));
