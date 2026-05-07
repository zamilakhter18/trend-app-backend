# Architectural Decisions & API Workflow Documentation

This document defines the high-level architecture, documented decisions (ADRs), and detailed API specifications for the Trend App Backend.

---

## 🏗️ Architectural Decision: NestJS Middleware Layer

**Decision:** The system utilizes a **NestJS (TypeScript)** application acting as a centralized middleware and API layer between the Flutter frontend and the Supabase/PostgreSQL database.

**Rationale:**
- **Centralized Business Logic**: Complex operations like the Trend Scoring Engine, Early Discovery Reward calculations, and multi-platform ingestion pipelines require a server-side runtime that can handle cron jobs and async tasks.
- **Security & RBAC**: NestJS provides a robust framework for Role-Based Access Control (RBAC) and JWT validation before requests reach the database.
- **Abstraction**: It abstracts Supabase-specific logic (like RLS) into a traditional service-oriented architecture, making the system easier to test and maintain.
- **API Documentation**: Automated Swagger documentation ensures frontend-backend alignment.

**Architecture Flow:**
`Flutter App` ↔ `NestJS API (Middleware)` ↔ `Supabase/PostgreSQL`

---

## 🔐 Security Model & RLS

While NestJS handles primary validation, the database layer is secured via:
1. **JWT Validation**: NestJS verifies Supabase-issued JWTs.
2. **Service Account Access**: NestJS connects to Supabase via a dedicated pooler with appropriate schema permissions.
3. **Internal RBAC**: Access to admin-only or creator-only endpoints is enforced via NestJS `RolesGuard`.

---

## 📊 Scoring Engine Trigger

The scoring engine is **Hybrid Triggered**:
- **Periodic Batch Update**: A background task (Cron) runs every **15 minutes** to recalculate scores for all `PUBLISHED` trends. This handles aggregate metrics like velocity and time-decay.
- **On-Demand (Future)**: Critical signals (e.g., massive spikes) can trigger immediate recalculation for specific trends.

---

## 🔗 5-Minute Click Deduplication

To prevent analytics inflation, clickouts are deduplicated at the **Application Layer**:
- **Mechanism**: Before saving a click, the system queries the `clickouts` table for an existing record with the same `productId` and (`userId` OR `ipHash`) created within the last 300 seconds.
- **Implementation**: Handled in `InteractionService.trackClick` using a non-blocking database check.

---

## 🚀 API Endpoint Specifications

### 1. Authentication (`/auth`)

#### `POST /auth/signup`
- **Auth**: Public
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "strongpassword",
  "username": "trendsetter99",
  "fullName": "John Doe"
}
```
- **Response (201)**:
```json
{
  "statusCode": 201,
  "data": {
    "user": { "userId": "uuid", "email": "..." },
    "access_token": "jwt_string",
    "refresh_token": "refresh_string"
  }
}
```

#### `POST /auth/login`
- **Auth**: Public
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "strongpassword"
}
```

---

### 2. Personalized Feed (`/feed`)

#### `GET /feed`
- **Auth**: Optional (Public access provides generic feed; Authenticated provides personalized)
- **Parameters**: `limit` (default 10), `cursor` (pagination)
- **Response (200)**:
```json
{
  "statusCode": 200,
  "data": {
    "data": [
      {
        "id": "trend-uuid",
        "title": "Minimalist Streetwear",
        "phase": "rising",
        "score": { "finalScore": 85.5 },
        "contents": [{ "contentUrl": "...", "contentType": "image" }]
      }
    ],
    "nextCursor": "base64_encoded_string"
  }
}
```

---

### 3. Interaction Log (`/interaction`)

#### `POST /interaction/interact`
- **Auth**: Optional (Tracked via IP for guests)
- **Request Body**:
```json
{
  "trend_id": "uuid",
  "interaction_type": "VIEW",
  "source_type": "ORGANIC_FEED"
}
```

#### `POST /interaction/save`
- **Auth**: Required
- **Request Body**: `{ "trend_id": "uuid" }` or `{ "product_id": "uuid" }`

#### `POST /interaction/click`
- **Auth**: Optional
- **Request Body**:
```json
{
  "product_id": "uuid",
  "trend_id": "uuid",
  "source_type": "SPONSORED_FEED",
  "session_id": "client_session_id"
}
```

---

### 4. Search (`/search`)

#### `GET /search`
- **Auth**: Public
- **Parameters**: `q` (query string)
- **Response (200)**:
```json
{
  "statusCode": 200,
  "data": {
    "trends": [ { "id": "uuid", "title": "..." } ],
    "products": [ { "id": "uuid", "name": "..." } ]
  }
}
```

---

### 5. Rewards (`/rewards`)

#### `POST /rewards/claim/:rewardId`
- **Auth**: Required
- **Purpose**: Marks an earned early discovery reward as claimed.
- **Response (200)**: `{ "statusCode": 200, "message": "Reward claimed successfully" }`

---

### 6. Identity & Rewards (`/identity`)

#### `GET /identity/performance`
- **Auth**: Required
- **Response (200)**:
```json
{
  "statusCode": 200,
  "data": {
    "userId": "uuid",
    "trendScore": 1250,
    "level": 13,
    "userBadges": [{ "badgeType": "EARLY_SPOTTER" }],
    "scoreEvents": [{ "pointsDelta": 10, "reason": "EARLY_DISCOVERY" }]
  }
}
```

---

### 7. Admin & Curation (`/admin`)

#### `POST /admin/ingestion/run`
- **Auth**: Admin Required
- **Request Body**: `{ "platforms": ["tiktok", "instagram"] }`
- **Purpose**: Manually triggers the Python ingestion pipeline.
