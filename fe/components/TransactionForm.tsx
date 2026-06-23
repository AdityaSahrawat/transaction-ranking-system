"use client";

import React, { useState } from "react";
import { createTransaction } from "../services/api";

interface TransactionFormProps {
  onSuccess: () => void;
}

export default function TransactionForm({ onSuccess }: TransactionFormProps) {
  const [userId, setUserId] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim() || !transactionId.trim() || !amount.trim()) {
      setMessage({ text: "All fields are required", type: "error" });
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setMessage({ text: "Amount must be a positive number", type: "error" });
      return;
    }

    setLoading(true);
    setMessage(null);

    const res = await createTransaction({
      user_id: userId.trim(),
      transaction_id: transactionId.trim(),
      amount: numAmount,
    });

    setLoading(false);
    if (res.success) {
      setMessage({
        text: `Transaction submitted successfully! ID: ${res.message}`,
        type: "success",
      });
      setTransactionId("");
      setAmount("");
      onSuccess();
    } else {
      let errText = res.message || "Failed to submit transaction";
      if (res.status === 409) {
        errText = "409 Duplicate transaction";
      } else if (res.status === 429) {
        errText = "429 Too Many Requests";
      }
      setMessage({ text: errText, type: "error" });
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <h2 className="text-xl font-semibold text-white mb-4">Create Transaction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="user_id" className="block text-sm font-medium text-slate-300 mb-1">
            User ID
          </label>
          <input
            id="user_id"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="e.g. user1"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <div>
          <label htmlFor="transaction_id" className="block text-sm font-medium text-slate-300 mb-1">
            Transaction ID
          </label>
          <input
            id="transaction_id"
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="e.g. txn_001"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-slate-300 mb-1">
            Amount ($)
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 500"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 text-white font-medium py-2.5 px-4 rounded-xl transition-all shadow-lg hover:shadow-emerald-950 cursor-pointer"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 p-4 rounded-xl text-sm border font-medium ${
            message.type === "success"
              ? "bg-emerald-950/40 text-emerald-300 border-emerald-800"
              : "bg-rose-950/40 text-rose-300 border-rose-800"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
