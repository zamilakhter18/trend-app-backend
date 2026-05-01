## Context

The Trend App is designed as a high-performance platform for AI-powered trend discovery. This design establishes a multi-layered architecture to handle massive data ingestion, real-time user engagement, and complex scoring logic.

## Goals / Non-Goals

**Goals:**
- Implement an end-to-end flow from data ingestion (Python pipeline) to user interaction (Flutter app).
- Provide low-latency trend feeds using precomputed scores.
- Enable AI-driven content enrichment (LLM for explanations, Vision for tagging).
- Establish a meritocratic user identity system based on trend participation.
- Ensure strict separation and labeling of organic vs. sponsored content.

**Non-Goals:**
- Developing individual scraping scripts (handled by the Python Pipeline).
- Full implementation of all commerce features (initial focus is on discovery).

## Decisions

- **Infrastructure: Supabase (Backend-as-a-Service)**
  - **Rationale**: Integrated Auth, PostgreSQL, Realtime, and Edge Functions minimize infrastructure overhead.
  - **Alternatives**: Custom Node.js/Go backend (higher maintenance), Firebase (NoSQL limitations).

- **Mobile Framework: Flutter**
  - **Rationale**: High-performance UI with a single codebase for iOS and Android.

- **AI Layer: External API Integration (Async)**
  - **Rationale**: Using LLM and Vision APIs for enrichment ensures high-quality intelligence without building internal models initially. Processing is async to prevent UI blocking.

- **Scoring: Precomputed Values in DB**
  - **Rationale**: Calculating scores periodically or on-event and storing them in the DB allows for O(1) retrieval during feed requests.

- **Pagination: Cursor-based**
  - **Rationale**: More scalable and stable than offset-based pagination for high-frequency updates.

- **Data Ingestion: Python Data Pipeline**
  - **Rationale**: Python's rich ecosystem for scraping (Selenium, Playwright) and data processing (Pandas) is ideal for this layer.

## Risks / Trade-offs

- **Risk: AI Latency** -> **Mitigation**: Enrich trends asynchronously in the background; show basic data immediately while enrichment is pending.
- **Risk: Data Deduplication Complexity** -> **Mitigation**: Use hashing and similarity matching in the Python pipeline before DB insertion.
- **Risk: Rapid Time-Decay in Trending Content** -> **Mitigation**: Implement a time-decay logic in the scoring engine that heavily penalizes older content.
