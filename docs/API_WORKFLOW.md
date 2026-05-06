# API and User Work Cycle Documentation

This document outlines the interaction between users, the API endpoints, and the database for the Trend App.

---

## 🔐 Security & Authentication

The system uses a centralized **JWT-based Authentication** and **Role-Based Authorization (RBAC)** system.

- **Header:** `Authorization: Bearer <your_jwt_token>`
- **Token Source:** Obtained from `POST /auth/login` or `POST /auth/signup`.
- **User Roles:** `USER` (Default), `CREATOR`, `ADMIN`.
- **Integration:** All protected APIs are marked with `@ApiBearerAuth('JWT-auth')` for seamless Swagger UI testing.

### 📖 Swagger API Documentation

The project includes interactive API documentation powered by Swagger (OpenAPI).

- **URL:** `http://localhost:3000/api`
- **Authentication in Swagger:** 
  1. Click the **"Authorize"** button at the top of the Swagger UI.
  2. Enter your JWT token (e.g., `abc...xyz`).
  3. All protected endpoints (indicated by a lock icon) will now automatically include the token in their requests.
- **Security Scheme:** The API uses a named security scheme `JWT-auth` which corresponds to the `bearer` HTTP authentication scheme.
- **Schemas:** To keep the UI clean, the "Schemas" section at the bottom of the page is hidden by default.

### 🚀 Signup Flow Architecture

The signup process follows a multi-step sequence to ensure auth and profile synchronization:

1. **User Signup Request**: User submits email, password, username, etc.
2. **Supabase Auth**: Backend calls Supabase to create the user in the `auth.users` schema.
3. **Profile Creation**: Upon successful Supabase signup, the backend creates a corresponding entry in the `public.user_profile` table (sharing the same UUID).
4. **Token Generation**: Custom JWT Access and Refresh tokens are generated.
5. **Response**: Final payload includes user profile details and both tokens.

---

## ☁️ 9. Media Upload Architecture

The system uses Supabase Storage for direct client-side uploads to avoid server bandwidth costs and improve performance.

### ⬆️ Upload Flow

1. **Request URL**: Client app sends a `POST` request to `/upload/generate-url` with the desired bucket and file info.
2. **Generate URL**: NestJS validates the request and asks Supabase to generate a secure, temporary **signed upload URL**.
3. **Direct Upload**: The client app receives the signed URL and uploads the file directly to Supabase Storage.
4. **Send Public URL**: After a successful upload, the client sends the `public_url` (received in step 2) to the relevant API endpoint (e.g., `POST /trends` or `PATCH /profile/me`).
5. **Store URL**: NestJS stores the `public_url` string in the appropriate database table (`trends`, `user_profile`, etc.).

```text
Client App                   NestJS Backend               Supabase Storage
     │                            │                              │
     ├─ 1. POST /generate-url ───► │                              │
     │                            ├─ 2. Generate Signed URL ─────►
     │  ◄── 3. Return Signed URL ─┤                              │
     │                            │                              │
     ├─ 4. Upload File Directly ─────────────────────────────────►
     │                            │                              │
     ├─ 5. POST /trends (with URL)►│                              │
     │                            ├─ 6. Save URL to DB           │
     │                            │                              │
```

### 🔗 Upload APIs

- **Generate Upload URL:** `POST /upload/generate-url` (JWT Required)
- **Get Public URL:** `GET /upload/public-url/:bucket/:path` (Public)

---

## 👤 1. Guest / Unauthenticated User

Guests can browse the platform and view basic content without a token.

### 🔗 Public APIs

- **Register Account:** `POST /auth/signup`
- **Login Account:** `POST /auth/login`
- **Get Trend Feed:** `GET /feed`
- **Get Trend Details:** `GET /trend/:id`
- **List Trend Products:** `GET /product?trend_id=uuid`

---

...

## 🏗️ System Architecture Flow

Here is a high-level overview of the Trend App's system architecture, from the client application to the backend services.

### Core Architecture Diagram

```
Flutter App
    ↓
NestJS APIs
    ↓
Supabase PostgreSQL
    ↓
AI / Vision Services
    ↓
Scoring Engine
    ↓
Ranked Feed Response
```

### Explanation of Each Layer

#### A. Flutter App

- **Description**: The mobile client for iOS and Android, built with Flutter.
- **Handles**:
  - Authentication (signup, login, token management)
  - Media uploads to Supabase Storage
  - Rendering of the ranked trend feed
  - User engagement actions (likes, saves, clicks)

#### B. NestJS APIs

- **Description**: The central backend layer, built with NestJS (Node.js).
- **Handles**:
  - Secure authentication and Role-Based Access Control (RBAC)
  - Core business logic for all application features
  - Serving feed APIs to the Flutter app
  - Orchestration of the scoring engine and AI services
  - Data ingestion APIs for the Python scraper

#### C. Supabase PostgreSQL

- **Description**: The persistent relational database, powered by Supabase.
- **Stores**:
  - User profiles and authentication IDs (`user_profile`)
  - Trend data, including titles, descriptions, and media URLs (`trends`)
  - Products associated with trends (`products`)
  - User engagement metrics (likes, saves, views) (`engagements`)
  - AI-generated analysis and tags (`ai_analysis`)
  - Calculated trend scores (`trend_scores`)

#### D. AI / Vision Services

- **Description**: A suite of external and internal AI services for content enrichment.
- **APIs Used**:
  - External LLM APIs (e.g., OpenAI, Google AI) for text analysis
  - Vision classification APIs (e.g., Google Vision) for image analysis
- **Used For**:
  - Generating concise trend summaries
  - Performing sentiment analysis on trend content
  - Classifying images for safety and content moderation
  - Assigning visual categories and aesthetics (e.g., "minimalist", "vintage")

#### E. Scoring Engine

- **Description**: A cron-based ranking system that runs periodically to score and rank trends.
- **Calculates**:
  - **Engagement Velocity**: How quickly a trend is gaining likes and views.
  - **Save Rate**: The ratio of saves to impressions.
  - **Click-Through Rate (CTR)**: The effectiveness of associated product links.
  - **Time Decay**: Reduces the score of older trends to prioritize newness.
  - **Final Feed Score**: A weighted combination of the above metrics to produce a final ranking score.

---

### Data and Media Flows

#### Data Ingestion Flow

The system uses a Python scraper to import trends from external social platforms.

```
Python Scraper
      ↓
Ingestion APIs (POST /ingestion/social-import)
      ↓
NestJS Backend
      ↓
Supabase Database
```

#### Media Upload Flow

Media is uploaded directly from the client to Supabase Storage to optimize performance.

```
Flutter App
      ↓
Generate Signed Upload URL (POST /upload/generate-url)
      ↓
Supabase Storage
      ↓
Public Media URL is returned
      ↓
NestJS stores the public URL in the database
```

#### Authentication Flow

User authentication is managed by Supabase Auth, with JWTs used to protect API endpoints.

```
User Signup/Login
      ↓
Supabase Auth
      ↓
JWT + Refresh Token are returned to the client
      ↓
Client uses JWT to access protected APIs
```

---

## 🚦 Rate Limiting & API Protection

To protect the backend from abuse, spam, and excessive API usage, the system employs a rate limiting strategy. Throttling is applied to specific endpoints that are either resource-intensive or high-risk.

Rate limiting is especially applied on:

- Authentication APIs
- Ingestion APIs
- AI/Vision APIs
- Upload URL generation APIs

### Example Protected APIs

- `POST /auth/signup`
- `POST /auth/login`
- `POST /ingestion/social-import`
- `POST /ai/analyze-trend`
- `POST /upload/generate-url`

### Purpose of Rate Limiting

- **Prevent Brute-Force Attacks**: Limits login and signup attempts to block password guessing.
- **Avoid AI API Abuse**: Controls access to expensive AI and Vision services.
- **Reduce Spam Ingestion**: Prevents bad actors from flooding the database with spam trends.
- **Improve System Stability**: Ensures the backend remains responsive and available for all users.
- **Protect Backend Resources**: Conserves server CPU, memory, and bandwidth.

---

## ☁️ Why Supabase?

Supabase was chosen as the primary backend infrastructure layer because it offers a comprehensive suite of tools that accelerate development while providing a scalable and secure foundation.

### Core Supabase Features Used

- **PostgreSQL Database**: A powerful, open-source relational database for storing all application data.
- **Built-in Authentication**: Secure user management and authentication, including social logins and password resets.
- **Supabase Storage**: Scalable object storage for user-generated media like images and videos.
- **Scalable Cloud Infrastructure**: Managed infrastructure that grows with the application's needs.
- **Row Level Security (RLS)**: Fine-grained access control policies at the database level.
- **Realtime Capabilities**: The ability to listen for database changes in real-time.
- **Developer-Friendly APIs**: Auto-generated APIs and client libraries for easy integration.

### Architecture Benefits

- **Rapid Backend Development**: Supabase's built-in features significantly reduce the time required to build and deploy a secure backend.
- **Reduced Infrastructure Complexity**: By providing an integrated solution, Supabase eliminates the need to manage separate services for database, auth, and storage.
- **Secure Authentication System**: Leverages Supabase's robust and battle-tested authentication service.
- **Scalable Media Storage**: Supabase Storage provides a simple and scalable solution for handling large media files.
- **Simplified PostgreSQL Management**: Automatic backups, scaling, and maintenance of the PostgreSQL database.
