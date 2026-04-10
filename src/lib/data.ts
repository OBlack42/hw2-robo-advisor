// Strategy (MSTR) BTC holdings timeline - from public quarterly reports
// Source: https://www.strategy.com/bitcoin
// Shares outstanding reflect massive ATM offerings & convertible note conversions
export const STRATEGY_BTC_HOLDINGS: { date: string; btc: number; shares: number }[] = [
  { date: "2024-01-01", btc: 189150, shares: 155900000 },
  { date: "2024-04-01", btc: 214246, shares: 181300000 },
  { date: "2024-07-01", btc: 226500, shares: 203400000 },
  { date: "2024-10-01", btc: 252220, shares: 244800000 },
  { date: "2025-01-01", btc: 446400, shares: 378900000 },
  { date: "2025-04-01", btc: 506137, shares: 432600000 },
  { date: "2025-07-01", btc: 538200, shares: 476000000 },
  { date: "2025-10-01", btc: 555450, shares: 510000000 },
  { date: "2026-01-01", btc: 571356, shares: 538000000 },
  { date: "2026-04-01", btc: 580250, shares: 556000000 },
];

export function getHoldingsAtDate(dateStr: string): { btc: number; shares: number } {
  const date = new Date(dateStr);
  let latest = STRATEGY_BTC_HOLDINGS[0];
  for (const entry of STRATEGY_BTC_HOLDINGS) {
    if (new Date(entry.date) <= date) {
      latest = entry;
    }
  }
  return { btc: latest.btc, shares: latest.shares };
}

export interface DataPoint {
  date: string;
  btcPrice: number;
  mstrPrice: number;
  mNAV: number;
  btcHoldings: number;
  nav: number;
  marketCap: number;
}

// Fetch BTC price history from CoinGecko
export async function fetchBTCPrices(days: number = 365): Promise<{ date: string; price: number }[]> {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}&interval=daily`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error(`CoinGecko API error: ${res.status}`);
  const data = await res.json();
  return data.prices.map(([timestamp, price]: [number, number]) => ({
    date: new Date(timestamp).toISOString().split("T")[0],
    price,
  }));
}

// Fetch MSTR stock price history from Yahoo Finance
export async function fetchMSTRPrices(days: number = 365): Promise<{ date: string; price: number }[]> {
  const period2 = Math.floor(Date.now() / 1000);
  const period1 = period2 - days * 86400;
  const res = await fetch(
    `https://query1.finance.yahoo.com/v8/finance/chart/MSTR?period1=${period1}&period2=${period2}&interval=1d`,
    {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 3600 },
    }
  );
  if (!res.ok) throw new Error(`Yahoo Finance API error: ${res.status}`);
  const data = await res.json();
  const result = data.chart.result[0];
  const timestamps: number[] = result.timestamp;
  const closes: number[] = result.indicators.quote[0].close;
  return timestamps.map((ts, i) => ({
    date: new Date(ts * 1000).toISOString().split("T")[0],
    price: closes[i],
  }));
}

// Combine data and calculate mNAV
export async function fetchAllData(days: number = 365): Promise<DataPoint[]> {
  const [btcPrices, mstrPrices] = await Promise.all([
    fetchBTCPrices(days),
    fetchMSTRPrices(days),
  ]);

  // Create a map of MSTR prices by date
  const mstrMap = new Map(mstrPrices.map((p) => [p.date, p.price]));

  const dataPoints: DataPoint[] = [];
  for (const btcEntry of btcPrices) {
    const mstrPrice = mstrMap.get(btcEntry.date);
    if (mstrPrice == null) continue; // skip weekends/holidays where stock market is closed

    const holdings = getHoldingsAtDate(btcEntry.date);
    const nav = holdings.btc * btcEntry.price; // Net Asset Value (BTC portion)
    const marketCap = mstrPrice * holdings.shares;
    const mNAV = marketCap / nav;

    dataPoints.push({
      date: btcEntry.date,
      btcPrice: Math.round(btcEntry.price),
      mstrPrice: Math.round(mstrPrice * 100) / 100,
      mNAV: Math.round(mNAV * 1000) / 1000,
      btcHoldings: holdings.btc,
      nav: Math.round(nav),
      marketCap: Math.round(marketCap),
    });
  }

  return dataPoints;
}
