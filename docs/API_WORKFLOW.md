# API and User Work Cycle Documentation

This document outlines the interaction between users, the API endpoints, and the database for the Trend App.

---

## 🔐 Security & Authentication
The system uses a centralized **JWT-based Authentication** and **Role-Based Authorization (RBAC)** system.

- **Header:** `Authorization: Bearer <your_jwt_token>`
- **Token Source:** Obtained from `POST /auth/login` or `POST /auth/signup`.
- **User Roles:** `USER` (Default), `CREATOR`, `ADMIN`.

---

## 👤 1. Guest / Unauthenticated User
Guests can browse the platform and view basic content without a token.

### 🔗 Public APIs
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
1. **Login:** Obtain JWT.
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

## 💼 3. Creator (`CREATOR` Role)
Users who manage product integrations for trends.

### 🔗 Secured APIs (JWT + Role Required)
- **Create Product:** `POST /product`
- **Update Product:** `PATCH /product/:id`
- **Delete Product:** `DELETE /product/:id`

---

## 👑 4. Administrator (`ADMIN` Role)
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

#### **403 Forbidden** (Insufficient Role or Invalid User)
```json
{
  "statusCode": 403,
  "message": "Unauthorized role"
}
```

#### **400 Bad Request** (Validation Error)
```json
{
  "statusCode": 400,
  "message": ["email must be an email"],
  "error": "Bad Request"
}
```

---

## ⚙️ System Background Processes (Cron)
- **Global Score Update:** 
  - **Frequency:** Every hour (currently 1 min for testing).
  - **Action:** Recalculates trend velocity and engagement metrics in `trend_scores` table.
