## Context

The Trend App is an AI-powered discovery and commerce platform. This design establishes a production-ready backend architecture using **NestJS** as the application framework and Supabase as the data and security layer.

## Goals / Non-Goals

**Goals:**
- Implement a clear multi-tier architecture (Python Pipeline → NestJS Server → Supabase DB).
- Utilize NestJS's modular architecture for high maintainability and scalability.
- Provide a robust database schema with optimized indexing for trend discovery.
- Design a scalable REST API with JWT authentication and cursor-based pagination.
- Establish a background scoring and AI enrichment engine.

**Non-Goals:**
- Implementation of front-end UI/UX logic.
- Real-time video processing (only metadata and content links).

## Decisions

### 1. Architecture: System Components & Data Flow
- **Data Flow**: `Ingestion (Python)` → `Database (Supabase)` → `AI Enrichment (Edge/Node)` → `Feed (NestJS)` → `User Interaction` → `Engagement Logging` → `Scoring Engine`.
- **Backend Role**: NestJS handles business logic via specialized Modules, Controllers, and Services. It manages auth orchestration, and API routing using decorators and built-in Dependency Injection.
- **Supabase Role**: Manages persistent storage, Row Level Security (RLS), real-time subscriptions, and authentication storage.

#### System Components
- **Feed Engine**: NestJS Controller/Service that serves ranked trend feeds. Uses precomputed scores from `trend_scores` and supports cursor-based pagination.
- **Trend Engine**: Aggregates signals and classifies trends into lifecycle stages (`emerging`, `rising`, etc.).
- **Scoring Engine**: Calculates trend scores periodically. Implemented as a NestJS Task (Cron) or background worker.
- **Identity System**: Manages user profiles, engagement tracking, and meritocratic rewards.

### 2. Database: Full Schema (Supabase PostgreSQL)
The schema remains consistent, optimized for high read-performance.

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

### 3. API Design: NestJS REST
- **Authentication**: JWT-based via NestJS `Passport` and `@nestjs/jwt`.
- **Feed**: `GET /feed` uses a `cursor` for stable pagination.
- **DTOs & Validation**: Uses `class-validator` and `class-transformer` for robust request validation.

## Risks / Trade-offs

- **Risk: Learning Curve** -> **Mitigation**: NestJS provides excellent documentation and a standardized structure that pays off in long-term maintenance.
- **Risk: Overhead** -> **Mitigation**: NestJS is built on top of Express (by default), providing a thin abstraction layer with powerful features.
