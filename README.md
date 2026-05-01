# Trend App Backend

This repository contains the production-ready backend for the **Trend App**, a high-performance, AI-powered trend discovery and commerce platform.

## 🚀 Tech Stack

- **Application Server**: Node.js + Express (TypeScript)
- **Database & Security**: Supabase (PostgreSQL + Row Level Security)
- **AI Layer**: External APIs (LLM for explanations + Vision for tagging)
- **Data Ingestion**: Python-based data pipeline
- **Authentication**: JWT-based via Supabase Auth

## 📄 Project Specification

The detailed, production-ready specification for this backend is managed via OpenSpec and can be found in the following location:

**Base Path**: `openspec/changes/refined-backend-specification/`

- **[Proposal](openspec/changes/refined-backend-specification/proposal.md)**: Project vision, "Why", and core capabilities.
- **[Technical Design](openspec/changes/refined-backend-specification/design.md)**: High-level architecture, database schema, and technical decisions.
- **[Detailed Requirements](openspec/changes/refined-backend-specification/specs/)**: Granular specifications and test scenarios for every system component.
- **[Implementation Tasks](openspec/changes/refined-backend-specification/tasks.md)**: Step-by-step roadmap for building the system.

---

## 🏗 System Architecture

The Trend App follows a multi-tier architecture designed for scalability and real-time responsiveness.

### Data Flow
1. **Ingestion**: A Python pipeline scrapes external social and news signals, deduplicates data, and pushes it to Supabase.
2. **AI Enrichment**: Edge Functions or background jobs trigger AI models (LLM/Vision) to generate trend summaries and tags.
3. **Storage**: Enriched trends, products, and metadata are stored in a structured PostgreSQL schema.
4. **Feed Engine**: The Express server serves a ranked, precomputed feed to the mobile app using cursor-based pagination.
5. **Engagement**: User interactions (saves, likes, clicks) are logged in real-time.
6. **Scoring**: A background engine re-calculates trend and user performance scores based on interaction velocity and time-decay.

---

## 📊 Database Schema (Supabase PostgreSQL)

The schema consists of 12 core tables designed for high-performance retrieval:

- **Users & Profiles**: `users`, `user_profile` (merit scores, metadata).
- **Trends & Content**: `trends`, `trend_content` (media), `trend_metadata` (tags, phases).
- **E-commerce**: `products` (affiliate links), `sponsored_content`, `clickouts` (conversion tracking).
- **Interactions**: `engagements` (likes, comments), `saves` (bookmarks).
- **Intelligence**: `ai_analysis` (summaries), `trend_scores` (precomputed rankings).

### Indexing Strategy
- **GIN indexes** on `trend_metadata.tags` for fast keyword searching.
- **B-Tree indexes** on `trend_scores.score` and `trends.created_at` for optimized feed sorting.
- **Unique composite indexes** on interaction tables to ensure data integrity.

---

## 🔌 API Reference (Express REST)

### Authentication
- `POST /auth/signup` / `POST /auth/login`: Identity management.
- `GET /auth/me`: Retrieve current user context.

### Discovery (The Feed)
- `GET /feed`: Cursor-based trending feed.
- `GET /trend/:id`: Detailed trend information.
- `GET /trend/:id/explanation`: AI-generated "why it's trending" summary.

### Engagement & Commerce
- `POST /trend/engage`: Log likes, shares, and comments.
- `POST /trend/save`: Bookmark a trend.
- `GET /products/:trend_id`: List associated affiliate products.
- `POST /product/click`: Track e-commerce redirects.

### Performance
- `GET /user/score`: Retrieve meritocratic trend-spotting rank.

---

## 🛠 How It Works

### Feed Optimization
To maintain low latency, the feed is served via **precomputed scores**. The `Scoring Engine` runs periodically to update the `trend_scores` table, and the Express server uses these scores combined with a cursor to fetch pages in O(1) time.

### Security with RLS
While the Express server manages business logic, **Row Level Security (RLS)** in Supabase acts as a secondary safety net. Policies ensure that:
- Users can only read their own `saves` and `profiles`.
- Trends are public-read but private-write (only for authorized ingestion/creators).
- Interaction counts are protected against spoofing at the database level.

### AI Enrichment Pipeline
New trends are ingested as "raw" signals. A database trigger or webhook notifies the enrichment service, which calls external Vision and LLM APIs. This allows the UI to show basic data immediately while the "intelligence" (summaries/tags) appears asynchronously as it completes.

---

## 📋 Implementation Tasks

Detailed implementation steps can be found in `openspec/changes/refined-backend-specification/tasks.md`. Key phases include:
1. Infrastructure & Node.js/Express Setup
2. Supabase Database Migration & RLS Configuration
3. Core REST API Development
4. E-commerce & Click Tracking System
5. Scoring Engine & AI Service Integration
6. Feed Optimization & Caching
