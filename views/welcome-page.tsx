"use client";

import { Wallet, Download, Shield } from "lucide-react";

export function WelcomePage({ onCreate, onImport }: { onCreate: () => void; onImport: () => void }) {
  return (
    <div className="min-h-screen flex flex-col bg-white overflow-hidden">
      {/* 彩虹渐变背景 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50 via-blue-50 to-white" />
        {/* 装饰性彩虹光圈 */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-20 identity-gradient blur-3xl" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative mb-8">
            <div className="w-28 h-28 rounded-[2rem] identity-gradient flex items-center justify-center shadow-xl">
              <div className="w-24 h-24 bg-white rounded-[1.5rem] flex items-center justify-center">
                <Wallet className="w-12 h-12 text-blue-500" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">AI Agent Wallet</h1>
          <p className="text-gray-500 mb-14 text-base">Experience Crypto in Color</p>
          <div className="w-full max-w-sm space-y-3">
            <button onClick={onCreate} className="w-full identity-gradient text-white py-4 rounded-2xl font-semibold text-lg shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-transform">
              Create New Wallet
            </button>
            <button onClick={onImport} className="w-full bg-white text-gray-900 py-4 rounded-2xl font-semibold text-lg border border-gray-200 flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform hover:bg-gray-50">
              <Download className="w-5 h-5" /> Import Existing Wallet
            </button>
          </div>
        </div>
      </div>
      <div className="px-6 py-6 bg-white">
        <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
          <div className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /><span>Local Encryption</span></div>
          <div className="w-1 h-1 rounded-full bg-gray-300" />
          <span>ETH / BTC / TRON</span>
          <div className="w-1 h-1 rounded-full bg-gray-300" />
          <span>Token Core</span>
        </div>
      </div>
    </div>
  );
}
