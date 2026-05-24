"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";

const NETWORKS = [
  { name: "Ethereum", symbol: "ETH", color: "bg-blue-500", chainId: 1, selected: true },
  { name: "Polygon", symbol: "MATIC", color: "bg-purple-500", chainId: 137 },
  { name: "Arbitrum", symbol: "ETH", color: "bg-blue-400", chainId: 42161 },
  { name: "Optimism", symbol: "ETH", color: "bg-red-400", chainId: 10 },
  { name: "Base", symbol: "ETH", color: "bg-blue-600", chainId: 8453 },
  { name: "BSC", symbol: "BNB", color: "bg-yellow-500", chainId: 56 },
  { name: "Avalanche", symbol: "AVAX", color: "bg-red-500", chainId: 43114 },
  { name: "Tron", symbol: "TRX", color: "bg-red-600", chainId: 0 },
];

export function NetworkSwitchPage({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState(1);
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-5 py-4 flex items-center border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold mr-9">Networks</h1>
      </div>
      <div className="flex-1 px-5 py-5">
        <div className="space-y-2">
          {NETWORKS.map((net, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                selected === i ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20' : 'border-gray-100 hover:bg-gray-50'
              }`}
            >
              <div className={`w-11 h-11 ${net.color} rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0`}>
                {net.symbol.slice(0, 2)}
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-900">{net.name}</p>
                <p className="text-xs text-gray-400">Chain ID: {net.chainId}</p>
              </div>
              {selected === i && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
