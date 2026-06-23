import React from "react";

interface PaginationProps {
  currentPage: number;
  hasMore: boolean;
  onPageChange: (newPage: number) => void;
  loading: boolean;
}

export default function Pagination({ currentPage, hasMore, onPageChange, loading }: PaginationProps) {
  return (
    <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 shadow-xl mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className="inline-flex items-center bg-slate-800 hover:bg-slate-700 active:bg-slate-900 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-xl transition-all border border-slate-700 text-sm cursor-pointer disabled:cursor-not-allowed"
      >
        &lt; Prev
      </button>

      <span className="text-sm font-medium text-slate-300">
        Page <span className="text-white font-bold">{currentPage}</span>
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasMore || loading}
        className="inline-flex items-center bg-slate-800 hover:bg-slate-700 active:bg-slate-900 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-xl transition-all border border-slate-700 text-sm cursor-pointer disabled:cursor-not-allowed"
      >
        Next &gt;
      </button>
    </div>
  );
}
