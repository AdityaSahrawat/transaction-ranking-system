# Transaction Ranking System

A backend and frontend application that tracks user transactions, provides user summaries, and maintains a fair leaderboard based on multiple ranking factors.

## Tech Stack

### Backend

* FastAPI
* PostgreSQL
* SQLAlchemy
* Pydantic
* Alembic
* SlowAPI (Rate Limiting)

### Frontend

* Next.js
* TypeScript
* Tailwind CSS

---

## Features

### Transaction Processing

* Create transactions through REST API.
* Automatic user creation on first transaction.
* Input validation using Pydantic.
* Duplicate transaction prevention.

### User Summary

Retrieve:

* Total transactions
* Total amount
* Average transaction amount

### Ranking System

Leaderboard ranking is calculated using:

* Total transaction volume
* Number of transactions

The ranking formula is designed to reduce manipulation by balancing both factors.

### Abuse Prevention

* Duplicate transaction IDs are rejected.
* API rate limiting prevents excessive requests.
* Transaction counts are capped in the ranking formula to avoid leaderboard gaming.

### Concurrency Safety

The application relies on PostgreSQL transactional guarantees and unique database constraints to ensure data consistency during simultaneous requests.

---

## API Endpoints

### POST /transaction

Create a transaction.

Request:

```json
{
  "user_id": "user123",
  "transaction_id": "txn_001",
  "amount": 500.50
}
```

Success Response:

```json
{
  "success": true,
  "transaction_id": "txn_001"
}
```

Possible Errors:

* Invalid request body
* Duplicate transaction ID
* Rate limit exceeded

---

### GET /summary/{user_id}

Returns user statistics.

Example Response:

```json
{
  "user_id": "user123",
  "total_transactions": 3,
  "total_amount": 1500.50,
  "average_amount": 500.17
}
```

---

### GET /ranking

Query Parameters:

```text
page
limit
```

Example:

```http
GET /ranking?page=1&limit=10
```

Response:

```json
{
  "page": 1,
  "limit": 10,
  "total_users": 25,
  "data": [
    {
      "rank": 1,
      "user_id": "user123",
      "score": 89.4
    }
  ]
}
```

---

## Ranking Logic

Score calculation uses two factors:

1. Total transaction amount
2. Number of transactions

Example:

score =
(log(totalAmount + 1) × 70)
+
(min(transactionCount, 50) × 0.6)

Why this approach?

* Prevents one extremely large transaction from dominating rankings.
* Prevents users from creating thousands of tiny transactions to manipulate rankings.
* Rewards both activity and value.

---

## Duplicate Request Prevention

Each transaction contains a unique transaction_id.

Database Constraint:

* transactions.transaction_id is UNIQUE

If the same transaction is submitted more than once, PostgreSQL rejects the duplicate and the API returns an error.

This ensures idempotent transaction processing.

---

## Running Locally

### Backend

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/transactions_db
```

Run migrations:

```bash
alembic upgrade head
```

Start server:

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://localhost:8000
```

Swagger Docs:

```text
http://localhost:8000/docs
```

---

### Frontend

Install dependencies:

```bash
npm install
```

Configure:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Run:

```bash
npm run dev
```

Frontend:

```text
http://localhost:3000
```

---

## Trade-offs and Limitations

* Ranking scores are calculated dynamically rather than cached.
* Leaderboard sorting is currently performed in application memory.
* Suitable for assignment-scale workloads but can be optimized with precomputed ranking tables for large datasets.

---

## Future Improvements

* Authentication and authorization
* Redis caching
* Background ranking computation
* Audit logs
* Docker deployment
* CI/CD pipeline
