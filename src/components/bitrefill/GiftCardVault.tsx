"use client";

import { useState } from "react";
import { Copy, Check, Trash2, Download, CreditCard } from "lucide-react";
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

  if (cards.length === 0) {
    return (
      <div className="rounded-xl ring-1 ring-[#111d4a]/10 bg-white p-6 text-center" style={{ boxShadow: "0 2px 8px 0 color-mix(in srgb, #111d4a 4%, transparent)" }}>
        <CreditCard className="h-10 w-10 text-[#99a1af] mx-auto mb-3" />
        <h4 className="text-sm font-semibold text-[#111d4a] mb-1">No Gift Cards Yet</h4>
        <p className="text-xs text-[#99a1af]">
          Purchase gift cards from the catalog and they will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="rounded-xl ring-1 ring-[#111d4a]/10 bg-white p-4 flex items-center justify-between" style={{ boxShadow: "0 1px 4px 0 color-mix(in srgb, #111d4a 3%, transparent)" }}>
        <div>
          <p className="text-xs text-[#99a1af]">Total Gift Card Value</p>
          <div className="flex gap-3 mt-1">
            {Object.entries(totalByDenomination).map(([currency, total]) => (
              <span key={currency} className="text-sm font-semibold text-[#111d4a]">
                {currency === "CNY" ? "¥" : "$"}{total} {currency}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={onExport}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs text-[#007fff] hover:bg-[#f0f7ff] ring-1 ring-[#007fff]/20 transition-colors"
        >
          <Download className="h-3 w-3" />
          Export
        </button>
      </div>

      {/* Cards list */}
      <div className="space-y-2">
        {cards.map((card) => (
          <div
            key={card.id}
            className="rounded-xl ring-1 ring-[#111d4a]/10 bg-white p-4"
            style={{ boxShadow: "0 1px 4px 0 color-mix(in srgb, #111d4a 3%, transparent)" }}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="text-sm font-semibold text-[#111d4a]">{card.productName}</h4>
                <p className="text-xs text-[#99a1af]">
                  {card.currency === "CNY" ? "¥" : "$"}{card.denomination} {card.currency} · {card.chain}
                </p>
              </div>
              <span className="text-[10px] text-[#99a1af]">
                {new Date(card.purchasedAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-lg bg-[#f8f9fa] ring-1 ring-[#111d4a]/10 px-3 py-2 text-xs font-mono text-[#111d4a] tracking-wider">
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
              <button
                onClick={() => handleDelete(card.id)}
                className={`p-2 rounded-full transition-colors ${
                  confirmDelete === card.id
                    ? "bg-red-50 text-red-500"
                    : "hover:bg-[#f0f2f5] text-[#99a1af]"
                }`}
                title={confirmDelete === card.id ? "Click again to confirm" : "Delete"}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            {copiedId === card.id && (
              <p className="text-[10px] text-emerald-600 mt-1">Copied!</p>
            )}
            {confirmDelete === card.id && (
              <p className="text-[10px] text-red-500 mt-1">Click delete again to confirm</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
