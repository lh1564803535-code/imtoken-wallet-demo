import type { PurchaseIntent } from "@/types/bitrefill";

const PURCHASE_PATTERNS: RegExp[] = [
  // English: "buy $50 Amazon gift card", "get a $100 steam card"
  /(?:buy|purchase|get|want)\s+(?:a\s+)?(?:\$(\d+))\s+(.+?)(?:\s+gift\s*card|\s+card)?$/i,
  // English: "buy 50 dollar Amazon card"
  /(?:buy|purchase|get|want)\s+(?:a\s+)?(\d+)\s*(?:dollar|usd|USD)\s+(.+?)(?:\s+gift\s*card|\s+card)?$/i,
  // Chinese: "买50美元Amazon卡", "购买100元话费"
  /(?:买|购买|充值|帮我买|我想买|我要买)\s*(\d+)\s*(?:美元|美金|刀|USD)\s*(.+?)(?:卡|充值卡|礼品卡)?$/i,
  // Chinese: "买100元京东卡"
  /(?:买|购买|充值|帮我买|我想买|我要买)\s*(\d+)\s*(?:元|块|人民币|CNY|rmb)\s*(.+?)(?:卡|充值卡|礼品卡)?$/i,
  // Chinese: "帮我买 Amazon 50美元"
  /(?:买|购买|帮我买|我想买|我要买)\s*(.+?)\s*(\d+)\s*(?:美元|美金|刀|元|块)/i,
  // English: "I want to top up 100 yuan phone"
  /(?:top\s*up|recharge)\s+(\d+)\s*(?:yuan|rmb|cny)\s+(.+)/i,
  // Fallback: "buy Amazon", "买京东"
  /(?:buy|purchase|get|买|购买|帮我买|我想买)\s+(?:a\s+)?(.+?)(?:\s+gift\s*card|\s+card|卡|充值卡|礼品卡)?$/i,
];

const CURRENCY_KEYWORDS: Record<string, string> = {
  美元: "USD",
  美金: "USD",
  刀: "USD",
  dollar: "USD",
  usd: "USD",
  元: "CNY",
  块: "CNY",
  人民币: "CNY",
  rmb: "CNY",
  cny: "CNY",
  yuan: "CNY",
};

function detectCurrency(input: string): string | undefined {
  const lower = input.toLowerCase();
  for (const [keyword, currency] of Object.entries(CURRENCY_KEYWORDS)) {
    if (lower.includes(keyword)) return currency;
  }
  // Default: if has $ sign, USD
  if (input.includes("$")) return "USD";
  return undefined;
}

export function parsePurchaseIntent(input: string): PurchaseIntent | null {
  const trimmed = input.trim();
  if (trimmed.length === 0 || trimmed.length > 200) return null;

  for (const pattern of PURCHASE_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match) {
      // Try to extract denomination and product type
      const groups = match.slice(1).filter(Boolean);
      let denomination: number | undefined;
      let productType = "";

      for (const g of groups) {
        const num = parseInt(g);
        if (!isNaN(num) && num > 0 && num < 100000) {
          denomination = num;
        } else if (g.trim().length > 0) {
          productType = g.trim();
        }
      }

      if (productType) {
        return {
          productType,
          denomination,
          currency: detectCurrency(trimmed),
          raw: trimmed,
        };
      }
    }
  }

  return null;
}

export function isPurchaseQuery(input: string): boolean {
  const lower = input.toLowerCase().trim();
  const purchaseKeywords = [
    "buy", "purchase", "get a", "want a",
    "top up", "recharge",
    "买", "购买", "充值", "帮我买", "我想买", "我要买",
    "gift card", "礼品卡", "充值卡",
  ];
  return purchaseKeywords.some((k) => lower.includes(k));
}
