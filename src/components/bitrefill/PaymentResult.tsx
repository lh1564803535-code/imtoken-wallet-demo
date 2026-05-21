"use client";

import { useState, useEffect } from "react";
import { Check, Copy, PartyPopper } from "lucide-react";

interface Props {
  productName: string;
  denomination: number;
  currency: string;
  code: string;
  txSignature: string;
  onDone: () => void;
}

export function PaymentResult({
  productName,
  denomination,
  currency,
  code,
  txSignature,
  onDone,
}: Props) {
  const [codeCopied, setCodeCopied] = useState(false);
  const [txCopied, setTxCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const copyTx = () => {
    navigator.clipboard.writeText(txSignature);
    setTxCopied(true);
    setTimeout(() => setTxCopied(false), 2000);
  };

  return (
    <div className="relative rounded-xl ring-1 ring-[#111d4a]/10 bg-white p-6 animate-fade-in-up overflow-hidden" style={{ boxShadow: "0 2px 8px 0 color-mix(in srgb, #111d4a 4%, transparent)" }}>
      {/* Confetti celebration */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="confetti" style={{ left: '10%', background: '#007fff', animationDuration: '2s' }} />
          <div className="confetti" style={{ left: '20%', background: '#f5c84c', animationDuration: '2.2s', animationDelay: '0.1s' }} />
          <div className="confetti" style={{ left: '30%', background: '#ff6b6b', animationDuration: '1.8s', animationDelay: '0.2s' }} />
          <div className="confetti" style={{ left: '40%', background: '#0cc5ff', animationDuration: '2.4s', animationDelay: '0.15s' }} />
          <div className="confetti" style={{ left: '50%', background: '#007fff', animationDuration: '2.1s', animationDelay: '0.3s' }} />
          <div className="confetti" style={{ left: '60%', background: '#f5c84c', animationDuration: '1.9s', animationDelay: '0.05s' }} />
          <div className="confetti" style={{ left: '70%', background: '#ff6b6b', animationDuration: '2.3s', animationDelay: '0.25s' }} />
          <div className="confetti" style={{ left: '80%', background: '#0cc5ff', animationDuration: '2s', animationDelay: '0.35s' }} />
          <div className="confetti" style={{ left: '90%', background: '#007fff', animationDuration: '2.2s', animationDelay: '0.4s' }} />
        </div>
      )}
      {/* Success header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-emerald-50 ring-2 ring-emerald-200 flex items-center justify-center mx-auto mb-3">
          <PartyPopper className="h-8 w-8 text-emerald-600" />
        </div>
        <h3 className="text-lg font-semibold text-[#111d4a]">Purchase Complete!</h3>
        <p className="text-sm text-[#99a1af] mt-1">
          {productName} — {currency === "CNY" ? "¥" : "$"}{denomination}
        </p>
      </div>

      {/* Gift card code */}
      <div className="space-y-2 mb-4">
        <span className="text-xs font-medium text-[#111d4a]">Your Gift Card Code</span>
        <div className="flex items-center gap-2">
          <code className="flex-1 rounded-xl bg-emerald-50 ring-1 ring-emerald-200 px-4 py-3 text-base font-mono font-bold text-emerald-800 text-center tracking-wider">
            {code}
          </code>
          <button
            onClick={copyCode}
            className="p-2.5 rounded-full hover:bg-[#f0f2f5] ring-1 ring-[#111d4a]/10 transition-colors"
          >
            {codeCopied ? (
              <Check className="h-4 w-4 text-emerald-500" />
            ) : (
              <Copy className="h-4 w-4 text-[#99a1af]" />
            )}
          </button>
        </div>
        {codeCopied && (
          <p className="text-xs text-emerald-600 text-center">Copied to clipboard!</p>
        )}
      </div>

      {/* Signed transaction */}
      <div className="space-y-1.5 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#99a1af]">Signed Transaction (proof)</span>
          <button
            onClick={copyTx}
            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs hover:bg-[#f0f2f5] transition-colors"
          >
            {txCopied ? (
              <>
                <Check className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-600">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 text-[#99a1af]" />
                <span className="text-[#99a1af]">Copy</span>
              </>
            )}
          </button>
        </div>
        <code className="block rounded-xl bg-[#f8f9fa] ring-1 ring-[#111d4a]/10 px-3 py-2 text-[10px] font-mono break-all text-[#111d4a] max-h-20 overflow-auto">
          {txSignature}
        </code>
      </div>

      {/* Done button */}
      <button
        onClick={onDone}
        className="w-full py-3 rounded-full bg-[#007fff] text-white text-sm font-medium hover:bg-[#006cd9] transition-colors"
        style={{ boxShadow: "0 4px 14px 0 color-mix(in srgb, #007fff 20%, transparent)" }}
      >
        Done — View My Gift Cards
      </button>
    </div>
  );
}
