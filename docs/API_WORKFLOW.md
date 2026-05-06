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
