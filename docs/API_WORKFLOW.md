# API and User Work Cycle Documentation

This document outlines the interaction between users, the API endpoints, and the database for the Trend App.

---

## 🔐 Security & Authentication
All endpoints (except Public Auth) require a valid **JSON Web Token (JWT)**.
- **Header:** `Authorization: Bearer <your_jwt_token>`
- **Token Source:** Obtained from the `POST /auth/login` or `POST /auth/signup` response.

---

## 👤 1. Authenticated User (Consumer / Curator)
Registered users can browse trends, engage with content, and track performance.

### Work Cycle
1. **Login:** Obtain JWT token.
2. **View Feed:** Load personalized global trend feed using JWT.
3. **Engage:** Like, comment, or share trends.
4. **Save:** Bookmark trends for later.

### 🔗 APIs

#### **Get Trend Feed**
- **Endpoint:** `GET /feed`
- **Security:** `Bearer Auth Required`
- **Action:** Fetches trending topics ordered by score.
- **Success Response:**
```json
{
  "statusCode": 200,
  "message": "Data fetched successfully",
  "data": [{ "id": "uuid", "title": "AI Gadgets", "score": 105.5 }]
}
```

#### **Engage with a Trend**
- **Endpoint:** `POST /engagement/engage`
- **Security:** `Bearer Auth Required`
- **Payload:**
```json
{
  "trend_id": "550e8400-e29b-41d4-a716-446655440000",
  "type": "like", 
  "content": "This is amazing!" 
}
```

---

## 💼 2. Creator / Affiliate Marketer
Users who actively add products to trends to monetize traffic.

### 🔗 APIs

#### **Create Product Integration**
- **Endpoint:** `POST /product`
- **Security:** `Bearer Auth Required`
- **Payload:**
```json
{
  "trend_id": "uuid",
  "name": "Eco-friendly Bottle",
  "affiliate_url": "https://amazon.com/example",
  "price": 19.99
}
```

---

## ⚠️ Error Response Examples

The following error formats are consistent across all APIs:

#### **401 Unauthorized** (Missing or Invalid Token)
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

#### **400 Bad Request** (Validation Error)
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

#### **404 Not Found** (Resource Missing)
```json
{
  "statusCode": 404,
  "message": "Resource not found"
}
```

#### **500 Internal Server Error**
```json
{
  "statusCode": 500,
  "message": "Something went wrong"
}
```

---

## ⚙️ System Background Processes (Cron)
- **Global Score Update:** 
  - **Frequency:** Every hour (currently 1 min for testing).
  - **Action:** Recalculates trend velocity and engagement metrics in `trend_scores` table.
