from decimal import Decimal

from sqlalchemy import func
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models import User, Transaction
from app.ranking import calculate_score


def create_transaction(
    db: Session,
    user_id: str,
    transaction_id: str,
    amount: Decimal,
):
    user = (
        db.query(User)
        .filter(User.user_id == user_id)
        .first()
    )

    if not user:
        user = User(user_id=user_id)
        db.add(user)
        db.flush()

    transaction = Transaction(
        transaction_id=transaction_id,
        amount=amount,
        user_id=user.id,
    )

    try:
        db.add(transaction)
        db.commit()

    except IntegrityError:
        db.rollback()
        raise ValueError(
            "Duplicate transaction_id"
        )

    db.refresh(transaction)

    return transaction


def get_user_summary(
    db: Session,
    user_id: str,
):
    user = (
        db.query(User)
        .filter(User.user_id == user_id)
        .first()
    )

    if not user:
        return None

    total_transactions = (
        db.query(func.count(Transaction.id))
        .filter(Transaction.user_id == user.id)
        .scalar()
    )

    total_amount = (
        db.query(func.coalesce(
            func.sum(Transaction.amount),
            0
        ))
        .filter(Transaction.user_id == user.id)
        .scalar()
    )

    average_amount = (
        total_amount / total_transactions
        if total_transactions
        else 0
    )

    return {
        "user_id": user.user_id,
        "total_transactions": total_transactions,
        "total_amount": total_amount,
        "average_amount": round(
            average_amount,
            2
        ),
    }


def get_ranking(
    db: Session,
    page: int = 1,
    limit: int = 10,
):
    users = db.query(User).all()

    leaderboard = []

    for user in users:

        total_transactions = (
            db.query(func.count(Transaction.id))
            .filter(
                Transaction.user_id == user.id
            )
            .scalar()
        )

        total_amount = (
            db.query(
                func.coalesce(
                    func.sum(Transaction.amount),
                    0
                )
            )
            .filter(
                Transaction.user_id == user.id
            )
            .scalar()
        )

        score = calculate_score(
            float(total_amount),
            total_transactions,
        )

        leaderboard.append(
            {
                "user_id": user.user_id,
                "score": score,
            }
        )

    leaderboard.sort(
        key=lambda x: x["score"],
        reverse=True,
    )

    result = []

    for idx, user in enumerate(
        leaderboard,
        start=1,
    ):
        result.append(
            {
                "rank": idx,
                **user,
            }
        )

    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    return result[start_idx:end_idx]