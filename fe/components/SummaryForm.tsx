"use client";

import React, { useState } from "react";
import { getSummary, UserSummary } from "../services/api";

interface SummaryFormProps {
  onFetched: (summary: UserSummary | null) => void;
}

export default function SummaryForm({ onFetched }: SummaryFormProps) {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) {
      setError("User ID is required");
      return;
    }

    setLoading(true);
    setError(null);
    onFetched(null);

    const res = await getSummary(userId.trim());
    setLoading(false);

    if (res.success && res.data) {
      onFetched(res.data);
    } else {
      setError(res.message || "User not found");
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between h-full min-h-[220px]">
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">User Summary Lookup</h2>
        <form onSubmit={handleFetch} className="space-y-4">
          <div>
            <label htmlFor="summary_user_id" className="block text-sm font-medium text-slate-300 mb-1">
              User ID
            </label>
            <div className="flex gap-2">
              <input
                id="summary_user_id"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="e.g. user1"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-slate-800 hover:bg-slate-700 active:bg-slate-900 disabled:opacity-50 text-white font-medium px-4 rounded-xl transition-all border border-slate-700 cursor-pointer text-sm whitespace-nowrap"
              >
                {loading ? "Fetching..." : "Get Summary"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-xl text-sm border font-medium bg-rose-950/40 text-rose-300 border-rose-800">
          {error}
        </div>
      )}
    </div>
  );
}
