## 1. Project Setup & Architecture

- [ ] 1.1 Initialize a new Node.js project with TypeScript.
- [ ] 1.2 Set up the Express server with core middleware (Cors, Helmet, Body-Parser).
- [ ] 1.3 Configure the Supabase client with Service Role and Anon keys.
- [ ] 1.4 Implement the JWT verification middleware using `jsonwebtoken`.

## 2. Database Schema (Supabase PostgreSQL)

- [ ] 2.1 Implement core user and profile migrations (`users`, `user_profile`).
- [ ] 2.2 Implement trend core migrations (`trends`, `trend_content`, `trend_metadata`).
- [ ] 2.3 Implement interaction and commerce migrations (`engagements`, `saves`, `products`, `clickouts`).
- [ ] 2.4 Implement analysis and scoring migrations (`ai_analysis`, `trend_scores`, `sponsored_content`).
- [ ] 2.5 Apply optimized PostgreSQL indexes for feed sorting and tag searching.
- [ ] 2.6 Configure Supabase RLS policies for all 12 tables.

## 3. Auth & Profile APIs

- [ ] 3.1 Implement `POST /auth/signup` and `POST /auth/login` using Supabase Auth.
- [ ] 3.2 Implement `GET /auth/me` to retrieve the current user's profile and metadata.

## 4. Feed & Trend Intelligence

- [ ] 4.1 Implement `GET /feed` with cursor-based pagination logic.
- [ ] 4.2 Implement `GET /trend/:id` to retrieve full trend details and associated products.
- [ ] 4.3 Implement `GET /trend/:id/explanation` for AI-generated trend summaries.

## 5. Engagement & E-commerce Tracking

- [ ] 5.1 Implement `POST /trend/engage` and `POST /trend/save` interaction endpoints.
- [ ] 5.2 Implement `GET /products/:trend_id` to list affiliate products.
- [ ] 5.3 Implement `POST /product/click` for conversion and click-through tracking.

## 6. Scoring Engine & Background Jobs

- [ ] 6.1 Develop the scoring algorithm (velocity + decay) in a dedicated service.
- [ ] 6.2 Set up a cron job (via Edge Functions or Node scheduler) for periodic score updates.
- [ ] 6.3 Implement `GET /user/score` to retrieve meritocratic performance data.

## 7. Optimization & Verification

- [ ] 7.1 Implement caching for the trend feed using Redis or in-memory TTL.
- [ ] 7.2 Run end-to-end integration tests for the full data flow.
- [ ] 7.3 Perform a security audit on RLS policies and JWT implementation.
