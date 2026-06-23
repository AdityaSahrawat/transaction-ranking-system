import React from "react";
import { RankingItem } from "../services/api";

interface RankingTableProps {
  rankings: RankingItem[];
  loading: boolean;
  onRefresh: () => void;
}

export default function RankingTable({ rankings, loading, onRefresh }: RankingTableProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Leaderboard</h2>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-white font-medium py-1.5 px-4 rounded-xl transition-all border border-slate-700 text-sm cursor-pointer disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-850 text-slate-400 font-semibold text-sm">
              <th className="py-3 px-4 w-20">Rank</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4 text-right w-32">Score</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="py-10 text-center text-slate-500 text-sm">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <svg className="animate-spin h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Loading leaderboard...</span>
                  </div>
                </td>
              </tr>
            ) : rankings.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-10 text-center text-slate-500 text-sm">
                  No users ranked yet. Submit transactions to see the leaderboard update!
                </td>
              </tr>
            ) : (
              rankings.map((item) => (
                <tr
                  key={item.user_id}
                  className="border-b border-slate-850 hover:bg-slate-950/40 text-slate-300 transition-colors text-sm"
                >
                  <td className="py-3.5 px-4 font-bold">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                        item.rank === 1
                          ? "bg-yellow-500/25 text-yellow-400 font-extrabold border border-yellow-500/50"
                          : item.rank === 2
                          ? "bg-slate-400/25 text-slate-300 font-extrabold border border-slate-400/50"
                          : item.rank === 3
                          ? "bg-amber-600/25 text-amber-500 font-extrabold border border-amber-600/50"
                          : "text-slate-400"
                      }`}
                    >
                      {item.rank}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-white">{item.user_id}</td>
                  <td className="py-3.5 px-4 text-right font-semibold text-emerald-400">
                    {item.score.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
