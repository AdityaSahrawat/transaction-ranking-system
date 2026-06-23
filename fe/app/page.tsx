"use client";

import React, { useState, useEffect, useCallback } from "react";
import TransactionForm from "../components/TransactionForm";
import SummaryForm from "../components/SummaryForm";
import SummaryCard from "../components/SummaryCard";
import RankingTable from "../components/RankingTable";
import Pagination from "../components/Pagination";
import { getRanking, RankingItem, UserSummary } from "../services/api";

export default function Home() {
  const appEnv = process.env.NEXT_PUBLIC_APP_ENV;
  const isProd = appEnv === "prod" || appEnv === "production";

  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [summary, setSummary] = useState<UserSummary | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const limit = 10;

  const fetchLeaderboard = useCallback(async (page: number) => {
    setLoadingLeaderboard(true);
    const res = await getRanking(page, limit);
    setLoadingLeaderboard(false);
    if (res.success && res.data) {
      setRankings(res.data);
      setHasMore(res.data.length === limit);
    } else {
      setRankings([]);
      setHasMore(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchLeaderboard(currentPage);
  }, [currentPage, fetchLeaderboard]);

  const handleTransactionSuccess = () => {
    fetchLeaderboard(currentPage);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleRefresh = () => {
    fetchLeaderboard(currentPage);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            Transaction Ranking Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Real-time transaction tracking, priority ranking, and rate-limited abuse prevention dashboard.
          </p>
        </header>

        {isProd && (
          <div className="bg-red-950/40 border border-red-850 text-red-400 px-4 py-3 rounded-xl text-sm font-medium">
            make sure be is running in https://tr-ranking-sys.onrender.com/ for smooth experience
          </div>
        )}

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Transaction Creation and Summary */}
          <div className="lg:col-span-5 space-y-8">
            <section>
              <TransactionForm onSuccess={handleTransactionSuccess} />
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
              <SummaryForm onFetched={setSummary} />
              <SummaryCard summary={summary} />
            </section>
          </div>

          {/* Right Column: Leaderboard */}
          <div className="lg:col-span-7 flex flex-col h-full justify-between">
            <section className="flex-1">
              <RankingTable
                rankings={rankings}
                loading={loadingLeaderboard}
                onRefresh={handleRefresh}
              />
              <Pagination
                currentPage={currentPage}
                hasMore={hasMore}
                onPageChange={handlePageChange}
                loading={loadingLeaderboard}
              />
            </section>
          </div>

        </div>

      </div>
    </main>
  );
}
