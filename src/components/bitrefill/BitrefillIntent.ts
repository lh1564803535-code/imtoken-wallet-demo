import type { PurchaseIntent } from "@/types/bitrefill";

const PURCHASE_PATTERNS: RegExp[] = [
  /(?:buy|purchase|get|want)\s+(?:a\s+)?(?:\$(\d+))\s+(.+?)(?:\s+gift\s*card|\s+card)?$/i,
  /(?:buy|purchase|get|want)\s+(?:a\s+)?(\d+)\s*(?:dollar|usd|USD)\s+(.+?)(?:\s+gift\s*card|\s+card)?$/i,
  /(?:i\s+want\s+to\s+)?(?:buy|get|purchase)\s+(?:a\s+)?(.+?)(?:\s+for\s+(?:my\s+)?(?:girlfriend|boyfriend|friend|mom|dad|family|wife|husband|partner))?$/i,
  /(?:top\s*up|recharge|reload)\s+(?:my\s+)?(.+)$/i,
  /(?:buy|purchase|get|want)\s+(.+?)(?:\s+gift\s*card|\s+card)?$/i,
  /(?:i\s+need|need|looking\s+for)\s+(?:a\s+)?(.+?)(?:\s+gift\s*card|\s+card)?$/i,
  /(?:top\s*up|recharge)\s+(\d+)\s*(?:yuan|rmb|cny)\s+(.+)/i,
];

const CURRENCY_KEYWORDS: Record<string, string> = {
  dollar: "USD",
  usd: "USD",
  yuan: "CNY",
  rmb: "CNY",
  cny: "CNY",
};

const PRODUCT_ALIASES: Record<string, string[]> = {
  amazon: ["amazon-us", "amazon"],
  steam: ["steam-us", "steam"],
  netflix: ["netflix-us", "netflix"],
  spotify: ["spotify-us", "spotify"],
  uber: ["uber-us", "uber"],
  apple: ["apple-us", "apple"],
  google: ["google-us", "google play"],
  itunes: ["apple-us", "itunes"],
  "app store": ["apple-us", "app store"],
  "google play": ["google-us", "google play"],
  playstation: ["psn-us", "playstation"],
  psn: ["psn-us", "psn"],
  xbox: ["xbox-us", "xbox"],
  nintendo: ["nintendo-us", "nintendo"],
};

function detectCurrency(input: string): string | undefined {
  const lower = input.toLowerCase();
  for (const [keyword, currency] of Object.entries(CURRENCY_KEYWORDS)) {
    if (lower.includes(keyword)) return currency;
  }
  if (input.includes("$")) return "USD";
  return undefined;
}

export function parsePurchaseIntent(input: string): PurchaseIntent | null {
  const trimmed = input.trim();
  if (trimmed.length === 0 || trimmed.length > 200) return null;

  for (const pattern of PURCHASE_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match) {
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
        const lower = productType.toLowerCase();
        let normalizedType = productType;
        for (const [alias, targets] of Object.entries(PRODUCT_ALIASES)) {
          if (lower.includes(alias)) {
            normalizedType = targets[0];
            break;
          }
        }

        return {
          productType: normalizedType,
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
    "buy", "purchase", "get a", "want a", "i want to",
    "top up", "recharge", "reload", "need",
    "gift card",
  ];
  return purchaseKeywords.some((k) => lower.includes(k));
}

export function isGeneralQuestion(input: string): boolean {
  const lower = input.toLowerCase().trim();
  const patterns = [
    /^(what|how|why|when|where|who|which|can you|could you)/i,
    /\?$/,
  ];
  return patterns.some((p) => p.test(lower));
}

export function getSuggestions(input: string): string[] {
  const lower = input.toLowerCase();

  if (lower.includes("gift") || lower.includes("card")) {
    return ["Buy $50 Amazon card", "Buy $25 Steam card", "Show my gift cards"];
  }

  if (lower.includes("pay") || lower.includes("crypto")) {
    return ["Show my ETH address", "Buy $50 Amazon card", "Sign a message"];
  }

  if (lower.includes("wallet") || lower.includes("address")) {
    return ["Show my ETH address", "Show all addresses", "Create new wallet"];
  }

  return [
    "Show my ETH address",
    "Buy $50 Amazon gift card",
    "Prove I own all chains",
    "Sign a message",
    "Show my gift cards",
  ];
}
// Travel destination -> country code mapping
const DESTINATION_MAP: Record<string, string> = {
  japan: "JP", tokyo: "JP", osaka: "JP", kyoto: "JP",
  korea: "KR", seoul: "KR", busan: "KR",
  china: "CN", beijing: "CN", shanghai: "CN", shenzhen: "CN", guangzhou: "CN", hangzhou: "CN",
  "hong kong": "HK", hk: "HK",
  taiwan: "TW", taipei: "TW",
  thailand: "TH", bangkok: "TH", phuket: "TH",
  singapore: "SG",
  vietnam: "VN", "ho chi minh": "VN", hanoi: "VN",
  malaysia: "MY", "kuala lumpur": "MY",
  indonesia: "ID", bali: "ID", jakarta: "ID",
  philippines: "PH", manila: "PH",
  india: "IN", mumbai: "IN", delhi: "IN",
  usa: "US", america: "US", "new york": "US", "los angeles": "US", "san francisco": "US",
  uk: "GB", england: "GB", london: "GB",
  france: "FR", paris: "FR",
  germany: "DE", berlin: "DE", munich: "DE",
  italy: "IT", rome: "IT",
  spain: "ES", barcelona: "ES", madrid: "ES",
  australia: "AU", sydney: "AU", melbourne: "AU",
  canada: "CA", toronto: "CA", vancouver: "CA",
  brazil: "BR", "rio de janeiro": "BR", "sao paulo": "BR",
  mexico: "MX", "mexico city": "MX",
  dubai: "AE", "united arab emirates": "AE", "abu dhabi": "AE",
  egypt: "EG", cairo: "EG",
  "south africa": "ZA", "cape town": "ZA", johannesburg: "ZA",
};

// Country code -> recommended product keywords
const COUNTRY_PRODUCTS: Record<string, string[]> = {
  CN: ["jd", "taobao", "meituan", "eleme", "didi", "china-mobile", "china-unicom", "netease", "steam-cn"],
  JP: ["amazon", "nintendo", "playstation", "google-play"],
  KR: ["google-play", "playstation", "netflix"],
  US: ["amazon", "uber", "netflix", "spotify", "steam", "apple", "google-play", "playstation", "xbox"],
  GB: ["amazon", "uber", "netflix", "spotify", "google-play"],
  TH: ["google-play", "netflix", "uber"],
  SG: ["google-play", "netflix", "uber", "spotify"],
  VN: ["google-play", "netflix"],
  AU: ["amazon", "uber", "netflix", "spotify", "google-play"],
  CA: ["amazon", "uber", "netflix", "spotify", "google-play"],
  DE: ["amazon", "netflix", "spotify", "google-play"],
  FR: ["amazon", "netflix", "spotify", "google-play"],
  DEFAULT: ["amazon", "netflix", "uber", "google-play", "spotify"],
};

export interface TravelRecommendation {
  destination: string;
  countryCode: string;
  message: string;
}

export function detectTravelIntent(input: string): TravelRecommendation | null {
  const lower = input.toLowerCase().trim();

  // Travel patterns
  const travelPatterns = [
    /(?:i'?m|i am|i'?ll be|going to|travel(?:ing|ling)? to|visiting|flying to|heading to|trip to|vacation in|holiday in)\s+(?:in\s+)?(?:the\s+)?(.+?)(?:\s+next|this|in\s+\w+|for|with|\.|,|$)/i,
    /(?:去|飞去|旅游去|要去|打算去|计划去)\s*(.+?)(?:旅游|玩|出差|next|in|for|$)/i,
  ];

  for (const pattern of travelPatterns) {
    const match = lower.match(pattern);
    if (match) {
      const dest = match[1].trim().toLowerCase();
      const country = DESTINATION_MAP[dest];
      if (country) {
        return {
          destination: match[1].trim(),
          countryCode: country,
          message: "travel",
        };
      }
    }
  }

  return null;
}

export function getTravelProducts(countryCode: string): string[] {
  return COUNTRY_PRODUCTS[countryCode] || COUNTRY_PRODUCTS["DEFAULT"];
}
