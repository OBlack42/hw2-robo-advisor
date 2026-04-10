# HW2: Robo-Advisor — Report

## 1. Selected Indicator

### What indicator did I choose?

**mNAV (Modified Net Asset Value)** of Strategy (formerly MicroStrategy, ticker: MSTR).

mNAV is defined as:

$$\text{mNAV} = \frac{\text{MSTR Market Cap}}{\text{BTC Holdings} \times \text{BTC Price}}$$

### Why did I choose it?

Strategy is the largest and most prominent **Digital Asset Treasury (DAT.co) company** — a public company that holds Bitcoin as its primary treasury reserve asset. As of April 2026, Strategy holds over 580,000 BTC, making it the single largest corporate Bitcoin holder globally.

The mNAV ratio is the most widely tracked indicator for DAT.co companies because it captures a fundamental question: **how much premium (or discount) does the market assign to a company simply for holding Bitcoin on its balance sheet?**

- **mNAV > 1.0**: The market values the company at more than its Bitcoin holdings — implying investors see added value in the company's strategy, leverage, or stock-market accessibility.
- **mNAV < 1.0**: The company trades at a discount to its Bitcoin holdings — suggesting skepticism about management, dilution risk, or market sentiment.

This indicator is particularly interesting because it reflects both crypto market sentiment AND traditional equity market dynamics.

## 2. Relationship with Bitcoin (BTC)

### How is mNAV related to BTC?

The mNAV ratio has a **complex, non-linear relationship** with Bitcoin price:

1. **BTC price is the denominator**: When BTC rises, the NAV (denominator) increases. If the stock price doesn't keep up proportionally, mNAV decreases. Conversely, when BTC falls, mNAV can spike if the stock holds relatively steady.

2. **Leverage amplification**: Strategy uses debt and equity issuance to acquire more Bitcoin. This creates a leveraged exposure — MSTR stock tends to move more aggressively than BTC in both directions. During bull markets, mNAV often expands as investor enthusiasm drives the stock to higher premiums. During bear markets, mNAV compresses.

3. **Market sentiment proxy**: A rising mNAV during a BTC rally indicates strong "risk-on" sentiment — investors are not just buying Bitcoin, they're paying a premium for leveraged Bitcoin exposure. A falling mNAV during a BTC rally is a warning sign of cooling enthusiasm.

4. **Investment signal**: Historically, extreme mNAV values have been contrarian indicators:
   - Very high mNAV (>3.0x) often precedes corrections
   - Very low mNAV (<1.0x) has historically been a buying opportunity

### Key Insight

The mNAV acts as a **sentiment amplifier** for Bitcoin. It captures not just where BTC price is, but how the broader market *feels* about Bitcoin's future — filtered through the lens of institutional equity investors rather than crypto-native traders.

## 3. Deployed Website URL

**https://hw2-robo-advisor-flax.vercel.app**

## 4. Technical Implementation

- **Frontend**: Next.js 16 + TypeScript + Tailwind CSS + Recharts
- **Data Sources**:
  - BTC price: CoinGecko API (free, daily granularity)
  - MSTR stock price: Yahoo Finance API (daily OHLCV)
  - BTC holdings: Strategy's public quarterly reports (interpolated)
- **AI Summary (Bonus)**: Claude API (Haiku model) generates trend analysis on demand
- **Deployment**: Vercel

### Features

- Interactive time range selector (90D / 180D / 1Y)
- Three visualization panels:
  1. mNAV ratio over time with fair value reference line
  2. BTC price vs MSTR stock price (dual Y-axis)
  3. Market Cap vs BTC NAV bar chart
- Summary statistics cards (current mNAV, BTC price, MSTR price, BTC holdings)
- AI-generated market analysis (bonus feature)
- Methodology explanation section
