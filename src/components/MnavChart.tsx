"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import { DataPoint } from "@/lib/data";

interface Props {
  data: DataPoint[];
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function formatUSD(value: number) {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
  return `$${value}`;
}

export default function MnavChart({ data }: Props) {
  if (data.length === 0) return <p className="text-zinc-400">無可用資料。</p>;

  return (
    <div className="space-y-8">
      {/* mNAV 圖表 */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-white">
          Strategy (MSTR) mNAV 比率
        </h2>
        <p className="text-sm text-zinc-400 mb-4">
          mNAV = 市值 / (BTC 持有量 x BTC 價格)。數值大於 1.0 代表市場對 MSTR 的估值高於其比特幣持倉價值（溢價）。
        </p>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                stroke="#888"
                fontSize={12}
                interval={Math.floor(data.length / 8)}
              />
              <YAxis
                yAxisId="mnav"
                stroke="#f59e0b"
                fontSize={12}
                tickFormatter={(v) => `${v}x`}
                domain={["auto", "auto"]}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "8px" }}
                labelStyle={{ color: "#ccc" }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any, name: any) => {
                  if (name === "mNAV") return [`${Number(value).toFixed(3)}x`, "mNAV"];
                  return [value, name];
                }}
              />
              <Legend />
              <ReferenceLine yAxisId="mnav" y={1} stroke="#666" strokeDasharray="5 5" label={{ value: "1.0x (公允價值)", fill: "#666", fontSize: 11 }} />
              <Line
                yAxisId="mnav"
                type="monotone"
                dataKey="mNAV"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
                name="mNAV"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BTC 價格 vs MSTR 股價 */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-white">
          BTC 價格 vs MSTR 股價
        </h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                stroke="#888"
                fontSize={12}
                interval={Math.floor(data.length / 8)}
              />
              <YAxis
                yAxisId="btc"
                stroke="#f7931a"
                fontSize={12}
                tickFormatter={(v) => formatUSD(v)}
              />
              <YAxis
                yAxisId="mstr"
                orientation="right"
                stroke="#6366f1"
                fontSize={12}
                tickFormatter={(v) => formatUSD(v)}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "8px" }}
                labelStyle={{ color: "#ccc" }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any, name: any) => [formatUSD(Number(value)), name]}
              />
              <Legend />
              <Line
                yAxisId="btc"
                type="monotone"
                dataKey="btcPrice"
                stroke="#f7931a"
                strokeWidth={2}
                dot={false}
                name="BTC 價格"
              />
              <Line
                yAxisId="mstr"
                type="monotone"
                dataKey="mstrPrice"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
                name="MSTR 股價"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 市值 vs 淨資產價值 */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-white">
          市值 vs BTC 淨資產價值
        </h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                stroke="#888"
                fontSize={12}
                interval={Math.floor(data.length / 8)}
              />
              <YAxis
                stroke="#888"
                fontSize={12}
                tickFormatter={(v) => formatUSD(v)}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "8px" }}
                labelStyle={{ color: "#ccc" }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any, name: any) => [formatUSD(Number(value)), name]}
              />
              <Legend />
              <Bar dataKey="marketCap" fill="#6366f1" opacity={0.6} name="市值" />
              <Bar dataKey="nav" fill="#f7931a" opacity={0.6} name="BTC 淨資產價值" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
