from fastapi import FastAPI
from fastapi import Depends
from fastapi import HTTPException

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

app.state.limiter = limiter

@app.get("/")
def root():
    return {
        "message": "API Running"
    }


@app.post("/transaction")
@limiter.limit("10/minute")
def create_transaction_endpoint(
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