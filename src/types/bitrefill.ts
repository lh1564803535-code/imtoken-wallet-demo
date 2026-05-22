export interface BitrefillProduct {
  id: string;
  name: string;
  description: string;
  country: string;
  category: BitrefillCategory;
  currency: string;
  denominations: number[];
  range?: { min: number; max: number; step: number };
  supportedCrypto: string[];
  discount?: number;
  imageUrl?: string;
  inStock: boolean;
}

export type BitrefillCategory =
  | "food"
  | "e-commerce"
  | "gaming"
  | "phone-topup"
  | "entertainment"
  | "travel"
  | "other";

export interface BitrefillInvoice {
  id: string;
  orderId?: string;
  productId: string;
  productName: string;
  denomination: number;
  currency: string;
  payment: {
    address: string;
    amount: string;
    chain: string;
    symbol: string;
  };
  status: "pending" | "paid" | "complete" | "failed";
  createdAt: string;
}

export interface StoredGiftCard {
  id: string;
  productName: string;
  denomination: number;
  currency: string;
  code: string;
  pin?: string;
  chain: string;
  txSignature: string;
  purchasedAt: string;
}

export interface PurchaseIntent {
  productType: string;
  denomination?: number;
  currency?: string;
  raw: string;
}

export interface BitrefillResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    type: "network" | "timeout" | "api" | "config";
    status?: number;
    message: string;
  };
}

export interface CatalogFilters {
  country: string;
  category: BitrefillCategory | "all";
  search: string;
}
