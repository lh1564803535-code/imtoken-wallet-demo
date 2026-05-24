"use client";

import { useState } from "react";
import { ArrowLeft, QrCode, ChevronRight } from "lucide-react";
import type { WalletData } from "@/lib/tcx";

export function SendPage({ onBack, wallet }: { onBack: () => void; wallet: WalletData | null }) {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedToken] = useState("ETH");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-5 py-4 flex items-center border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold mr-9">Send</h1>
      </div>
      <div className="flex-1 px-5 py-6">
        <div className="space-y-5">
          {/* Token 选择 */}
          <div>
            <label className="text-sm font-medium text-gray-500 mb-2 block">Asset</label>
            <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">ET</div>
              <div>
                <p className="font-semibold text-gray-900">Ethereum</p>
                <p className="text-sm text-gray-400">Balance: 0.5 ETH</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 ml-auto" />
            </div>
          </div>
          {/* 收款地址 */}
          <div>
            <label className="text-sm font-medium text-gray-500 mb-2 block">To</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter address or ENS name"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-gray-50 rounded-2xl p-4 pr-12 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-gray-100">
                <QrCode className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
          {/* 金额 */}
          <div>
            <label className="text-sm font-medium text-gray-500 mb-2 block">Amount</label>
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-center">
              <input
                type="text"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full text-center text-4xl font-bold text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-200"
              />
              <p className="text-sm text-gray-400 mt-2">≈ $0.00 USD</p>
            </div>
            <div className="flex justify-center gap-2 mt-3">
              {["25%", "50%", "MAX"].map((label) => (
                <button key={label} className="px-4 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-gray-600 hover:bg-gray-200 active:bg-gray-300 transition-colors">
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10">
          <button
            disabled={!address || !amount}
            className="w-full identity-gradient disabled:opacity-40 disabled:shadow-none text-white py-4 rounded-2xl font-semibold text-lg shadow-lg active:scale-[0.98] transition-all"
          >
            Review Send
          </button>
        </div>
      </div>
    </div>
  );
}
