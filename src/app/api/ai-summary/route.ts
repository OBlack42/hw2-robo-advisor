import { DataPoint } from "@/lib/data";

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
  }

  const { data } = (await request.json()) as { data: DataPoint[] };
  if (!data || data.length === 0) {
    return Response.json({ error: "No data provided" }, { status: 400 });
  }

  const latest = data[data.length - 1];
  const oldest = data[0];
  const maxMNAV = data.reduce((max, d) => (d.mNAV > max.mNAV ? d : max), data[0]);
  const minMNAV = data.reduce((min, d) => (d.mNAV < min.mNAV ? d : min), data[0]);

  const prompt = `You are a financial analyst specializing in Bitcoin and Digital Asset Treasury (DAT.co) companies. Analyze the following Strategy (MSTR) mNAV data and provide insights.

Data Summary:
- Period: ${oldest.date} to ${latest.date} (${data.length} trading days)
- Current mNAV: ${latest.mNAV}x (Market Cap: $${(latest.marketCap / 1e9).toFixed(1)}B, NAV: $${(latest.nav / 1e9).toFixed(1)}B)
- mNAV Range: ${minMNAV.mNAV}x (${minMNAV.date}) to ${maxMNAV.mNAV}x (${maxMNAV.date})
- BTC Price Change: $${oldest.btcPrice} → $${latest.btcPrice}
- MSTR Price Change: $${oldest.mstrPrice} → $${latest.mstrPrice}
- Current BTC Holdings: ${latest.btcHoldings.toLocaleString()} BTC

Recent 5 data points:
${data.slice(-5).map((d) => `  ${d.date}: mNAV=${d.mNAV}x, BTC=$${d.btcPrice}, MSTR=$${d.mstrPrice}`).join("\n")}

請提供以下分析（以繁體中文回覆）：
1. mNAV 指標的趨勢分析
2. 目前 mNAV 水準反映的市場情緒
3. BTC 價格變動與 mNAV 變化之間的關係
4. 簡短的投資建議

請簡潔扼要（200 字以內），使用易懂的語言。`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!res.ok) {
      const errBody = await res.text();
      return Response.json({ error: `Gemini API error: ${errBody}` }, { status: 500 });
    }

    const result = await res.json();
    const summary = result.candidates[0].content.parts[0].text;
    return Response.json({ summary });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
