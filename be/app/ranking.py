import math


def calculate_score(
    total_amount: float,
    total_transactions: int,
) -> float:
    """
    Fair ranking score.

    Uses:
    - transaction volume
    - transaction frequency

    Prevents abuse by:
    - logarithmic scaling on amount
    - capped transaction contribution
    """

    amount_score = math.log1p(total_amount) * 70

    transaction_score = min(
        total_transactions,
        50
    ) * 0.6

    return round(
        amount_score + transaction_score,
        2
    )