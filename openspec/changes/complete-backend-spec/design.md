## Context

The Trend App requires a robust and highly detailed backend architecture to support its AI-powered trend discovery and commerce goals. This design document formalizes the data flow, system components, and database schema to ensure a production-ready implementation.

## Goals / Non-Goals

**Goals:**
- Define a complete and scalable data flow (Ingestion → AI → DB → Feed → User → Scoring).
- Establish explicit system components: Feed Engine, Trend Engine, Scoring Engine, and Identity System.
- Expand the database schema to cover all required entities (trends, products, engagements, etc.).
- Design a comprehensive RESTful API with cursor-based pagination.
- Implement fine-grained RLS security.

**Non-Goals:**
- Detailed implementation of the Python scraping scripts (architecture only).
- Frontend UI/UX design details.

## Decisions

### 1. Data Flow Architecture
The system follows a linear but highly automated pipeline:
1. **Ingestion**: Python scripts scrape external signals (social, news) and push raw data to a queue.
2. **AI Enrichment**: Edge Functions trigger AI models (LLM/Vision) to generate explanations and tags.
3. **Database**: Enriched data is structured and stored in PostgreSQL.
4. **Feed Engine**: Optimized queries serve ranked content to users via cursor-based pagination.
5. **User Interaction**: Users view, save, engage, and click out to products.
6. **Scoring Engine**: Interaction data is used to re-calculate trend and user scores asynchronously.

### 2. System Components
- **Feed Engine**: Responsible for serving content. Uses materialized views or precomputed scores to maintain low latency.
- **Trend Engine**: Manages trend lifecycle (creation, phase changes, decay).
- **Scoring Engine**: Computes complex scores (time-decay, engagement velocity) in the background.
- **Identity System**: Manages user profiles, meritocratic scores, and achievements.

### 3. Expanded Database Schema
| Table | Purpose | Relationships |
|-------|---------|---------------|
| `users` | Core auth data | 1:1 with `user_profiles` |
| `user_profiles` | Metadata, trend scores | Links to `users` |
| `trends` | Primary trend entity | Links to `creator_id` |
| `trend_content` | Media (images, videos) | Links to `trends` |
| `trend_metadata` | AI tags, category, phase | Links to `trends` |
| `products` | E-commerce items | Links to `trends` |
| `engagements` | Likes, comments, shares | Links to `users`, `trends` |
| `saves` | Bookmarked trends | Links to `users`, `trends` |
| `ai_analysis` | LLM summaries, Vision tags | Links to `trends` |
| `trend_scores` | Precomputed daily/hourly scores | Links to `trends` |
| `clickouts` | Tracking external commerce clicks | Links to `users`, `products` |
| `sponsored_content` | Ad metadata and budgets | Links to `trends` |

### 4. API Design Decision: Cursor-based Pagination
To handle high-frequency data updates and large feeds, the system will use a `cursor` (encoded ID/score) rather than `offset`. This prevents item skipping and is significantly more performant at scale.

## Risks / Trade-offs

- **Risk: Database Load during Scoring** -> **Mitigation**: Offload scoring to Edge Functions and use Materialized Views for the Feed Engine.
- **Risk: RLS Performance** -> **Mitigation**: Ensure all RLS policies use indexed foreign keys and avoid complex joins within the policy itself.
