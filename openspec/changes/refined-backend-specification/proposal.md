## Why

The Trend App needs a refined, high-performance backend specification to transition from a prototype phase to a production-ready system. This change adopts **NestJS**, a progressive Node.js framework, to provide a modular, testable, and maintainable architecture for a scalable e-commerce and trend intelligence platform.

## What Changes

- **Framework Shift**: Transition from Express.js to **NestJS** for better architecture management through Dependency Injection and Modules.
- **Enhanced Data Flow**: Implementation of a step-by-step pipeline: Ingestion → DB → AI Enrichment → Feed → User → Engagement → Scoring.
- **Complete Schema**: Full implementation of all core tables including `trend_metadata`, `products`, `engagements`, `ai_analysis`, and `sponsored_content`.
- **NestJS REST API**: Implementation of a complete API suite using NestJS controllers, services, and modules, featuring JWT authentication and cursor-based pagination.
- **Core Engine Integration**: Implementation of the Feed, Trend, Scoring, and Identity engines as dedicated NestJS modules.

## Capabilities

### New Capabilities
- `nestjs-server-setup`: Core backend server using NestJS modular architecture.
- `jwt-authentication-system`: Secure sign-up and login via NestJS Passport and Supabase Auth.
- `scalable-feed-engine`: NestJS-optimized retrieval of trending content with cursor-based pagination.
- `comprehensive-engagement-tracking`: Modular APIs for interactions and product click-throughs.
- `automated-scoring-engine`: Background tasks for periodic computation of metrics.
- `ai-enrichment-service`: Integration with LLM APIs within a dedicated NestJS service.

### Modified Capabilities
- (None)

## Impact

- **Backend**: New NestJS codebase with TypeScript.
- **Database**: Expanded Supabase (PostgreSQL) schema with 12 core tables.
- **API**: Full REST API specification with NestJS decorators and DTOs.
- **Security**: NestJS Guards and Supabase RLS policies.
