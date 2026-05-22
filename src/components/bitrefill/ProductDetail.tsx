"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import type { BitrefillProduct } from "@/types/bitrefill";

const categoryEmoji: Record<string, string> = {
  "e-commerce": "🛒",
  food: "🍔",
  gaming: "🎮",
  "phone-topup": "📱",
  entertainment: "🎬",
  travel: "🚗",
  other: "🎁",
};

interface Props {
  product: BitrefillProduct;
  onBack: () => void;
  onBuy: (denomination: number, chain: string) => void;
  disabled: boolean;
  defaultChain?: string;
}

const CHAINS = [
  { value: "ETHEREUM", label: "ETH", icon: "⟠" },
  { value: "BITCOIN", label: "BTC", icon: "₿" },
  { value: "TRON", label: "TRX", icon: "◎" },
];

export function ProductDetail({ product, onBack, onBuy, disabled, defaultChain = "ETHEREUM" }: Props) {
  const [selectedDenom, setSelectedDenom] = useState(product.denominations[0]);
  const [selectedChain, setSelectedChain] = useState(defaultChain);
  const [imgError, setImgError] = useState(false);
  const emoji = categoryEmoji[product.category] || "🎁";
  const showImage = product.imageUrl && !imgError;

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-xs text-[#007fff] hover:text-[#006cd9] transition-colors"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to catalog
      </button>

      <div className="rounded-xl ring-1 ring-[#111d4a]/10 bg-white p-6" style={{ boxShadow: "0 2px 8px 0 color-mix(in srgb, #111d4a 4%, transparent)" }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#f0f7ff] flex items-center justify-center text-2xl overflow-hidden">
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
          <div>
            <h3 className="text-base font-semibold text-[#111d4a]">{product.name}</h3>
            <p className="text-xs text-[#99a1af]">{product.description}</p>
          </div>
          {product.discount ? (
            <Badge variant="secondary" className="ml-auto text-xs rounded-full bg-emerald-50 text-emerald-700">
              Save {Math.round(product.discount * 100)}%
            </Badge>
          ) : null}
        </div>

        {/* Denomination selector */}
        <div className="space-y-2 mb-4">
          <span className="text-xs font-medium text-[#111d4a]">Select Amount ({product.currency})</span>
          <div className="flex flex-wrap gap-2">
            {product.denominations.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDenom(d)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedDenom === d
                    ? "bg-[#007fff] text-white shadow-md"
                    : "bg-[#f8f9fa] text-[#111d4a] ring-1 ring-[#111d4a]/10 hover:ring-[#007fff]/30"
                }`}
              >
                {product.currency === "CNY" ? "¥" : "$"}{d}
              </button>
            ))}
          </div>
        </div>

        {/* Chain selector */}
        <div className="space-y-2 mb-6">
          <span className="text-xs font-medium text-[#111d4a]">Pay with</span>
          <div className="flex gap-2">
            {CHAINS.filter((c) =>
              product.supportedCrypto.includes(c.label)
            ).map((c) => (
              <button
                key={c.value}
                onClick={() => setSelectedChain(c.value)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedChain === c.value
                    ? "bg-[#007fff] text-white shadow-md"
                    : "bg-[#f8f9fa] text-[#111d4a] ring-1 ring-[#111d4a]/10 hover:ring-[#007fff]/30"
                }`}
              >
                <span>{c.icon}</span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Buy button */}
        <button
          onClick={() => onBuy(selectedDenom, selectedChain)}
          disabled={disabled}
          className="w-full py-3 rounded-full bg-[#007fff] text-white text-sm font-medium hover:bg-[#006cd9] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ boxShadow: "0 4px 14px 0 color-mix(in srgb, #007fff 20%, transparent)" }}
        >
          <ShoppingCart className="h-4 w-4" />
          Buy {product.currency === "CNY" ? "¥" : "$"}{selectedDenom} {product.name}
        </button>

        {disabled && (
          <p className="text-xs text-[#99a1af] text-center mt-2">
            Create a wallet first to make purchases
          </p>
        )}
      </div>
    </div>
  );
}
