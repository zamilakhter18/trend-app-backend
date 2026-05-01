## Why

The Trend App needs a refined, high-performance backend specification to transition from a prototype phase to a production-ready system. This change establishes a clear architectural boundary between the Node.js (Express) server and the Supabase database, while completing the schema and API design for a scalable e-commerce and trend intelligence platform.

## What Changes

- **Architectural Shift**: Transition from a Supabase-centric logic approach to a Node.js (Express) server that manages complex business logic, while using Supabase primarily for data storage, real-time sync, and RLS security.
- **Enhanced Data Flow**: Implementation of a step-by-step pipeline: Ingestion → DB → AI Enrichment → Feed → User → Engagement → Scoring.
- **Complete Schema**: Full implementation of all core tables including `trend_metadata`, `products`, `engagements`, `ai_analysis`, and `sponsored_content`.
- **Express-based REST API**: Implementation of a complete API suite with JWT authentication, cursor-based pagination, and specialized commerce endpoints.

## Capabilities

### New Capabilities
- `node-express-server-setup`: Core backend server with middleware, routing, and Supabase integration.
- `jwt-authentication-system`: Secure sign-up, login, and session management via Express and Supabase Auth.
- `scalable-feed-engine`: Node-optimized retrieval of trending content with cursor-based pagination.
- `comprehensive-engagement-tracking`: APIs for saves, interactions, and product click-throughs.
- `automated-scoring-engine`: Periodic computation of trend and user performance metrics.
- `ai-enrichment-service`: Integration with external LLM and Vision APIs for content analysis.

### Modified Capabilities
- (None)

## Impact

- **Backend**: New Node.js (Express) codebase.
- **Database**: Expanded Supabase (PostgreSQL) schema with 12 core tables.
- **API**: Full REST API specification with standard request/response structures.
- **Security**: Supabase RLS policies acting as a secondary safety net for the Node.js server.
