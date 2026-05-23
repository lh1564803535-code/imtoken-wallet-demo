"use client";

import { useState } from "react";
import { Copy, Check, Trash2, Download, CreditCard, ShoppingBag, Eye, EyeOff, Calendar, Link2 } from "lucide-react";
import type { StoredGiftCard } from "@/types/bitrefill";

interface Props {
  cards: StoredGiftCard[];
  totalByDenomination: Record<string, number>;
  onDelete: (id: string) => void;
  onExport: () => void;
}

export function GiftCardVault({ cards, totalByDenomination, onDelete, onExport }: Props) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [showPin, setShowPin] = useState<Record<string, boolean>>({});

  const copyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    if (confirmDelete === id) {
      onDelete(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  const togglePin = (id: string) => {
    setShowPin((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (cards.length === 0) {
    return (
      <div className="rounded-xl ring-1 ring-[#111d4a]/10 bg-gradient-to-b from-white to-[#f8fbff] p-8 text-center" style={{ boxShadow: "0 2px 8px 0 color-mix(in srgb, #111d4a 4%, transparent)" }}>
        <div className="w-16 h-16 rounded-2xl bg-[#f0f7ff] flex items-center justify-center mx-auto mb-4">
          <CreditCard className="h-8 w-8 text-[#007fff]" />
        </div>
        <h4 className="text-sm font-semibold text-[#111d4a] mb-1">Your Gift Card Vault is Empty</h4>
        <p className="text-xs text-[#99a1af] mb-4">
          Buy gift cards with crypto and store them securely here. All codes are AES-encrypted locally.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200">Amazon</span>
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-200">Steam</span>
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-red-50 text-red-700 ring-1 ring-red-200">Netflix</span>
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200">eSIM</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="rounded-xl ring-1 ring-[#111d4a]/10 bg-gradient-to-r from-white to-[#f0f7ff] p-4 flex items-center justify-between" style={{ boxShadow: "0 1px 4px 0 color-mix(in srgb, #111d4a 3%, transparent)" }}>
        <div>
          <p className="text-xs text-[#99a1af]">Vault Balance</p>
          <div className="flex gap-3 mt-1">
            {Object.entries(totalByDenomination).map(([currency, total]) => (
              <span key={currency} className="text-base font-bold text-[#111d4a]">
                {currency === "CNY" ? "\u00a5" : "$"}{total}
                <span className="text-xs font-normal text-[#99a1af] ml-1">{currency}</span>
              </span>
            ))}
          </div>
          <p className="text-[10px] text-[#99a1af] mt-1">{cards.length} card{cards.length !== 1 ? "s" : ""} in vault</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onExport}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs text-[#007fff] hover:bg-[#f0f7ff] ring-1 ring-[#007fff]/20 transition-colors"
          >
            <Download className="h-3 w-3" />
            Export
          </button>
        </div>
      </div>

      {/* Cards list */}
      <div className="space-y-2">
        {cards.map((card) => (
          <div
            key={card.id}
            className="rounded-xl ring-1 ring-[#111d4a]/10 bg-white overflow-hidden transition-shadow hover:shadow-md"
            style={{ boxShadow: "0 1px 4px 0 color-mix(in srgb, #111d4a 3%, transparent)" }}
          >
            {/* Card header */}
            <div className="px-4 py-3 bg-gradient-to-r from-[#f8f9fa] to-white border-b border-[#e0e3e8]/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#007fff]/10 flex items-center justify-center">
                  <ShoppingBag className="h-4 w-4 text-[#007fff]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#111d4a]">{card.productName}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-[#99a1af]">
                    <span>{card.currency === "CNY" ? "\u00a5" : "$"}{card.denomination} {card.currency}</span>
                    <span>&middot;</span>
                    <span className="flex items-center gap-0.5">
                      <Link2 className="h-2.5 w-2.5" />
                      {card.chain}
                    </span>
                    <span>&middot;</span>
                    <span className="flex items-center gap-0.5">
                      <Calendar className="h-2.5 w-2.5" />
                      {new Date(card.purchasedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card body */}
            <div className="px-4 py-3 space-y-2">
              {/* Redemption code */}
              <div>
                <p className="text-[10px] text-[#99a1af] mb-1">Redemption Code</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 rounded-lg bg-[#f8f9fa] ring-1 ring-[#111d4a]/10 px-3 py-2 text-xs font-mono text-[#111d4a] tracking-wider select-all">
                    {card.code}
                  </code>
                  <button
                    onClick={() => copyCode(card.id, card.code)}
                    className="p-2 rounded-full hover:bg-[#f0f2f5] transition-colors"
                    title="Copy code"
                  >
                    {copiedId === card.id ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-[#99a1af]" />
                    )}
                  </button>
                </div>
                {copiedId === card.id && (
                  <p className="text-[10px] text-emerald-600 mt-1">Copied to clipboard!</p>
                )}
              </div>

              {/* PIN (if available) */}
              {card.pin && (
                <div>
                  <p className="text-[10px] text-[#99a1af] mb-1">PIN</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 rounded-lg bg-[#f8f9fa] ring-1 ring-[#111d4a]/10 px-3 py-2 text-xs font-mono text-[#111d4a] tracking-wider">
                      {showPin[card.id] ? card.pin : "\u2022\u2022\u2022\u2022\u2022\u2022"}
                    </code>
                    <button
                      onClick={() => togglePin(card.id)}
                      className="p-2 rounded-full hover:bg-[#f0f2f5] transition-colors"
                      title={showPin[card.id] ? "Hide PIN" : "Show PIN"}
                    >
                      {showPin[card.id] ? (
                        <EyeOff className="h-3.5 w-3.5 text-[#99a1af]" />
                      ) : (
                        <Eye className="h-3.5 w-3.5 text-[#99a1af]" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end pt-1">
                <button
                  onClick={() => handleDelete(card.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] transition-colors ${
                    confirmDelete === card.id
                      ? "bg-red-50 text-red-500 ring-1 ring-red-200"
                      : "text-[#99a1af] hover:bg-[#f0f2f5]"
                  }`}
                >
                  <Trash2 className="h-3 w-3" />
                  {confirmDelete === card.id ? "Confirm delete" : "Remove"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}