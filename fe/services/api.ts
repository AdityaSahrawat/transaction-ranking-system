const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface CreateTransactionPayload {
  user_id: string;
  transaction_id: string;
  amount: number;
}

export interface UserSummary {
  user_id: string;
  total_transactions: number;
  total_amount: number;
  average_amount: number;
}

export interface RankingItem {
  rank: number;
  user_id: string;
  score: number;
}

export async function createTransaction(payload: CreateTransactionPayload): Promise<{ success: boolean; status?: number; message?: string }> {
  try {
    const res = await fetch(`${API_URL}/transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        amount: Number(payload.amount),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return { success: true, message: data.transaction_id };
    }

    const status = res.status;
    let message = "An unexpected error occurred";
    try {
      const errData = await res.json();
      message = errData.detail || message;
    } catch {
      if (status === 429) {
        message = "Rate limit exceeded. Too many requests.";
      }
    }

    return { success: false, status, message };
  } catch (error: any) {
    return { success: false, message: error.message || "Connection failure" };
  }
}

export async function getSummary(userId: string): Promise<{ success: boolean; data?: UserSummary; status?: number; message?: string }> {
  try {
    const res = await fetch(`${API_URL}/summary/${encodeURIComponent(userId)}`);
    if (res.ok) {
      const data = await res.json();
      return { success: true, data };
    }

    const status = res.status;
    let message = "Could not fetch summary";
    try {
      const errData = await res.json();
      message = errData.detail || message;
    } catch {}
    
    return { success: false, status, message };
  } catch (error: any) {
    return { success: false, message: error.message || "Connection failure" };
  }
}

export async function getRanking(page: number, limit: number): Promise<{ success: boolean; data?: RankingItem[]; status?: number; message?: string }> {
  try {
    const res = await fetch(`${API_URL}/ranking?page=${page}&limit=${limit}`);
    if (res.ok) {
      const data = await res.json();
      return { success: true, data };
    }

    const status = res.status;
    let message = "Could not fetch ranking";
    try {
      const errData = await res.json();
      message = errData.detail || message;
    } catch {}

    return { success: false, status, message };
  } catch (error: any) {
    return { success: false, message: error.message || "Connection failure" };
  }
}
