"use client";

import { useState } from "react";
import { Eye, Copy } from "lucide-react";

export function MnemonicDisplayPage({ onComplete, mnemonic }: { onComplete: () => void; mnemonic: string }) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const words = mnemonic.split(" ");

  const handleCopy = () => {
    navigator.clipboard.writeText(mnemonic).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-5 py-4 flex items-center border-b border-gray-100">
        <div className="w-9" />
        <h1 className="flex-1 text-center text-lg font-semibold">Secret Recovery Phrase</h1>
        <div className="w-9" />
      </div>
      <div className="flex-1 px-5 py-6 flex flex-col">
        {/* Warning */}
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-lg mt-0.5">⚠️</span>
            <div>
              <p className="font-semibold text-red-700 text-sm mb-1">Write this down and store it safely</p>
              <p className="text-xs text-red-600">This is the ONLY way to recover your wallet. Never share it with anyone. Never take a screenshot.</p>
            </div>
          </div>
        </div>

        {/* Mnemonic grid */}
        {revealed ? (
          <div className="animate-fade-in-up">
            <div className="grid grid-cols-3 gap-2.5 mb-6">
              {words.map((word, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-5 text-right">{i + 1}.</span>
                  <span className="text-sm font-semibold text-gray-900">{word}</span>
                </div>
              ))}
            </div>
            <button onClick={handleCopy} className="w-full flex items-center justify-center gap-2 py-3 bg-gray-100 rounded-2xl text-sm font-medium text-gray-700 hover:bg-gray-200 active:bg-gray-300 transition-colors mb-4">
              {copied ? <><span className="text-green-500">✓</span> Copied to clipboard</> : <><Copy className="w-4 h-4" /> Copy to clipboard</>}
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Eye className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-500 text-center mb-6 max-w-xs">Tap below to reveal your 12-word recovery phrase. Make sure no one is watching.</p>
            <button onClick={() => setRevealed(true)} className="identity-gradient text-white px-8 py-4 rounded-2xl font-semibold shadow-lg active:scale-[0.98] transition-transform">
              Reveal Secret Phrase
            </button>
          </div>
        )}

        {/* Next button */}
        {revealed && (
          <div className="mt-auto pt-4">
            <button onClick={onComplete} className="w-full identity-gradient text-white py-4 rounded-2xl font-semibold text-lg shadow-lg active:scale-[0.98] transition-transform">
              I've Written It Down
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
