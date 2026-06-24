# Transaction Ranking System

A backend and frontend application that tracks user transactions, provides user summaries, and maintains a fair leaderboard based on multiple ranking factors.

---

## Live Demo

Frontend: `<Frontend URL>`

Backend API Docs: `<Backend URL>/docs`

---

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

## Architecture

```text
Next.js Frontend
        ↓
FastAPI REST API
        ↓
Service Layer
        ↓
SQLAlchemy ORM
        ↓
PostgreSQL
```

---

## Features

### Transaction Processing

* Create transactions through REST API.
* Automatic user creation on first transaction.
* Input validation using Pydantic.
* Duplicate transaction prevention.
* Safe handling of concurrent requests.

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

The application uses PostgreSQL transactions and database-level constraints to ensure consistency during concurrent requests.

For duplicate prevention, the `transaction_id` column has a UNIQUE constraint. If multiple requests attempt to create the same transaction simultaneously, PostgreSQL guarantees that only one succeeds.

Database transactions ensure that transaction creation and related updates are applied atomically.

---

## API Endpoints

### POST /transaction

Creates a new transaction.

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

Returns transaction statistics for a specific user.

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

Returns the leaderboard.

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

The ranking score is calculated using two factors:

1. Total transaction amount
2. Number of transactions

Formula:

```text
score =
(log(totalAmount + 1) × 70)
+
(min(transactionCount, 50) × 0.6)
```

### Why this approach?

* Prevents one extremely large transaction from dominating rankings.
* Prevents users from creating thousands of tiny transactions to manipulate rankings.
* Rewards both activity and value.
* Encourages balanced user participation.

---

## Duplicate Request Prevention

Each transaction contains a unique `transaction_id`.

Database Constraint:

```sql
transaction_id UNIQUE
```

If the same transaction is submitted more than once, PostgreSQL rejects the duplicate and the API returns an error.

This ensures idempotent transaction processing and protects against accidental retries.

---

## Abuse Prevention

### Rate Limiting

The API uses SlowAPI to limit excessive requests.

Examples:

* POST `/transaction` → limited requests per minute
* GET `/ranking` → limited requests per minute

This helps prevent:

* Spam submissions
* Automated abuse
* Leaderboard manipulation attempts

---

## Status Codes

| Status Code | Description           |
| ----------- | --------------------- |
| 200         | Successful request    |
| 201         | Transaction created   |
| 400         | Invalid request       |
| 404         | User not found        |
| 409         | Duplicate transaction |
| 429         | Rate limit exceeded   |
| 500         | Internal server error |

---

## Assumptions

* Users are created automatically when their first transaction is received.
* Authentication and authorization are outside the scope of this assignment.
* Transaction IDs are globally unique.
* Ranking scores are calculated dynamically when the ranking endpoint is requested.
* The application is designed for assignment-scale workloads.

---

## Running Locally

### Backend

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure environment variables:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/transactions_db
```

Run migrations:

```bash
alembic upgrade head
```

Start the server:

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://localhost:8000
```

Swagger Documentation:

```text
http://localhost:8000/docs
```

---

### Frontend

Install dependencies:

```bash
npm install
```

Configure environment variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Run the application:

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
* Suitable for assignment-scale workloads but can be optimized further for larger datasets.
* No authentication layer has been implemented as it was outside the assignment scope.

---

## Future Improvements

* Authentication and authorization
* Redis caching
* Background ranking computation
* Audit logs
* Docker deployment
* CI/CD pipeline
* Precomputed leaderboard tables for large-scale systems
* Real-time leaderboard updates

---

## Video Walkthrough

The accompanying video demonstrates:

1. Creating transactions
2. Duplicate transaction prevention
3. User summary retrieval
4. Leaderboard generation
5. Pagination
6. Rate limiting behavior
7. Explanation of ranking fairness and concurrency handling
