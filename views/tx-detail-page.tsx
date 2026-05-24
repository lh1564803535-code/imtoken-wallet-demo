"use client";

import { ArrowLeft, TrendingDown, Copy, ExternalLink } from "lucide-react";

export function TxDetailPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-5 py-4 flex items-center border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold mr-9">Transaction</h1>
      </div>
      <div className="flex-1 px-5 py-6">
        {/* Status */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingDown className="w-8 h-8 text-green-500 rotate-180" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900">+0.5 ETH</p>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm text-green-600 font-medium">Confirmed</span>
          </div>
        </div>
        {/* Details */}
        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">From</span>
            <span className="text-sm font-mono text-gray-700">0xefgh...1234</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">To</span>
            <span className="text-sm font-mono text-gray-700">0x1234...5678</span>
          </div>
          <div className="h-px bg-gray-200" />
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Date</span>
            <span className="text-sm text-gray-700">May 22, 2026 14:30</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Network</span>
            <span className="text-sm text-gray-700">Ethereum Mainnet</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Network Fee</span>
            <span className="text-sm text-gray-700">0.0012 ETH (~$3.50)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Nonce</span>
            <span className="text-sm text-gray-700">42</span>
          </div>
        </div>
        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button className="flex-1 bg-gray-100 text-gray-700 py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
            <Copy className="w-4 h-4" /> Copy Hash
          </button>
          <button className="flex-1 bg-gray-100 text-gray-700 py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
            <ExternalLink className="w-4 h-4" /> View on Explorer
          </button>
        </div>
      </div>
    </div>
  );
}
