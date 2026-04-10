"use client";

import { DataPoint } from "@/lib/data";

interface Props {
  data: DataPoint[];
}

function formatUSD(value: number) {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
  return `$${value}`;
}

export default function StatsCards({ data }: Props) {
  if (data.length === 0) return null;

  const latest = data[data.length - 1];
  const oldest = data[0];
  const mnavChange = ((latest.mNAV - oldest.mNAV) / oldest.mNAV) * 100;
  const btcChange = ((latest.btcPrice - oldest.btcPrice) / oldest.btcPrice) * 100;

  const cards = [
    {
      label: "Current mNAV",
      value: `${latest.mNAV.toFixed(3)}x`,
      sub: mnavChange >= 0 ? `+${mnavChange.toFixed(1)}%` : `${mnavChange.toFixed(1)}%`,
      color: mnavChange >= 0 ? "text-green-400" : "text-red-400",
      border: "border-amber-500/30",
    },
    {
      label: "BTC Price",
      value: formatUSD(latest.btcPrice),
      sub: btcChange >= 0 ? `+${btcChange.toFixed(1)}%` : `${btcChange.toFixed(1)}%`,
      color: btcChange >= 0 ? "text-green-400" : "text-red-400",
      border: "border-orange-500/30",
    },
    {
      label: "MSTR Price",
      value: `$${latest.mstrPrice.toFixed(2)}`,
      sub: `Market Cap: ${formatUSD(latest.marketCap)}`,
      color: "text-zinc-400",
      border: "border-indigo-500/30",
    },
    {
      label: "BTC Holdings",
      value: latest.btcHoldings.toLocaleString(),
      sub: `NAV: ${formatUSD(latest.nav)}`,
      color: "text-zinc-400",
      border: "border-zinc-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className={`bg-zinc-900 border ${card.border} rounded-xl p-4`}>
          <p className="text-xs text-zinc-500 uppercase tracking-wide">{card.label}</p>
          <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
          <p className={`text-sm mt-1 ${card.color}`}>{card.sub}</p>
        </div>
      ))}
    </div>
  );
}
