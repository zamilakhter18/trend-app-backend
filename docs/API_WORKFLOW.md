# API and User Work Cycle Documentation

This document outlines the interaction between users, the API endpoints, and the database for the Trend App.

---

## 👤 1. Guest / Unauthenticated User
Guests can browse the platform, view trends, and see leaderboards without logging in.

### Work Cycle
1. **View Feed:** Opens the app and loads the global trend feed.
2. **View Trend:** Clicks on a specific trend to see details and AI explanations.
3. **View Products:** Checks products associated with a trend.
4. **View Leaderboard:** Checks top-performing creators/curators.

### 🔗 APIs

#### **Get Trend Feed**
- **Endpoint:** `GET /feed`
- **Action:** Fetches trending topics ordered by score (cached).
- **DB Reflection:** Queries `trends` table joined with `trend_scores`.
- **Response Example:**
```json
{
  "statusCode": 200,
  "message": "Data fetched successfully",
  "data": [{ "id": "uuid", "title": "AI Gadgets", "score": 105.5 }]
}
```

#### **Get Trend Details & AI Explanation**
- **Endpoints:** 
  - `GET /trend/:id` (Details)
  - `GET /trend/:id/explanation` (AI Summary)
- **DB Reflection:** Queries `trends`, `trend_metadata`, and `ai_analysis` tables.

#### **View Products for a Trend**
- **Endpoint:** `GET /product?trend_id=uuid`
- **DB Reflection:** Queries the `products` table where `trend_id` matches.

---

## 🛡️ 2. Registered User (Consumer / Curator)
Users who have signed up. They can engage with content, save trends, and track their reputation.

### Work Cycle
1. **Onboarding:** Sign up and Login.
2. **Engagement:** Like, comment, or share a trend on their feed.
3. **Save:** Bookmark a trend for later.
4. **Identity Tracking:** Check their own "Trust Score" and performance metrics.

### 🔗 APIs

#### **Authentication (Signup / Login)**
- **Endpoints:** `POST /auth/signup` & `POST /auth/login`
- **DB Reflection:** Creates a new user in Supabase Auth and a corresponding row in the `user_profile` table.
- **Payload (Signup):**
```json
{
  "email": "user@example.com",
  "password": "securePass123",
  "username": "trendsetter99",
  "full_name": "John Doe"
}
```

#### **Engage with a Trend (Requires Auth)**
- **Endpoint:** `POST /engagement/engage`
- **DB Reflection:** Inserts a row into the `engagements` table. This triggers a score update for the trend.
- **Payload:**
```json
{
  "trend_id": "uuid",
  "type": "like", 
  "content": "This is amazing!" 
}
```

#### **Save a Trend (Requires Auth)**
- **Endpoint:** `POST /engagement/save`
- **DB Reflection:** Inserts a row into the `saves` table.

---

## 💼 3. Creator / Affiliate Marketer
Users who actively add products to trends to monetize traffic.

### Work Cycle
1. Finds an emerging trend.
2. Creates a related product integration with an affiliate URL.
3. Manages (Updates/Deletes) their product listings.

### 🔗 APIs

#### **Create Product Integration (Requires Auth)**
- **Endpoint:** `POST /product`
- **DB Reflection:** Inserts a row into the `products` table.
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

## ⚙️ System Background Processes (Cron)
- **Global Score Update:** 
  - **Frequency:** Every hour (currently 1 min for testing).
  - **Action:** Recalculates trend velocity and engagement metrics.
  - **DB Reflection:** Updates `trend_scores` table.
