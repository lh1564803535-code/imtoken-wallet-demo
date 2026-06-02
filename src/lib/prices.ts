/**
 * Token Price Service
 * Provides mock price data with realistic market behavior.
 * Can be swapped for CoinGecko/CoinMarketCap API in production.
 */

export interface TokenPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  color: string;
  abbr: string;
}

const BASE_PRICES: Omit<TokenPrice, "price" | "change24h">[] = [
  { symbol: "ETH", name: "Ethereum", marketCap: 420_000_000_000, color: "bg-blue-500", abbr: "ET" },
  { symbol: "BTC", name: "Bitcoin", marketCap: 1_300_000_000_000, color: "bg-orange-500", abbr: "BT" },
  { symbol: "TRX", name: "Tron", marketCap: 12_000_000_000, color: "bg-red-500", abbr: "TR" },
  { symbol: "USDT", name: "Tether", marketCap: 110_000_000_000, color: "bg-green-500", abbr: "US" },
  { symbol: "MATIC", name: "Polygon", marketCap: 7_000_000_000, color: "bg-purple-500", abbr: "MA" },
  { symbol: "SOL", name: "Solana", marketCap: 80_000_000_000, color: "bg-violet-500", abbr: "SO" },
  { symbol: "AVAX", name: "Avalanche", marketCap: 14_000_000_000, color: "bg-red-400", abbr: "AV" },
  { symbol: "ARB", name: "Arbitrum", marketCap: 3_000_000_000, color: "bg-blue-400", abbr: "AR" },
];

const MOCK_PRICES: Record<string, number> = {
  ETH: 2691.34,
  BTC: 100000.00,
  TRX: 0.144,
  USDT: 1.00,
  MATIC: 0.85,
  SOL: 172.50,
  AVAX: 28.50,
  ARB: 0.42,
};

// Simulate small price fluctuations (client-only to avoid hydration mismatch)
function jitter(base: number, maxPercent: number): number {
  if (typeof window === "undefined") return base; // SSR: return deterministic value
  const delta = base * (Math.random() * maxPercent * 2 - maxPercent) / 100;
  return Math.round((base + delta) * 100) / 100;
}

export function getTokenPrices(): TokenPrice[] {
  return BASE_PRICES.map((t) => ({
    ...t,
    price: jitter(MOCK_PRICES[t.symbol] || 1, 0.5),
    change24h: jitter(0, 5),  // random -5% to +5%
  }));
}

export function getTokenBalance(symbol: string): { balance: string; usdValue: string } {
  const balances: Record<string, number> = {
    ETH: 0.5,
    BTC: 0.001,
    TRX: 500,
    USDT: 200,
    MATIC: 150,
    SOL: 2.5,
    AVAX: 10,
    ARB: 500,
  };
  const bal = balances[symbol] || 0;
  const price = MOCK_PRICES[symbol] || 0;
  const usd = bal * price;
  return {
    balance: bal.toString(),
    usdValue: `$${usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  };
}

export function getTotalBalance(): string {
  const prices = getTokenPrices();
  let total = 0;
  for (const t of prices) {
    const bal = getTokenBalance(t.symbol);
    total += parseFloat(bal.balance) * t.price;
  }
  return `$${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatPrice(n: number): string {
  if (n >= 1000) return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  if (n >= 1) return `$${n.toFixed(2)}`;
  return `$${n.toFixed(4)}`;
}

export function formatChange(n: number): string {
  const sign = n >= 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

export type Timeframe = "1H" | "1D" | "1W" | "1M" | "1Y";

export function getPriceHistory(symbol: string, timeframe: Timeframe): number[] {
  const basePrice = MOCK_PRICES[symbol] || 1;
  const pointCounts: Record<Timeframe, number> = { "1H": 12, "1D": 24, "1W": 7, "1M": 30, "1Y": 52 };
  const volatility: Record<Timeframe, number> = { "1H": 0.005, "1D": 0.02, "1W": 0.05, "1M": 0.1, "1Y": 0.3 };
  const count = pointCounts[timeframe];
  const vol = volatility[timeframe];

  // Deterministic pseudo-random based on symbol + timeframe
  let seed = 0;
  for (let i = 0; i < symbol.length; i++) seed += symbol.charCodeAt(i);
  seed += timeframe.charCodeAt(0) * 100;

  const points: number[] = [];
  let price = basePrice * (1 - vol * 0.5);
  for (let i = 0; i < count; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const random = (seed / 0x7fffffff) * 2 - 1;
    price = price * (1 + random * vol * 0.3);
    points.push(Math.round(price * 100) / 100);
  }
  return points;
}

export function getTokenIcon(symbol: string): string {
  const icons: Record<string, string> = {
    ETH: "⟠", BTC: "₿", TRX: "◎", USDT: "₮", MATIC: "⬡",
    SOL: "◎", AVAX: "🔺", ARB: "🔵",
  };
  return icons[symbol] || "●";
}
