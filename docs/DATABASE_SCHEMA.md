# Database Schema Documentation

This document provides details for all the schemas designed and implemented in the Trend App Backend.

## Core Entities

### 1. UserProfile (`user_profile`)
Stores user-related information, roles, and gamification metrics.
- `userId`: UUID, Primary Key.
- `username`: String, Unique.
- `email`: String, Unique.
- `fullName`: String.
- `avatarUrl`: String.
- `role`: Enum (`USER`, `ADMIN`, `CREATOR`).
- `trendScore`: Decimal, tracks user's contribution value. Source of truth for level.
- `level`: Integer, computed dynamically from `trendScore` (floor(trendScore / 100) + 1).
- `createdAt`: Timestamp.
- `updatedAt`: Timestamp.

### 2. UserBadge (`user_badges`)
Relational badge system for reward traceability.
- `id`: UUID, Primary Key.
- `userId`: UUID, Foreign Key to `UserProfile`.
- `badgeType`: Enum (`EARLY_SPOTTER`, `STREETWEAR_EXPERT`, `LUXURY_CURATOR`, `TREND_HUNTER`).
- `earnedAt`: Timestamp, when the badge was earned.
- `sourceTrendId`: UUID, Nullable, Foreign Key to `Trend` that triggered the reward.
- `metadata`: JSONB, additional context for the reward.
- `createdAt`: Timestamp.

### 3. Trend (`trends`)
The central entity representing a trend.
- `id`: UUID, Primary Key.
- `creatorId`: UUID, Foreign Key to `UserProfile`.
- `source`: Enum (`TIKTOK`, `INSTAGRAM`, `OTHER`).
- `externalId`: String, ID from the source platform.
- `title`: String.
- `description`: Text.
- `phase`: Enum (`emerging`, `rising`, `peak`, `fading`).
- `createdAt`: Timestamp.
- `updatedAt`: Timestamp.

### 3. TrendContent (`trend_content`)
Media and assets associated with a trend.
- `id`: UUID, Primary Key.
- `trendId`: UUID, Foreign Key to `Trend`.
- `contentUrl`: String.
- `contentType`: String (`video`, `image`, `link`).
- `isPrimary`: Boolean.
- `createdAt`: Timestamp.

### 4. TrendMetadata (`trend_metadata`)
Enriched data for a trend.
- `trendId`: UUID, Primary Key, Foreign Key to `Trend`.
- `tags`: Array of Strings.
- `categories`: Array of Strings.
- `sentimentScore`: Decimal.
- `aiSummary`: Text.
- `updatedAt`: Timestamp.

### 5. AiAnalysis (`ai_analysis`)
Deep analysis results from AI services.
- `trendId`: UUID, Primary Key, Foreign Key to `Trend`.
- `rawAnalysis`: JSONB, raw output from AI.
- `refinedSummary`: Text.
- `keywords`: Array of Strings.
- `visionData`: JSONB, image/video analysis data.
- `createdAt`: Timestamp.
- `updatedAt`: Timestamp.

### 6. TrendScore (`trend_scores`)
Performance metrics used for ranking and feed generation.
- `trendId`: UUID, Primary Key, Foreign Key to `Trend`.
- `score`: Decimal, base score.
- `finalScore`: Decimal, weighted final score.
- `velocity`: Decimal, rate of growth.
- `ctrScore`: Decimal, click-through rate score.
- `saveRateScore`: Decimal.
- `engagementCount`: Integer.
- `lastUpdated`: Timestamp.
- `calculatedAt`: Timestamp.

### 7. Product (`products`)
Products identified or linked within a trend.
- `id`: UUID, Primary Key.
- `trendId`: UUID, Foreign Key to `Trend`.
- `name`: String.
- `description`: Text.
- `price`: Decimal.
- `currency`: String (default `USD`).
- `affiliateUrl`: String.
- `imageUrl`: String.
- `createdAt`: Timestamp.
- `updatedAt`: Timestamp.

## Interaction Entities

### 8. Engagement (`engagements`)
Tracks user interactions with trends.
- `id`: UUID, Primary Key.
- `userId`: UUID, Foreign Key to `UserProfile`.
- `trendId`: UUID, Foreign Key to `Trend`.
- `type`: String (`like`, `comment`, `share`).
- `content`: Text (e.g., for comments).
- `createdAt`: Timestamp.

### 9. Save (`saves`)
User bookmarks for trends.
- `userId`: UUID, Composite Primary Key, Foreign Key to `UserProfile`.
- `trendId`: UUID, Composite Primary Key, Foreign Key to `Trend`.
- `createdAt`: Timestamp.

### 10. Clickout (`clickouts`)
Tracks when users click on product affiliate links.
- `id`: UUID, Primary Key.
- `userId`: UUID, Foreign Key to `UserProfile`.
- `productId`: UUID, Foreign Key to `Product`.
- `createdAt`: Timestamp.

### 11. Brand (`brands`)
Separate entity for advertisers and organizations.
- `id`: UUID, Primary Key.
- `name`: String, Unique.
- `verified`: Boolean.
- `billingMetadata`: JSONB.
- `websiteUrl`: String.
- `logoUrl`: String.
- `ownerId`: UUID, Foreign Key to `UserProfile`.
- `createdAt`: Timestamp.
- `updatedAt`: Timestamp.

### 12. SponsoredContent (`sponsored_content`)
Advertising data for promoted trends. Isolated from organic scoring.
- `trendId`: UUID, Primary Key, Foreign Key to `Trend`.
- `brandId`: UUID, Foreign Key to `Brand`.
- `budget`: Decimal.
- `placementBid`: Decimal.
- `isActive`: Boolean.
- `sponsorName`: String (Display override).
- `campaignName`: String.
- `campaignPriority`: Integer (Used for placement weight, NOT organic ranking).
- `startsAt`: Timestamp.
- `endsAt`: Timestamp.
- `createdAt`: Timestamp.

## Creator Economy Entities (Future-Ready)

### 13. CreatorProfile (`creator_profiles`)
Future-ready expansion for creator-specific metadata.
- `id`: UUID, Primary Key.
- `userId`: UUID, Foreign Key to `UserProfile`.
- `bio`: Text.
- `portfolioUrl`: String.
- `socialLinks`: JSONB.
- `isVerified`: Boolean.
- `createdAt`: Timestamp.
- `updatedAt`: Timestamp.

### 14. CreatorAnalytics (`creator_analytics`)
Performance metrics for creators.
- `id`: UUID, Primary Key.
- `creatorProfileId`: UUID, Foreign Key to `CreatorProfile`.
- `totalReach`: Integer.
- `totalEngagement`: Integer.
- `averageEngagementRate`: Decimal.
- `audienceDemographics`: JSONB.
- `lastUpdated`: Timestamp.

### 15. CreatorCampaign (`creator_campaigns`)
Tracks collaborations between Brands and Creators.
- `id`: UUID, Primary Key.
- `creatorProfileId`: UUID, Foreign Key to `CreatorProfile`.
- `brandId`: UUID, Foreign Key to `Brand`.
- `name`: String.
- `status`: Enum (`pending`, `active`, `completed`, `cancelled`).
- `budget`: Decimal.
- `createdAt`: Timestamp.
- `updatedAt`: Timestamp.
