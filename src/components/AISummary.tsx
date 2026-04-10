"use client";

import { useState } from "react";
import { DataPoint } from "@/lib/data";

interface Props {
  data: DataPoint[];
}

export default function AISummary({ data }: Props) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateSummary() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      const result = await res.json();
      if (result.error) {
        setError(result.error);
      } else {
        setSummary(result.summary);
      }
    } catch {
      setError("Failed to generate summary. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="text-2xl">&#x1F916;</span> AI-Generated Analysis
        </h2>
        <button
          onClick={generateSummary}
          disabled={loading || data.length === 0}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {loading ? "Analyzing..." : summary ? "Regenerate" : "Generate Analysis"}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 text-red-300 text-sm">
          {error}
        </div>
      )}

      {summary && (
        <div className="prose prose-invert prose-sm max-w-none">
          {summary.split("\n").map((line, i) => (
            <p key={i} className={line.trim() === "" ? "h-2" : "text-zinc-300 leading-relaxed"}>
              {line}
            </p>
          ))}
        </div>
      )}

      {!summary && !error && !loading && (
        <p className="text-zinc-500 text-sm">
          Click &quot;Generate Analysis&quot; to get AI-powered insights on the mNAV trend and market conditions.
        </p>
      )}
    </div>
  );
}
