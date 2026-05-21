"use client";

import { useState, useCallback } from "react";
import type {
  BitrefillProduct,
  BitrefillInvoice,
  CatalogFilters,
} from "@/types/bitrefill";
import { getProducts, createInvoice, simulatePaymentSuccess } from "@/lib/bitrefill-api";

export function useBitrefill() {
  const [products, setProducts] = useState<BitrefillProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = useCallback(async (filters: CatalogFilters) => {
    setLoading(true);
    setError("");
    try {
      const res = await getProducts(filters);
      if (res.success && res.data) {
        setProducts(res.data);
      } else {
        setError(res.error?.message || "Failed to fetch products");
        setProducts([]);
      }
    } catch (e: any) {
      setError(e.message || "Network error");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const makeInvoice = useCallback(
    async (
      productId: string,
      denomination: number,
      chain: string
    ): Promise<BitrefillInvoice | null> => {
      const res = await createInvoice(productId, denomination, chain);
      if (res.success && res.data) {
        return res.data;
      }
      throw new Error(res.error?.message || "Failed to create invoice");
    },
    []
  );

  const completePayment = useCallback(
    async (invoice: BitrefillInvoice): Promise<{ code: string; pin?: string }> => {
      return simulatePaymentSuccess(invoice);
    },
    []
  );

  return {
    products,
    loading,
    error,
    fetchProducts,
    makeInvoice,
    completePayment,
  };
}
