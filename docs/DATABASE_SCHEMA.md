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
- `source`: String (Flexible: TikTok, Instagram, Pinterest, Ecommerce, etc.).
- `externalId`: String, ID from the source platform.
- `title`: String.
- `description`: Text.
- `phase`: Enum (`emerging`, `rising`, `peak`, `fading`).
- `phaseUpdatedAt`: Timestamp, tracked for reward and momentum calculations.
- `contentType`: String (`ORGANIC`, `SPONSORED`). Trust-preserving firewall.
- `status`: String (`DRAFT`, `PUBLISHED`, `ARCHIVED`, `FLAGGED`). Moderation status.
- `createdAt`: Timestamp.
- `updatedAt`: Timestamp.

### 4. TrendContent (`trend_content`)
Media and assets associated with a trend.
- `id`: UUID, Primary Key.
- `trendId`: UUID, Foreign Key to `Trend`.
- `contentUrl`: String.
- `contentType`: String (`video`, `image`, `link`).
- `isPrimary`: Boolean.
- `createdAt`: Timestamp.

### 5. TrendMetadata (`trend_metadata`)
Enriched data for a trend.
- `trendId`: UUID, Primary Key, Foreign Key to `Trend`.
- `tags`: Array of Strings.
- `categories`: Array of Strings.
- `sentimentScore`: Decimal.
- `aiSummary`: Text.
- `updatedAt`: Timestamp.

### 6. AiAnalysis (`ai_analysis`)
Deep analysis results from AI services.
- `trendId`: UUID, Primary Key, Foreign Key to `Trend`.
- `rawAnalysis`: JSONB, raw output from AI.
- `refinedSummary`: Text.
- `keywords`: Array of Strings.
- `visionData`: JSONB, image/video analysis data.
- `createdAt`: Timestamp.
- `updatedAt`: Timestamp.

### 7. TrendScore (`trend_scores`)
Performance metrics used for ranking and feed generation.
- `trendId`: UUID, Primary Key, Foreign Key to `Trend`.
- `score`: Decimal, base score.
- `finalScore`: Decimal, weighted final score.
- `velocity`: Decimal, rate of growth.
- `ctrScore`: Decimal, click-through rate score.
- `saveRateScore`: Decimal.
- `engagementCount`: Integer (Total interactions).
- `lastUpdated`: Timestamp.
- `calculatedAt`: Timestamp.

### 8. Product (`products`)
Products identified or linked within a trend.
- `id`: UUID, Primary Key.
- `trendId`: UUID, Foreign Key to `Trend`.
- `name`: String.
- `description`: Text.
- `price`: Decimal.
- `currency`: String (default `USD`).
- `affiliateUrl`: String.
- `imageUrl`: String.
- `isSponsored`: Boolean.
- `isAuthentic`: Boolean (Authenticity verification).
- `merchantName`: String.
- `affiliateNetwork`: String.
- `commerceMetadata`: JSONB (Affiliate tracking parameters).
- `createdAt`: Timestamp.
- `updatedAt`: Timestamp.

## Interaction Entities

### 9. Interaction (`interactions`)
Unified event log for all user actions.
- `id`: UUID, Primary Key.
- `userId`: UUID, Nullable, Foreign Key to `UserProfile`.
- `trendId`: UUID, Nullable, Foreign Key to `Trend`.
- `productId`: UUID, Nullable, Foreign Key to `Product`.
- `interactionType`: String (`VIEW`, `SAVE`, `CLICK`, `SHARE`).
- `sourceType`: String (e.g., `FEED`, `SEARCH`).
- `content`: Text (Optional context).
- `createdAt`: Timestamp.

### 10. Save (`saves`)
User bookmarks for both trends and products.
- `id`: UUID, Primary Key.
- `userId`: UUID, Foreign Key to `UserProfile`.
- `trendId`: UUID, Nullable, Foreign Key to `Trend`.
- `productId`: UUID, Nullable, Foreign Key to `Product`.
- `createdAt`: Timestamp.
*Constraint: Exactly one of trendId or productId must be set.*

### 11. Clickout (`clickouts`)
Tracks and attributes product discovery and commerce intent.
- `id`: UUID, Primary Key.
- `userId`: UUID, Nullable, Foreign Key to `UserProfile`.
- `productId`: UUID, Foreign Key to `Product`.
- `trendId`: UUID, Nullable, Foreign Key to `Trend`.
- `campaignId`: UUID, Nullable, Foreign Key to `CreatorCampaign`.
- `sourceType`: Enum (`ORGANIC_FEED`, `SPONSORED_FEED`, `CREATOR_PROFILE`, `SEARCH`, `RECOMMENDED`).
- `creatorId`: UUID, Nullable, Foreign Key to `UserProfile`.
- `sessionId`: String, Nullable.
- `ipHash`: String, Nullable, for deduplication.
- `createdAt`: Timestamp.

## Commerce & Conversion Intelligence (Future-Ready)

The architecture is designed to support a multi-touch attribution model and scalable conversion tracking.

### 12. Brand (`brands`)
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

### 13. SponsoredContent (`sponsored_content`)
Advertising data for promoted trends. Isolated from organic scoring.
- `id`: UUID, Primary Key.
- `trendId`: UUID, Foreign Key to `Trend`.
- `brandId`: UUID, Foreign Key to `Brand`.
- `budget`: Decimal.
- `placementBid`: Decimal.
- `isActive`: Boolean.
- `sponsorName`: String (Display override).
- `campaignName`: String.
- `placementSlotWeight`: Integer. Weight for paid placement logic. *CRITICAL: This MUST NOT be used for organic trend ranking or feed sorting.*
- `startsAt`: Timestamp.
- `endsAt`: Timestamp.
- `createdAt`: Timestamp.

## Creator Economy Entities (Future-Ready)

### 14. CreatorProfile (`creator_profiles`)
Future-ready expansion for creator-specific metadata.
- `id`: UUID, Primary Key.
- `userId`: UUID, Foreign Key to `UserProfile`.
- `bio`: Text.
- `portfolioUrl`: String.
- `socialLinks`: JSONB.
- `isVerified`: Boolean.
- `createdAt`: Timestamp.
- `updatedAt`: Timestamp.

### 15. CreatorAnalytics (`creator_analytics`)
Performance metrics for creators.
- `id`: UUID, Primary Key.
- `creatorProfileId`: UUID, Foreign Key to `CreatorProfile`.
- `totalReach`: Integer.
- `totalEngagement`: Integer.
- `averageEngagementRate`: Decimal.
- `audienceDemographics`: JSONB.
- `lastUpdated`: Timestamp.

### 16. CreatorCampaign (`creator_campaigns`)
Tracks collaborations between Brands and Creators.
- `id`: UUID, Primary Key.
- `creatorProfileId`: UUID, Foreign Key to `CreatorProfile`.
- `brandId`: UUID, Foreign Key to `Brand`.
- `name`: String.
- `status`: Enum (`pending`, `active`, `completed`, `cancelled`).
- `budget`: Decimal.
- `createdAt`: Timestamp.
- `updatedAt`: Timestamp.

## Auditing & Lifecycle Entities

### 17. TrendPhaseHistory (`trend_phase_history`)
Tracks every lifecycle transition of a trend.
- `id`: UUID, Primary Key.
- `trendId`: UUID, Foreign Key to `Trend`.
- `oldPhase`: Enum (`emerging`, `rising`, `peak`, `fading`), Nullable.
- `newPhase`: Enum (`emerging`, `rising`, `peak`, `fading`).
- `changedAt`: Timestamp.
- `metadata`: JSONB.

### 18. ScoreEvent (`score_events`)
Append-only audit history for user score changes.
- `id`: UUID, Primary Key.
- `userId`: UUID, Foreign Key to `UserProfile`.
- `pointsDelta`: Decimal.
- `reason`: Enum (`EARLY_DISCOVERY`, `SAVE_BONUS`, `SHARE_BONUS`, `TREND_SPOTTED`, `ADMIN_ADJUSTMENT`).
- `sourceType`: Enum (`TREND`, `PRODUCT`, `SYSTEM`).
- `sourceId`: UUID, Nullable.
- `createdAt`: Timestamp.

### 19. TrendSignal (`trend_signals`)
Raw ingestion and AI scoring signals.
- `id`: UUID, Primary Key.
- `trendId`: UUID, Foreign Key to `Trend`.
- `source`: Enum (`instagram`, `tiktok`, `x`, `pinterest`, `other`).
- `signalType`: Enum (`velocity`, `saves`, `growth`, `momentum`).
- `signalValue`: Decimal.
- `metadata`: JSONB.
- `createdAt`: Timestamp.

### 20. EarlyDiscoveryReward (`early_discovery_rewards`)
Tracking for early discovery rewards.
- `id`: UUID, Primary Key.
- `userId`: UUID, Foreign Key to `UserProfile`.
- `trendId`: UUID, Foreign Key to `Trend`.
- `phaseAtDiscovery`: Enum (`emerging`, `rising`, `peak`, `fading`).
- `bonusPoints`: Decimal.
- `rewardType`: Enum (`POINTS`, `BADGE`, `PERK`).
- `claimed`: Boolean.
- `createdAt`: Timestamp.
