# API and User Work Cycle Documentation

This document outlines the interaction between users, the API endpoints, and the database for the Trend App.

---

## 🔐 Security & Authentication

The system uses a centralized **JWT-based Authentication** and **Role-Based Authorization (RBAC)** system.

- **Header:** `Authorization: Bearer <your_jwt_token>`
- **Token Source:** Obtained from `POST /auth/login` or `POST /auth/signup`.
- **User Roles:** `USER` (Default), `CREATOR`, `ADMIN`.

### 🚀 Signup Flow Architecture

The signup process follows a multi-step sequence to ensure auth and profile synchronization:

1. **User Signup Request**: User submits email, password, username, etc.
2. **Supabase Auth**: Backend calls Supabase to create the user in the `auth.users` schema.
3. **Profile Creation**: Upon successful Supabase signup, the backend creates a corresponding entry in the `public.user_profile` table (sharing the same UUID).
4. **Token Generation**: Custom JWT Access and Refresh tokens are generated.
5. **Response**: Final payload includes user profile details and both tokens.

```text
User Request
    ↓
Supabase Auth (auth.users)
    ↓
Backend Profile (public.user_profile)
    ↓
JWT Sign (Access + Refresh)
    ↓
Success Response
```

---

## 👤 1. Guest / Unauthenticated User

Guests can browse the platform and view basic content without a token.

### 🔗 Public APIs

- **Register Account:** `POST /auth/signup`
- **Login Account:** `POST /auth/login`
- **Get Trend Feed:** `GET /feed`
- **Get Trend Details:** `GET /trend/:id`
- **Get Trend Explanation (AI):** `GET /trend/:id/explanation`
- **List Trend Products:** `GET /product?trend_id=uuid`
- **Get Product Details:** `GET /product/:id`
- **Health Check:** `GET /`

---

## 🛡️ 2. Authenticated User (`USER` Role)

Registered users who can engage with content and track their own performance.

### Work Cycle

1. **Login:** Obtain JWT Access & Refresh tokens.
2. **Engage:** Like, comment, or share trends.
3. **Save:** bookmark trends.
4. **Track:** View personal performance metrics.

### 🔗 Secured APIs (JWT Required)

- **Log Engagement:** `POST /engagement/engage`
- **Save Trend:** `POST /engagement/save`
- **Remove Saved Trend:** `DELETE /engagement/save/:trend_id`
- **Track Product Click:** `POST /engagement/click`
- **Get My Profile:** `GET /profile/me`
- **Get My Performance:** `GET /identity/performance`
- **Get Leaderboard:** `GET /identity/leaderboard` (Also accessible to guests via @Public, but tracks user context if provided)

---

## 🔄 3. Token Refresh Flow

Access tokens have a short lifespan (15m). Use the refresh token (7d) to obtain new credentials without re-logging.

### 🔗 Refresh API

- **Refresh Token:** `POST /auth/refresh-token`
- **Security:** `@Public` (Request body carries the credential)
- **Payload:**

```json
{
  "refresh_token": "your_long_lived_refresh_token"
}
```

---

## 💼 4. Creator (`CREATOR` Role)

Users who manage product integrations for trends.

### 🔗 Secured APIs (JWT + Role Required)

- **Create Product:** `POST /product`
- **Update Product:** `PATCH /product/:id`
- **Delete Product:** `DELETE /product/:id`

---

## 👑 5. Administrator (`ADMIN` Role)

Users with elevated permissions to manage the platform.

### 🔗 Secured APIs (JWT + Admin Role Required)

- **Get Admin Statistics:** `GET /identity/admin-stats`

---

## ⚠️ Error Response Examples

#### **401 Unauthorized** (Missing or Invalid Token)

```json
{
  "statusCode": 401,
  "message": "Token missing"
}
```

#### **403 Forbidden** (Insufficient Role or Invalid Refresh Token)

```json
{
  "statusCode": 403,
  "message": "Unauthorized role"
}
```

#### **409 Conflict** (Username/Email Already Exists)

```json
{
  "statusCode": 400,
  "message": "Username already taken"
}
```

---

## ⚙️ 6. Data Ingestion Architecture

The system receives automated trend data from external Python scraping pipelines.

### 🐍 Python Pipeline Integration

1. **Python Scraper**: Extracts trends from social media (Instagram, TikTok, etc.).
2. **Data Submission**: Scraper sends POST request to `/ingestion/social-import` with an internal API token.
3. **Validation**: NestJS validates the `x-ingestion-token`.
4. **Persistence**: Backend saves data across `trends`, `trend_metadata`, and `trend_scores` tables.

#### 🔗 Ingestion API

- **Social Import:** `POST /ingestion/social-import`
- **Security:** `x-ingestion-token` Header (Internal)
- **Action:** Batch or single trend insertion.

### 🛠️ Admin Control

Administrators can manually trigger the ingestion process.

- **Trigger Pipeline:** `POST /admin/ingestion/run`
- **Security:** `Bearer Auth` + `ADMIN` Role.

---

## ⚙️ 7. Trend Ranking & Scoring Engine

The backend implements an intelligent ranking system to ensure the most relevant and viral content surfaces at the top of the feed.

### 🧮 Scoring Formula

The `final_score` for each trend is calculated hourly via a global cron job using the following metrics:

1. **Engagement Velocity (50%)**: Measures how fast users are interacting with the trend in the last 24 hours.
2. **Save Rate (30%)**: Ratio of saves to total interactions, indicating long-term interest.
3. **Click-Through Rate (20%)**: Measures affiliate product interest relative to trend engagement.
4. **Time Decay (Penalty)**: Older trends naturally lose visibility over time using a gravity-based decay formula: `Score / (age + 2)^1.8`.

```text
User Engagement
    ↓
(Likes, Comments, Saves, Clicks)
    ↓
Scoring Engine (Cron)
    ↓
Recalculate Final Score
    ↓
GET /feed (Ranked by final_score DESC)
```

---

## ⚙️ 8. Sponsored Content Management
Administrators can promote specific trends through sponsored campaigns, which are then intelligently injected into the global feed.

### 💰 Promotion Flow
1. **Campaign Creation**: Admin creates a campaign via `POST /sponsored-content`.
2. **Priority Weighting**: Campaign is assigned a `priority_score` (0-100).
3. **Feed Injection**: The `FeedService` fetches active campaigns and merges them into the regular trend list (e.g., every 5th item).
4. **Visibility Rules**: Sponsored items are only injected if they are within their `start_date` and `end_date`.

#### 🔗 Management APIs
- **Create Campaign:** `POST /sponsored-content`
- **Get Sponsored Feed:** `GET /sponsored-content/feed`
- **Update Campaign:** `PATCH /sponsored-content/:trend_id`
- **Delete Campaign:** `DELETE /sponsored-content/:trend_id`
- **Security:** `Bearer Auth` + `ADMIN` Role required for all mutations.

---

## ⚙️ System Background Processes (Cron)

- **Global Score Update:**
  - **Frequency:** Every hour.
  - **Action:** Runs the ranking algorithm across all active trends and updates `trend_scores`.
  - **Metrics Updated:** `velocity`, `save_rate_score`, `ctr_score`, `final_score`.
