"use client";

import { useState } from "react";
import { Loader2, X, ShieldCheck } from "lucide-react";
import type { BitrefillInvoice } from "@/types/bitrefill";

interface Props {
  invoice: BitrefillInvoice;
  onConfirm: () => void;
  onCancel: () => void;
  signing: boolean;
  error: string;
}

export function PaymentConfirm({ invoice, onConfirm, onCancel, signing, error }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in-up">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-[#111d4a]/10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#007fff]" />
            <h3 className="text-base font-semibold text-[#111d4a]">Confirm Payment</h3>
          </div>
          <button
            onClick={onCancel}
            disabled={signing}
            className="p-1.5 rounded-full hover:bg-[#f0f2f5] transition-colors disabled:opacity-50"
          >
            <X className="h-4 w-4 text-[#99a1af]" />
          </button>
        </div>

        {/* Details */}
        <div className="space-y-3 mb-6">
          <div className="rounded-xl bg-[#f8f9fa] ring-1 ring-[#111d4a]/10 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#99a1af]">Product</span>
              <span className="font-medium text-[#111d4a]">{invoice.productName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#99a1af]">Amount</span>
              <span className="font-medium text-[#111d4a]">
                {invoice.currency === "CNY" ? "¥" : "$"}{invoice.denomination} {invoice.currency}
              </span>
            </div>
            <div className="border-t border-[#e0e3e8] my-2" />
            <div className="flex justify-between text-sm">
              <span className="text-[#99a1af]">Pay</span>
              <span className="font-semibold text-[#007fff]">
                {invoice.payment.amount} {invoice.payment.symbol}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#99a1af]">Chain</span>
              <span className="font-medium text-[#111d4a]">{invoice.payment.chain}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-[#99a1af]">Recipient Address</span>
            <code className="block rounded-xl bg-[#f8f9fa] ring-1 ring-[#111d4a]/10 px-3 py-2 text-[10px] font-mono break-all text-[#111d4a]">
              {invoice.payment.address}
            </code>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-full bg-[#f0f7ff] ring-1 ring-[#007fff]/10 w-fit">
            <span className="text-[10px] text-[#007fff] font-medium">
              Demo mode — transaction will be signed but NOT broadcast
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-destructive mb-3">{error}</p>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={signing}
            className="flex-1 py-3 rounded-full ring-1 ring-[#e0e3e8] text-sm font-medium text-[#111d4a] hover:bg-[#f0f2f5] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={signing}
            className="flex-1 py-3 rounded-full bg-[#007fff] text-white text-sm font-medium hover:bg-[#006cd9] transition-colors disabled:opacity-50"
            style={{ boxShadow: "0 4px 14px 0 color-mix(in srgb, #007fff 20%, transparent)" }}
          >
            {signing ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing...
              </span>
            ) : (
              "Confirm & Sign"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
