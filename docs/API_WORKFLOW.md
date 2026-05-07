# API and User Work Cycle Documentation

This document outlines the interaction between users, the API endpoints, and the database for the Trend App.

---

## 🔐 Security & Authentication

The system uses a centralized **JWT-based Authentication** and **Role-Based Authorization (RBAC)** system.

- **Header:** `Authorization: Bearer <your_jwt_token>`
- **Token Source:** Obtained from `POST /auth/login` or `POST /auth/signup`.
- **User Roles:** `USER` (Default), `CREATOR`, `ADMIN`.
- **Integration:** All protected APIs are marked with `@ApiBearerAuth('JWT-auth')` for seamless Swagger UI testing.

---

## 🏆 Reward & Gamification Architecture

The system uses a multi-layered approach to user rewards, ensuring traceability and consistency.

### 📊 Trend Score & Leveling

- **Source of Truth**: The `trend_score` in `user_profile` is the canonical value for user contributions.
- **Computed Level**: User `level` is derived dynamically from `trend_score`.
  - **Formula**: `level = floor(trend_score / 100) + 1`
  - This avoids data drift and ensures the level always reflects the current score.

### 🏅 Relational Badge System

Badges are stored in the `user_badges` table instead of a simple array. This provides:
- **Earned Timestamps**: Exactly when a user achieved a milestone.
- **Source Traceability**: Linking a badge to the specific `trend_id` that triggered it (e.g., for "Early Spotter").
- **Metadata Support**: Storing additional context about the reward.

**Badge Types:**
- `EARLY_SPOTTER`: Awarded for engaging with a trend in its 'emerging' phase.
- `STREETWEAR_EXPERT`: High engagement/accuracy in streetwear category.
- `LUXURY_CURATOR`: High engagement/accuracy in luxury category.
- `TREND_HUNTER`: High volume of successful trend discoveries.

---

## 🛰️ Interaction & Event-Driven Architecture

The platform uses a unified **Interaction/Event Log** system rather than traditional social media "comments/likes" logic. This architecture supports trend intelligence, trust preservation, and scalable analytics.

### 🔄 Unified Interaction System

All user actions are logged in the `interactions` table:
- **Interaction Types**: `VIEW`, `SAVE`, `CLICK`, `SHARE`.
- **Targets**: Interactions can target both `trends` and `products`.
- **Source Tracking**: Captures where the interaction originated (e.g., `FEED`, `SEARCH`, `PROFILE`).
- **Intelligence Fuel**: These events power the scoring engine, recommendation engine, and commerce analytics.

### 🔖 Dual-Target Saves

Users can bookmark both trends and products.
- **Save Architecture**: The `saves` table supports `trend_id` or `product_id`.
- **Validation**: Database-level constraints ensure exactly one target is set per save.
- **Analytics**: Saving a product contributes to its commerce intelligence, while saving a trend contributes to its discovery score.

### 👁️ View Tracking & Early Discovery

Views are explicitly tracked to support:
- **Early Discovery Rewards**: Identifying "early spotters" based on view timing relative to trend lifecycle.
- **Exposure Tracking**: Measuring how many users have seen a trend vs. interacted with it.
- **Momentum Tracking**: Real-time calculation of trend velocity.

---

## 📈 Trend Lifecycle & Phase History

The system tracks every lifecycle transition of a trend to power discovery detection and momentum analysis.

- **Trend Phase History**: Every time a trend's `phase` changes, a new row is created in `trend_phase_history`.
- **Fields**: `id`, `trend_id`, `old_phase`, `new_phase`, `changed_at`, `metadata`.
- **Purpose**:
  - **Early Discovery Detection**: Identifying exactly when a trend was spotted in its earliest stages.
  - **Lifecycle Analytics**: Measuring the duration of each phase (e.g., how long it takes to move from 'emerging' to 'peak').
  - **Trend Momentum**: Analyzing the velocity of phase transitions.

---

## 📑 Score Auditability & Events

User score changes are tracked in an append-only audit log to ensure transparency and debuggability.

- **Score Events**: The `score_events` table maintains a record of every point change.
- **Fields**: `id`, `user_id`, `points_delta`, `reason`, `source_type`, `source_id`, `created_at`.
- **Audit Reasons**:
  - `EARLY_DISCOVERY`: Rewards for being among the first to spot a trend.
  - `SAVE_BONUS`: Points earned when others save a trend you discovered.
  - `TREND_SPOTTED`: Base points for initial discovery.
  - `ADMIN_ADJUSTMENT`: Manual corrections or system bonuses.
- **Transparency**: Users can view their score history, and admins can replay events to debug score discrepancies.

---

## 📡 Ingestion Explainability & Signals

The scoring engine uses traceable signals to avoid "black box" behavior.

- **Trend Signals**: Raw ingestion and AI scoring signals are stored in `trend_signals`.
- **Fields**: `id`, `trend_id`, `source`, `signal_type`, `signal_value`, `metadata`, `created_at`.
- **Signal Types**: `velocity`, `saves`, `growth`, `momentum`.
- **Traceability**: Every score calculation can be traced back to the specific signals that triggered it (e.g., TikTok velocity spike, Instagram save momentum).

---

## 🎁 Reward Traceability & Discovery

The system provides specialized tracking for early discovery rewards.

- **Early Discovery Rewards**: Tracks specific bonuses awarded to early spotters.
- **Fields**: `id`, `user_id`, `trend_id`, `phase_at_discovery`, `bonus_points`, `reward_type`, `claimed`, `created_at`.
- **Lightweight Logic**: Supports basic reward claiming and tracking without overengineering the full gamification engine for MVP.

---

## 🛡️ Trust-Preserving Content Architecture

To maintain high platform trust, the system implements a strict "Trust Firewall" between organic discovery and paid placement.

### 🧱 Content Classification

Trends and products are explicitly flagged:
- **Content Type**: `ORGANIC` vs `SPONSORED`.
- **Authenticity**: Products include an `is_authentic` flag for verified/trusted items.
- **Sponsorship**: Products include an `is_sponsored` flag for paid placements.

*Note: Sponsorship and Authenticity are separate concepts; a product can be sponsored but not yet verified, or verified but organic.*

### 🔄 Lifecycle & Moderation

- **Trend Phases**: `emerging`, `rising`, `peak`, `fading`.
- **Lifecycle Tracking**: `phase_updated_at` tracks when a trend transitions between phases, critical for reward calculations.
- **Status Workflow**: Trends move through `DRAFT` → `PUBLISHED` → `ARCHIVED` (or `FLAGGED` for moderation).

---

## 🛍️ Commerce Attribution & Affiliate Intelligence

The architecture is designed for deep commerce integration and multi-touch attribution.

### 📈 Product Metadata

Products support rich commerce fields:
- **Merchant Name**: The retailer selling the product (e.g., "Amazon", "Farfetch").
- **Affiliate Network**: The platform managing the commission (e.g., "Impact", "Rakuten").
- **Commerce Metadata**: JSONB blob for storing affiliate tracking parameters, sub-IDs, and attribution data.

### 🔗 Clickout Attribution

Every clickout is captured with rich context:
- **Deduplication**: A 5-minute window deduplication strategy prevents inflated analytics.
- **Attribution Loop**: Clicks are linked to trends, products, campaigns, and creators.
- **Monetization Readiness**: This data prepares the system for reconciling affiliate callbacks and calculating revenue.

---

## 🏗️ System Architecture Flow

```
Flutter App
    ↓
NestJS APIs (Interaction Logging)
    ↓
Supabase PostgreSQL (Interactions, Saves, Trends, Products)
    ↓
Scoring Engine (Uses Interaction Velocity)
    ↓
Ranked Feed Response
```

---

## 📖 Swagger API Documentation

- **URL:** `http://localhost:3000/api`
- **Authentication:** Use the **"Authorize"** button with your JWT.
- **Interaction APIs**: `POST /interaction/interact`, `POST /interaction/save`, `POST /interaction/click`.
