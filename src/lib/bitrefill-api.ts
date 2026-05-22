import type {
  BitrefillProduct,
  BitrefillInvoice,
  BitrefillResponse,
  CatalogFilters,
} from "@/types/bitrefill";
import { MOCK_PRODUCTS, MOCK_EXCHANGE_RATES, CNY_TO_USD } from "./bitrefill-mock-data";

const API_BASE = '/api/bitrefill';

// ============ API Helpers ============

async function apiGet<T>(path: string, params?: Record<string, string>): Promise<T | null> {
  try {
    const url = new URL(`${window.location.origin}${API_BASE}/${path}`);
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    }
    const res = await fetch(url.toString());
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? json;
  } catch {
    return null;
  }
}

async function apiPost<T>(path: string, body: any): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? json;
  } catch {
    return null;
  }
}

// ============ Type Mapping ============

function mapApiProduct(api: any): BitrefillProduct {
  return {
    id: api.id,
    name: api.name,
    description: api.description || '',
    country: api.country || 'US',
    category: api.category || 'other',
    currency: api.currency || 'USD',
    denominations: api.packages?.map((p: any) => p.value) || [25, 50, 100],
    supportedCrypto: ['ETH', 'BTC', 'USDT'],
    discount: api.discount || 0,
    inStock: api.in_stock !== false,
    imageUrl: api.image || undefined,
  };
}

// ============ Mock Helpers ============

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

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function applyFilters(products: BitrefillProduct[], filters: CatalogFilters): BitrefillProduct[] {
  let result = [...products];

  if (filters.country && filters.country !== "ALL") {
    result = result.filter((p) => p.country === filters.country);
  }

  if (filters.category && filters.category !== "all") {
    result = result.filter((p) => p.category === filters.category);
  }

  if (filters.search && filters.search.trim().length > 0) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  return result;
}

// ============ Real API + Mock Fallback ============

export async function getProducts(
  filters: CatalogFilters
): Promise<BitrefillResponse<BitrefillProduct[]>> {
  // Try real API first
  const realProducts = await apiGet<any[]>('products', { limit: '30' });
  if (realProducts && realProducts.length > 0) {
    const mapped = realProducts.map(mapApiProduct);
    return { success: true, data: applyFilters(mapped, filters) };
  }

  // Fallback to mock
  await delay(300 + Math.random() * 200);
  return { success: true, data: applyFilters(MOCK_PRODUCTS, filters) };
}

export async function getProductById(
  id: string
): Promise<BitrefillResponse<BitrefillProduct>> {
  // Try real API first
  const realProduct = await apiGet<any>(`products/${id}`);
  if (realProduct) {
    return { success: true, data: mapApiProduct(realProduct) };
  }

  // Fallback to mock
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
  // Try real API first (use test product for demo)
  const useTestProduct = productId === 'test-gift-card-code' || productId === 'test-gift-card-link';
  const realInvoice = await apiPost<any>('invoices', {
    products: [{
      product_id: useTestProduct ? productId : 'test-gift-card-code',
      value: denomination,
      quantity: 1,
    }],
    payment_method: 'balance',
    auto_pay: true,
  });

  if (realInvoice && realInvoice.id) {
    return {
      success: true,
      data: {
        id: realInvoice.id,
        orderId: realInvoice.orders?.[0]?.id,
        productId,
        productName: realInvoice.orders?.[0]?.product_name || 'Gift Card',
        denomination,
        currency: 'USD',
        payment: {
          address: realInvoice.payment_address || '',
          amount: realInvoice.payment_amount || '0',
          chain,
          symbol: cryptoSymbolForChain(chain),
        },
        status: realInvoice.status || 'pending',
        createdAt: realInvoice.created_at || new Date().toISOString(),
      },
    };
  }

  // Fallback to mock
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
  // Try real API first (get redemption code for test product)
  // Official docs: use invoice.orders[0].id, not invoice.id
  const orderId = invoice.orderId || invoice.id;
  if (orderId) {
    const order = await apiGet<any>(`orders/${orderId}`);
    if (order && order.redemption_info) {
      return {
        code: order.redemption_info.code || 'TEST-CODE-1234',
        pin: order.redemption_info.pin,
      };
    }
  }

  // Fallback to mock
  await delay(2000);
  return { code: generateGiftCardCode() };
}

export function searchProductsByIntent(
  query: string,
  denomination?: number
): BitrefillProduct[] {
  // AI intent search always uses mock (client-side, fast)
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
