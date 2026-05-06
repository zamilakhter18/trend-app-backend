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
- `role`: Enum (`USER`, `ADMIN`, `ADVERTISER`).
- `trendScore`: Decimal, tracks user's contribution value.
- `level`: Integer, user level.
- `badges`: Array of Strings.
- `createdAt`: Timestamp.
- `updatedAt`: Timestamp.

### 2. Trend (`trends`)
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

### 11. SponsoredContent (`sponsored_content`)
Advertising data for promoted trends.
- `trendId`: UUID, Primary Key, Foreign Key to `Trend`.
- `advertiserId`: UUID, Foreign Key to `UserProfile`.
- `budget`: Decimal.
- `bidAmount`: Decimal.
- `isActive`: Boolean.
- `sponsorName`: String.
- `campaignName`: String.
- `priorityScore`: Integer.
- `startsAt`: Timestamp.
- `endsAt`: Timestamp.
- `createdAt`: Timestamp.
