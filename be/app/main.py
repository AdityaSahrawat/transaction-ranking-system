from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

from sqlalchemy.orm import Session

from app.database import get_db
from app.schema import (
    TransactionCreate,
)
from app.services import (
    create_transaction,
    get_user_summary,
    get_ranking,
)

from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)


app = FastAPI(
    title="Transaction Ranking API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.get("/health")
def root():
    return {
        "message": "API Running"
    }


@app.post("/transaction")
@limiter.limit("10/minute")
def create_transaction_endpoint(
    request: Request,
    payload: TransactionCreate,
    db: Session = Depends(get_db),
):
    try:
        transaction = create_transaction(
            db=db,
            user_id=payload.user_id,
            transaction_id=payload.transaction_id,
            amount=payload.amount,
        )

        return {
            "success": True,
            "transaction_id":
            transaction.transaction_id,
        }

    except ValueError as e:
        raise HTTPException(
            status_code=409,
            detail=str(e),
        )


@app.get("/summary/{user_id}")
def get_summary(
    user_id: str,
    db: Session = Depends(get_db),
):
    summary = get_user_summary(
        db,
        user_id,
    )

    if not summary:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return summary


@app.get("/ranking")
def ranking(
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db),
):
    return get_ranking(
        db,
        page,
        limit,
    )