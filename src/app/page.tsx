"use client";

import { useState, useEffect } from "react";
import { DataPoint } from "@/lib/data";
import MnavChart from "@/components/MnavChart";
import StatsCards from "@/components/StatsCards";
import AISummary from "@/components/AISummary";

export default function Home() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(365);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/data?days=${days}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          setError(result.error);
        } else {
          setData(result.data);
        }
      })
      .catch(() => setError("Failed to fetch data"))
      .finally(() => setLoading(false));
  }, [days]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              <span className="text-amber-400">mNAV</span> Robo-Advisor
            </h1>
            <p className="text-sm text-zinc-500">Strategy (MSTR) DAT.co Indicator Dashboard</p>
          </div>
          <div className="flex gap-2">
            {[90, 180, 365].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  days === d
                    ? "bg-amber-500 text-black font-medium"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                {d === 365 ? "1Y" : `${d}D`}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400" />
            <span className="ml-3 text-zinc-400">Loading market data...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-800 rounded-xl p-6 text-center">
            <p className="text-red-300">{error}</p>
            <button
              onClick={() => setDays(days)}
              className="mt-3 px-4 py-2 bg-red-800 hover:bg-red-700 rounded-lg text-sm text-white transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <StatsCards data={data} />
            <MnavChart data={data} />
            <AISummary data={data} />

            {/* Methodology */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-3">Methodology</h2>
              <div className="text-sm text-zinc-400 space-y-2">
                <p>
                  <strong className="text-zinc-300">mNAV (Modified Net Asset Value)</strong> measures the ratio
                  of Strategy&apos;s (formerly MicroStrategy) market capitalization to the value of its Bitcoin holdings.
                </p>
                <p>
                  <strong className="text-zinc-300">Formula:</strong> mNAV = Market Cap / (BTC Holdings &times; BTC Price)
                </p>
                <p>
                  An mNAV above 1.0 indicates the market assigns a <em>premium</em> to MSTR over its underlying
                  BTC — reflecting expectations of future BTC accumulation, leverage benefits, or stock market access to Bitcoin exposure.
                  Below 1.0 implies a discount.
                </p>
                <p>
                  <strong className="text-zinc-300">Data Sources:</strong> BTC price from CoinGecko API,
                  MSTR stock price from Yahoo Finance, BTC holdings from Strategy&apos;s public quarterly reports.
                </p>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-zinc-600">
          HW2 Robo-Advisor | CSIE5315 Bitcoin &amp; Data Analysis | 2026 Spring
        </div>
      </footer>
    </div>
  );
}
