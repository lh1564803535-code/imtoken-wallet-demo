import type {
  BitrefillProduct,
  BitrefillInvoice,
  BitrefillResponse,
  CatalogFilters,
} from "@/types/bitrefill";
import { MOCK_PRODUCTS, MOCK_EXCHANGE_RATES, CNY_TO_USD } from "./bitrefill-mock-data";

function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function generateMockAddress(chain: string): string {
  const hexChars = "0123456789abcdef";
  const randomHex = (len: number) =>
    Array.from({ length: len }, () => hexChars[Math.floor(Math.random() * 16)]).join("");
  switch (chain) {
    case "ETHEREUM":
      return "0x" + randomHex(40);
    case "BITCOIN":
      return "bc1q" + randomHex(32);
    case "TRON":
      return "T" + randomHex(33).toUpperCase();
    default:
      return "0x" + randomHex(40);
  }
}

function generateGiftCardCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const segment = () =>
    Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `${segment()}-${segment()}-${segment()}-${segment()}`;
}

function cryptoSymbolForChain(chain: string): string {
  switch (chain) {
    case "ETHEREUM": return "ETH";
    case "BITCOIN": return "BTC";
    case "TRON": return "TRX";
    default: return "ETH";
  }
}

function calculateCryptoAmount(
  denomination: number,
  currency: string,
  chain: string
): string {
  let usdAmount = denomination;
  if (currency === "CNY") {
    usdAmount = denomination * CNY_TO_USD;
  }
  const symbol = cryptoSymbolForChain(chain);
  const rate = MOCK_EXCHANGE_RATES[symbol] || 3500;
  const amount = usdAmount / rate;
  return amount.toFixed(6);
}

// Simulate network delay
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getProducts(
  filters: CatalogFilters
): Promise<BitrefillResponse<BitrefillProduct[]>> {
  await delay(300 + Math.random() * 200);

  let products = [...MOCK_PRODUCTS];

  if (filters.country && filters.country !== "ALL") {
    products = products.filter((p) => p.country === filters.country);
  }

  if (filters.category && filters.category !== "all") {
    products = products.filter((p) => p.category === filters.category);
  }

  if (filters.search && filters.search.trim().length > 0) {
    const q = filters.search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  return { success: true, data: products };
}

export async function getProductById(
  id: string
): Promise<BitrefillResponse<BitrefillProduct>> {
  await delay(200);
  const product = MOCK_PRODUCTS.find((p) => p.id === id);
  if (!product) {
    return {
      success: false,
      error: { type: "api", status: 404, message: "Product not found" },
    };
  }
  return { success: true, data: product };
}

export async function createInvoice(
  productId: string,
  denomination: number,
  chain: string
): Promise<BitrefillResponse<BitrefillInvoice>> {
  await delay(500 + Math.random() * 300);

  const product = MOCK_PRODUCTS.find((p) => p.id === productId);
  if (!product) {
    return {
      success: false,
      error: { type: "api", status: 404, message: "Product not found" },
    };
  }

  const invoice: BitrefillInvoice = {
    id: generateId(),
    productId,
    productName: product.name,
    denomination,
    currency: product.currency,
    payment: {
      address: generateMockAddress(chain),
      amount: calculateCryptoAmount(denomination, product.currency, chain),
      chain,
      symbol: cryptoSymbolForChain(chain),
    },
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  return { success: true, data: invoice };
}

export async function simulatePaymentSuccess(
  invoice: BitrefillInvoice
): Promise<{ code: string; pin?: string }> {
  await delay(2000);
  return { code: generateGiftCardCode() };
}

export function searchProductsByIntent(
  query: string,
  denomination?: number
): BitrefillProduct[] {
  const q = query.toLowerCase();
  let results = MOCK_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q)
  );

  if (denomination) {
    results = results.filter(
      (p) =>
        p.denominations.includes(denomination) ||
        (p.range && denomination >= p.range.min && denomination <= p.range.max)
    );
  }

  return results.slice(0, 5);
}
