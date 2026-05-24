"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";

export function WatchWalletPage({ onBack }: { onBack: () => void }) {
  const [address, setAddress] = useState("");
  const [watching, setWatching] = useState(false);

  const watchList = [
    { label: "vitalik.eth", address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", balance: "~$8.2M" },
    { label: "hayden.eth", address: "0x50EC05ADe828147746aED54D222B09380Fe3C78C", balance: "~$1.1M" },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-5 py-4 flex items-center border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold mr-9">Watch Wallet</h1>
      </div>
      <div className="flex-1 px-5 py-6">
        <p className="text-sm text-gray-500 mb-4">Monitor any public Ethereum address without importing keys.</p>
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter address or ENS name"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="flex-1 bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <button
            onClick={() => address && setWatching(true)}
            className="px-5 py-3 identity-gradient text-white rounded-2xl font-semibold text-sm shadow-lg active:scale-[0.98] transition-transform"
          >
            Watch
          </button>
        </div>
        {watching && address && (
          <div className="mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-100 animate-fade-in-up">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">👁</div>
              <div>
                <p className="font-semibold text-gray-900">{address.slice(0, 6)}...{address.slice(-4)}</p>
                <p className="text-xs text-gray-400">Watching mode - read only</p>
              </div>
            </div>
          </div>
        )}
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">Popular Watches</p>
        <div className="space-y-2">
          {watchList.map((w, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm">
                {w.label[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">{w.label}</p>
                <p className="text-xs text-gray-400 font-mono">{w.address.slice(0, 10)}...{w.address.slice(-6)}</p>
              </div>
              <span className="text-sm font-medium text-gray-600">{w.balance}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
