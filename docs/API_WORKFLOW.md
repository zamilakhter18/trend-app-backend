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

## 🎁 Discount & Perk System

The system provides score-gated incentives and brand-linked partnerships.

- **Score-Gated Access**: Brands can issue `discount_codes` with a `min_score_required`. Users whose `trendScore` meets the threshold can unlock these perks.
- **Reward Links**: Early adopters who earn `early_discovery_rewards` may receive exclusive fixed-amount or percentage-based codes as part of their reward package.
- **Usage Tracking**: Each code tracks `max_uses` and `use_count` to ensure campaign budget integrity.
- **Administrative Control**: Codes include an `isActive` flag, allowing admins to instantly deactivate a code if a campaign ends early or a code leaks.
- **Affiliate Integration**: These codes are often linked to specific affiliate products, allowing for tracked conversion loops.

---

## 🚀 API Endpoint Specifications

### General Response Shape
All responses follow a standard envelope:
```json
{
  "statusCode": 200,
  "message": "Optional success/error message",
  "data": { ... }
}
```

### ❗ Error Handling
| Code | Meaning | Example Scenario |
|------|---------|------------------|
| 400 | Bad Request | Validation failure (missing fields). |
| 401 | Unauthorized | Token expired or invalid. |
| 403 | Forbidden | User lacks 'admin' role for restricted paths. |
| 404 | Not Found | Trend ID does not exist. |
| 422 | Unprocessable Entity | Logic failure (e.g., claiming a reward already claimed). |

---

### 1. Authentication (`/auth`)

#### `POST /auth/signup`
- **Auth**: Public
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "strongpassword",
  "username": "trendsetter99",
  "fullName": "John Doe",
  "avatarUrl": "Optional: string"
}
```
- **Response (201)**:
```json
{
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "user": { "userId": "uuid", "email": "...", "username": "trendsetter99", "role": "user" },
    "access_token": "supabase_jwt_string",
    "refresh_token": "supabase_refresh_string"
  }
}
```

#### `POST /auth/login`
- **Auth**: Public
- **Request Body**: `{ "email": "...", "password": "..." }`
- **Response (200)**:
```json
{
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": { "userId": "uuid", "username": "...", "role": "user" },
    "access_token": "jwt_string",
    "refresh_token": "refresh_string"
  }
}
```

#### `POST /auth/refresh`
- **Auth**: Public
- **Request Body**: `{ "refresh_token": "..." }`
- **Response (200)**: `{ "statusCode": 200, "data": { "access_token": "...", "refresh_token": "..." } }`

#### `POST /auth/logout`
- **Auth**: Optional/Public
- **Purpose**: Invalidate the current session and sign out.
- **Response (200)**: `{ "statusCode": 200, "message": "Logged out successfully" }`

---

### 2. Trends & Feed (`/feed`, `/trend`)

#### `GET /feed`
- **Auth**: Optional
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

#### `GET /trend/:id`
- **Auth**: Public
- **Response (200)**:
```json
{
  "statusCode": 200,
  "data": {
    "id": "uuid",
    "title": "Trend Title",
    "description": "...",
    "phase": "emerging",
    "products": [ { "id": "uuid", "name": "..." } ],
    "contents": [ { "contentUrl": "..." } ]
  }
}
```

---

### 3. Interactions & Bookmarks (`/interaction`, `/saves`)

#### `POST /interaction/interact`
- **Auth**: Optional
- **Request Body**: `{ "trend_id": "uuid", "interaction_type": "VIEW" }`
- **Response (200)**: `{ "statusCode": 200, "data": { "status": "interacted" } }`

#### `POST /interaction/save`
- **Auth**: Required
- **Request Body**: `{ "trend_id": "uuid" }` or `{ "product_id": "uuid" }`
- **Response (201)**: `{ "statusCode": 201, "data": { "status": "saved" } }`

#### `POST /interaction/click`
- **Auth**: Optional
- **Request Body**: `{ "product_id": "uuid", "trend_id": "uuid" }`
- **Response (201)**: `{ "statusCode": 201, "data": { "status": "tracked" } }`
- **Note**: Clickouts also track if and when a purchase was completed (`converted` and `convertedAt`), though this is typically updated via backend postback/webhook.

#### `GET /saves`
- **Auth**: Required
- **Response (200)**:
```json
{
  "statusCode": 200,
  "data": [
    { "id": "save-uuid", "trend": { "id": "...", "title": "..." }, "product": null }
  ]
}
```

#### `DELETE /saves/:id`
- **Auth**: Required
- **Purpose**: Remove a bookmark by its save entry ID.

---

### 4. Search (`/search`)

#### `GET /search`
- **Auth**: Public
- **Parameters**: `q` (query)
- **Response (200)**: `{ "statusCode": 200, "data": { "trends": [], "products": [] } }`

---

### 5. Identity & Profile (`/identity`)

#### `GET /identity/profile`
- **Auth**: Required
- **Response (200)**: `{ "statusCode": 200, "data": { "userId": "...", "username": "...", "fullName": "..." } }`

#### `PATCH /identity/profile`
- **Auth**: Required
- **Request Body**: `{ "username": "...", "fullName": "...", "avatarUrl": "..." }`
- **Response (200)**:
```json
{
  "statusCode": 200,
  "message": "Resource updated successfully",
  "data": { "userId": "uuid", "username": "trendsetter_new" }
}
```

#### `GET /identity/performance`
- **Auth**: Required
- **Response (200)**:
```json
{
  "statusCode": 200,
  "data": {
    "trendScore": 1250,
    "level": 13,
    "userBadges": [],
    "scoreEvents": []
  }
}
```

---

### 6. Rewards (`/rewards`)

#### `GET /rewards`
- **Auth**: Required
- **Purpose**: List all earned and pending discovery rewards.
- **Response (200)**: `{ "statusCode": 200, "data": [ { "id": "...", "rewardType": "...", "claimed": false } ] }`

#### `POST /rewards/claim/:rewardId`
- **Auth**: Required
- **Response (200)**: `{ "statusCode": 200, "message": "Reward claimed successfully" }`

---

### 7. Discounts & Perks (`/discounts`)

#### `GET /discounts`
- **Auth**: Public (Generic list)
- **Purpose**: List all active (`isActive: true`) discount codes and brand perks that have not expired.
- **Response (200)**:
```json
{
  "statusCode": 200,
  "message": "Data fetched successfully",
  "data": [
    {
      "id": "uuid",
      "code": "SAVE10",
      "discountType": "PERCENTAGE",
      "discountValue": 10,
      "brand": { "name": "Brand Name" }
    }
  ]
}
```

---

### 8. Admin Controls (`/admin`)

#### `POST /admin/trends`
- **Auth**: Admin
- **Request Body**:
```json
{
  "title": "Required: Trend Title",
  "description": "Optional: Text",
  "source": "Optional: e.g. tiktok",
  "externalId": "Optional: ID from source",
  "phase": "Optional: emerging | rising | peak | fading",
  "contentType": "Optional: ORGANIC | SPONSORED",
  "status": "Optional: DRAFT | PUBLISHED | ARCHIVED | FLAGGED"
}
```
- **Response (201)**: `{ "statusCode": 201, "data": { "id": "uuid", "title": "..." } }`

#### `PATCH /admin/trends/:id`
- **Auth**: Admin
- **Request Body**: Same fields as POST, all optional.
- **Response (200)**: `{ "statusCode": 200, "data": { "id": "uuid", "title": "..." } }`

#### `POST /admin/ingestion/run`
- **Auth**: Admin
- **Request Body**: `{ "platforms": ["tiktok"] }`

#### `GET /admin/score-events`
- **Auth**: Admin
- **Parameters**: `limit`, `offset`
- **Purpose**: Audit log of all score changes across the system.

---

## 🛡️ Rate Limiting & Abuse Protection

Spam prevention is critical for maintaining the integrity of trend intelligence metrics. The system implements protection across multiple layers:

### 1. Global Rate Limiting (Interaction Throttling)
- **Mechanism**: The API uses a global `ThrottlerGuard` (NestJS) to limit requests.
- **Default Limit**: 100 requests per minute per IP address.
- **Bot Prevention**: This prevents automated scripts from overwhelming the API or performing mass-data scraping.

### 2. View Inflation Protection
- **Deduplication**: `VIEW` and `SHARE` interactions are deduplicated at the application layer.
- **Window**: The system will only record one view/share per user (or IP, if anonymous) per trend/product within a **1-hour window**.
- **Impact**: Prevents "view-looping" bots from artificially inflating the momentum of a trend.

### 3. Click Spam Protection
- **Deduplication**: `CLICK` interactions are tracked in the `clickouts` table with a **5-minute deduplication window**.
- **Context**: Subsequent clicks on the same product by the same user/IP within 300 seconds are recorded in the database but flagged as duplicates and not counted toward scoring velocity.

### 4. Fake Save Protection
- **Constraint**: Each user can only have **one active save** per trend or product.
- **Logic**: Attempting to save an item that is already in the user's bookmark list will result in a "Success" response but will not create a redundant record or additional scoring boost.

### 5. Authentication Abuse
- **Supabase Auth**: Leveraging Supabase's built-in email rate limiting and CAPTCHA support (if enabled) for `/auth/signup` and `/auth/login`.
- **JWT Expiry**: Short-lived (15m) access tokens minimize the window of opportunity for intercepted tokens.

---

## 🔢 Pagination Patterns

The system uses two primary pagination strategies:

1. **Cursor-Based (Feed)**:
   - Used for the main `GET /feed`.
   - Uses a `nextCursor` (opaque string) to fetch the next page.
   - Ideal for frequently changing content to avoid duplicates.

2. **Offset-Based (Search, Admin Logs)**:
   - Used for `GET /search` and `/admin/score-events`.
   - Uses `limit` and `offset` parameters.
   - Ideal for structured logs and search results where deep paging is required.
