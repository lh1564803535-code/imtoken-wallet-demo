"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductCard } from "./ProductCard";
import type { BitrefillProduct, CatalogFilters, BitrefillCategory } from "@/types/bitrefill";
import { COUNTRIES, CATEGORIES } from "@/lib/bitrefill-mock-data";

interface Props {
  products: BitrefillProduct[];
  loading: boolean;
  error: string;
  onFetch: (filters: CatalogFilters) => void;
  onSelectProduct: (product: BitrefillProduct) => void;
}

export function GiftCardShop({ products, loading, error, onFetch, onSelectProduct }: Props) {
  const [country, setCountry] = useState("CN");
  const [category, setCategory] = useState<BitrefillCategory | "all">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    onFetch({ country, category, search });
  }, [country, category, search, onFetch]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="space-y-3">
        {/* Country + Search row */}
        <div className="flex gap-2">
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="rounded-full px-3 py-2 text-xs bg-[#f8f9fa] ring-1 ring-[#111d4a]/10 text-[#111d4a] focus:outline-none focus:ring-2 focus:ring-[#007fff]/30"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#99a1af]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search gift cards..."
              className="rounded-full pl-9 text-xs h-9"
            />
          </div>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value as BitrefillCategory | "all")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                category === cat.value
                  ? "bg-[#007fff] text-white"
                  : "bg-[#f8f9fa] text-[#111d4a] ring-1 ring-[#111d4a]/10 hover:ring-[#007fff]/30"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-[#007fff]" />
          <span className="ml-2 text-sm text-[#99a1af]">Loading products...</span>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="rounded-xl bg-red-50 ring-1 ring-red-200 p-4 text-center">
          <p className="text-sm text-red-700 mb-2">{error}</p>
          <button
            onClick={() => onFetch({ country, category, search })}
            className="flex items-center gap-1 mx-auto px-3 py-1.5 rounded-full text-xs text-red-600 hover:bg-red-100 transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && products.length === 0 && (
        <div className="rounded-xl bg-[#f8f9fa] ring-1 ring-[#111d4a]/10 p-6 text-center">
          <p className="text-sm text-[#99a1af]">
            No products found for the current filters. Try adjusting your search or country.
          </p>
        </div>
      )}

      {/* Product grid */}
      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => onSelectProduct(product)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
