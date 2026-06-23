from decimal import Decimal
from pydantic import BaseModel, Field


class TransactionCreate(BaseModel):
    user_id: str = Field(..., min_length=1, max_length=100)
    transaction_id: str = Field(..., min_length=1, max_length=100)
    amount: Decimal = Field(..., gt=0)


class UserSummary(BaseModel):
    user_id: str
    total_transactions: int
    total_amount: Decimal
    average_amount: Decimal


class RankingResponse(BaseModel):
    rank: int
    user_id: str
    score: float