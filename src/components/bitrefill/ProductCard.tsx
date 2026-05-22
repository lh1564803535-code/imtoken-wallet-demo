"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { BitrefillProduct } from "@/types/bitrefill";

interface Props {
  product: BitrefillProduct;
  onClick: () => void;
}

const categoryEmoji: Record<string, string> = {
  "e-commerce": "🛒",
  food: "🍔",
  gaming: "🎮",
  "phone-topup": "📱",
  entertainment: "🎬",
  travel: "🚗",
  other: "🎁",
};

export function ProductCard({ product, onClick }: Props) {
  const [imgError, setImgError] = useState(false);
  const minDenom = product.denominations[0];
  const maxDenom = product.denominations[product.denominations.length - 1];
  const emoji = categoryEmoji[product.category] || "🎁";
  const showImage = product.imageUrl && !imgError;

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl ring-1 ring-[#111d4a]/10 bg-white p-4 hover:ring-[#007fff]/30 hover:shadow-md transition-all duration-200"
      style={{ boxShadow: "0 1px 4px 0 color-mix(in srgb, #111d4a 3%, transparent)" }}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#f0f7ff] flex items-center justify-center text-lg flex-shrink-0 overflow-hidden">
          {showImage ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-contain"
              onError={() => setImgError(true)}
            />
          ) : (
            emoji
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-[#111d4a] truncate">
              {product.name}
            </h4>
            {product.discount ? (
              <Badge variant="secondary" className="text-[10px] rounded-full bg-emerald-50 text-emerald-700 border-emerald-200">
                -{Math.round(product.discount * 100)}%
              </Badge>
            ) : null}
          </div>
          <p className="text-xs text-[#99a1af] mt-0.5 truncate">
            {product.description}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-medium text-[#111d4a]">
              {product.currency} {minDenom}–{maxDenom}
            </span>
            <div className="flex gap-1">
              {product.supportedCrypto.slice(0, 3).map((c) => (
                <span
                  key={c}
                  className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#f8f9fa] text-[#99a1af] ring-1 ring-[#111d4a]/5"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
