import React from "react";
import { UserSummary } from "../services/api";

interface SummaryCardProps {
  summary: UserSummary | null;
}

export default function SummaryCard({ summary }: SummaryCardProps) {
  if (!summary) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-full flex flex-col justify-center items-center text-center text-slate-500 min-h-[220px]">
        <p className="text-sm">Enter a User ID and click Get Summary to view transaction statistics.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-full flex flex-col justify-between min-h-[220px]">
      <div>
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
          User Summary: <span className="text-white normal-case font-bold">{summary.user_id}</span>
        </h3>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <p className="text-xs text-slate-400 font-medium mb-1">Total Txns</p>
          <p className="text-2xl font-bold text-emerald-400">{summary.total_transactions}</p>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <p className="text-xs text-slate-400 font-medium mb-1">Total Amount</p>
          <p className="text-2xl font-bold text-blue-400">${Number(summary.total_amount).toFixed(2)}</p>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <p className="text-xs text-slate-400 font-medium mb-1">Avg Amount</p>
          <p className="text-2xl font-bold text-amber-400">${Number(summary.average_amount).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
