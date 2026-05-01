## Context

The Trend App is an AI-powered discovery and commerce platform. This design establishes a production-ready backend architecture using Node.js (Express) as the application layer and Supabase as the data and security layer.

## Goals / Non-Goals

**Goals:**
- Implement a clear multi-tier architecture (Python Pipeline → Express Server → Supabase DB).
- Provide a robust database schema with optimized indexing for trend discovery.
- Design a scalable REST API with JWT authentication and cursor-based pagination.
- Establish a background scoring and AI enrichment engine.

**Non-Goals:**
- Implementation of front-end UI/UX logic.
- Real-time video processing (only metadata and content links).

## Decisions

### 1. Architecture: System Components & Data Flow
- **Data Flow**: `Ingestion (Python)` → `Database (Supabase)` → `AI Enrichment (Edge/Node)` → `Feed (Express)` → `User Interaction` → `Engagement Logging` → `Scoring Engine`.
- **Backend Role**: Node.js (Express) handles business logic, auth orchestration, and API routing.
- **Supabase Role**: Manages persistent storage, Row Level Security (RLS), real-time subscriptions, and authentication storage (managed by Express).

### 2. Database: Full Schema (Supabase PostgreSQL)
The schema is designed for high read-performance and detailed tracking.

| Table | Purpose | Relationships |
|-------|---------|---------------|
| `users` | Auth management | 1:1 with `user_profile` |
| `user_profile` | User metadata & trend scores | `user_id` FK to `users` |
| `trends` | Primary trend entity | `creator_id` FK to `users` |
| `trend_content` | Media links & types | `trend_id` FK to `trends` |
| `trend_metadata` | Tags, categories, phases | `trend_id` FK to `trends` |
| `products` | Affiliate items | `trend_id` FK to `trends` |
| `engagements` | Likes, comments, shares | `user_id`, `trend_id` FKs |
| `saves` | Bookmarked trends | `user_id`, `trend_id` FKs |
| `ai_analysis` | Summaries & tagging data | `trend_id` FK to `trends` |
| `trend_scores` | Precomputed daily/hourly scores | `trend_id` FK to `trends` |
| `clickouts` | E-commerce conversion tracking | `user_id`, `product_id` FKs |
| `sponsored_content` | Paid content metadata | `trend_id` FK to `trends` |

**Indexing Strategy**: 
- GIN indexes on `trend_metadata.tags`.
- B-Tree indexes on `trends.created_at` and `trend_scores.score` for fast feed sorting.
- Unique indexes on `saves(user_id, trend_id)` to prevent duplicates.

### 3. API Design: Express-based REST
- **Authentication**: JWT-based via `jsonwebtoken` and Supabase Auth.
- **Feed**: `GET /feed` uses a `cursor` (encoded `score|timestamp`) for stable pagination.
- **Mobile Optimization**: Lean JSON responses and efficient error handling.

## Risks / Trade-offs

- **Risk: Cold Starts in AI Functions** -> **Mitigation**: Use a queue system (BullMQ) or keep functions "warm" via periodic pings.
- **Risk: Sync Latency between Express and Supabase** -> **Mitigation**: Use Supabase's real-time events to push updates to the Express server if needed, or rely on direct DB queries for critical paths.
