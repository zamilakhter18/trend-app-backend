## Context

The Trend App is a new social platform focused on real-time trend discovery and user interaction. This design document outlines the initial backend architecture using Supabase to support these requirements from scratch.

## Goals / Non-Goals

**Goals:**
- Establish a scalable and secure relational database schema in PostgreSQL.
- Implement real-time data synchronization for trend feeds and engagement metrics.
- Leverage Row Level Security (RLS) for fine-grained access control.
- Use Edge Functions for server-side business logic and trend ranking.

**Non-Goals:**
- Development of the frontend application.
- Implementation of advanced machine learning ranking algorithms (initial version will use engagement counts).
- Multi-region database replication or complex caching layers (standard Supabase managed services suffice for the initial phase).

## Decisions

- **Infrastructure: Supabase Managed Services**
  - **Rationale**: Provides an integrated suite (PostgreSQL, Auth, Storage, Realtime, Functions) that accelerates development and reduces operational overhead.
  - **Alternatives**: AWS/GCP (higher management cost), Firebase (NoSQL limitations for complex trend relationships).

- **Data Modeling: Relational Schema**
  - **Profiles**: Extended user data linked to `auth.users`.
  - **Trends**: Central entity for user-submitted content.
  - **Interactions**: Normalized table to log likes, shares, and views, enabling flexible aggregation.

- **Security: Row Level Security (RLS)**
  - **Rationale**: Enforces security at the database level, ensuring that users can only modify their own data and read public trends.
  - **Policy Example**: `trends` table allows `SELECT` for all authenticated users, but `INSERT/UPDATE/DELETE` only for the `creator_id`.

- **Real-time: Postgres CDC (Change Data Capture)**
  - **Rationale**: Supabase Realtime allows clients to subscribe to changes in the `trends` and `interactions` tables with minimal configuration.

## Risks / Trade-offs

- **Risk: RLS Complexity** -> **Mitigation**: Implement automated database tests using `pgTAP` or a custom test suite to verify RLS policies.
- **Risk: Scalability of Interaction Aggregation** -> **Mitigation**: Use Materialized Views or a background Edge Function to periodically pre-calculate trend scores if real-time count queries become slow.
- **Risk: Vendor Lock-in (Supabase)** -> **Mitigation**: Maintain a clean separation between business logic in Edge Functions and database-specific features to allow for easier migration to a standard PostgreSQL environment if needed.
