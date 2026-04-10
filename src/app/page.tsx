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
      .catch(() => setError("無法取得資料"))
      .finally(() => setLoading(false));
  }, [days]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              <span className="text-amber-400">mNAV</span> 智慧投資儀表板
            </h1>
            <p className="text-sm text-zinc-500">Strategy (MSTR) DAT.co 指標監測平台</p>
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
                {d === 365 ? "1 年" : d === 180 ? "半年" : "90 天"}
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
            <span className="ml-3 text-zinc-400">正在載入市場資料...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-800 rounded-xl p-6 text-center">
            <p className="text-red-300">{error}</p>
            <button
              onClick={() => setDays(days)}
              className="mt-3 px-4 py-2 bg-red-800 hover:bg-red-700 rounded-lg text-sm text-white transition-colors"
            >
              重試
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <StatsCards data={data} />
            <MnavChart data={data} />
            <AISummary data={data} />

            {/* 方法論 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-3">指標說明</h2>
              <div className="text-sm text-zinc-400 space-y-2">
                <p>
                  <strong className="text-zinc-300">mNAV（修正淨資產價值比）</strong>衡量的是
                  Strategy（前身為 MicroStrategy）的市值與其比特幣持倉價值之間的比率。
                </p>
                <p>
                  <strong className="text-zinc-300">公式：</strong> mNAV = 市值 / (BTC 持有量 &times; BTC 價格)
                </p>
                <p>
                  mNAV 大於 1.0 表示市場對 MSTR 賦予了<em>溢價</em>——反映市場對其未來持續購入 BTC、
                  槓桿操作優勢，或透過股票市場間接投資比特幣的預期。低於 1.0 則代表折價。
                </p>
                <p>
                  <strong className="text-zinc-300">資料來源：</strong>BTC 價格來自 CoinGecko API，
                  MSTR 股價來自 Yahoo Finance，BTC 持有量來自 Strategy 公開季報。
                </p>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-zinc-600">
          HW2 Robo-Advisor | CSIE5315 比特幣及數據分析 | 2026 Spring
        </div>
      </footer>
    </div>
  );
}
