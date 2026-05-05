## General Guidelines

- **Atomic Commits:** After every successfully implemented feature or sub-task, make a git commit with a clear and meaningful message describing the change.

## 1. Project Setup & Architecture

- [x] 1.1 Initialize a new NestJS project using the Nest CLI.
- [x] 1.2 Configure global middleware (Cors, Helmet, ValidationPipe).
- [x] 1.3 Set up the Supabase Module and Service to wrap the Supabase client.
- [x] 1.4 Implement the Auth Module with Passport and JWT Strategy.

## 2. Database Schema (Supabase PostgreSQL)

- [x] 2.1 Implement core user and profile migrations (`users`, `user_profile`).
- [x] 2.2 Implement trend core migrations (`trends`, `trend_content`, `trend_metadata`).
- [x] 2.3 Implement interaction and commerce migrations (`engagements`, `saves`, `products`, `clickouts`).
- [x] 2.4 Implement analysis and scoring migrations (`ai_analysis`, `trend_scores`, `sponsored_content`).
- [x] 2.5 Apply optimized PostgreSQL indexes for feed sorting and tag searching.
- [x] 2.6 Configure Supabase RLS policies for all 12 tables.

## 3. Auth & Profile APIs

- [x] 3.1 Implement `AuthModule` with `signup` and `login` endpoints.
- [x] 3.2 Implement `ProfileModule` to retrieve the current user's profile and metadata.

## 4. Feed & Trend Intelligence

- [x] 4.1 Implement `FeedModule` with a controller and service for cursor-based pagination.
- [x] 4.2 Implement `TrendModule` to retrieve full trend details and associated products.
- [x] 4.3 Implement AI enrichment service for trend summaries and explanations.

## 5. Engagement & E-commerce Tracking

- [x] 5.1 Implement `EngagementModule` with endpoints for likes, saves, and clicks.
- [x] 5.2 Implement `ProductModule` to manage affiliate product data.

## 6. Scoring Engine & Background Jobs

- [x] 6.1 Implement the scoring algorithm in a dedicated `ScoringService`.
- [ ] 6.2 Configure NestJS `ScheduleModule` for periodic score update tasks.
- [ ] 6.3 Implement `IdentityModule` for user-specific performance and rewards.

## 7. Optimization & Verification

- [ ] 7.1 Implement caching using NestJS `CacheModule`.
- [ ] 7.2 Run end-to-end (E2E) tests using NestJS testing utilities.
- [ ] 7.3 Perform security audit on Guards and RLS policies.
