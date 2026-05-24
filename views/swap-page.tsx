"use client";

import { useState } from "react";
import { ArrowLeft, ArrowLeftRight } from "lucide-react";

export function SwapPage({ onBack }: { onBack: () => void }) {
  const [fromAmount, setFromAmount] = useState("");
  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("BTC");
  const [slippage, setSlippage] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);

  const tokenList = [
    { symbol: "ETH", color: "bg-blue-500", balance: "0.5" },
    { symbol: "BTC", color: "bg-orange-500", balance: "0.001" },
    { symbol: "USDT", color: "bg-green-500", balance: "200" },
    { symbol: "SOL", color: "bg-violet-500", balance: "2.5" },
    { symbol: "MATIC", color: "bg-purple-500", balance: "150" },
  ];

  const rates: Record<string, number> = {
    "ETH->BTC": 0.052, "ETH->USDT": 2691.34, "ETH->SOL": 15.6, "ETH->MATIC": 3166.3,
    "BTC->ETH": 19.23, "BTC->USDT": 51756.5, "BTC->SOL": 300, "BTC->MATIC": 60889,
    "USDT->ETH": 0.00037, "USDT->BTC": 0.000019, "USDT->SOL": 0.0058, "USDT->MATIC": 1.176,
  };

  const rate = rates[`${fromToken}->${toToken}`] || 1;
  const toAmount = fromAmount ? (parseFloat(fromAmount) * rate).toFixed(6) : "";

  const handleSwap = () => {
    const tmp = fromToken;
    setFromToken(toToken);
    setToToken(tmp);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-5 py-4 flex items-center border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold mr-9">Swap</h1>
        <button onClick={() => setShowSettings(!showSettings)} className="absolute right-5 p-2 rounded-xl hover:bg-gray-50">
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </button>
      </div>
      <div className="flex-1 px-5 py-6">
        {/* Slippage settings */}
        {showSettings && (
          <div className="mb-5 p-4 bg-gray-50 rounded-2xl border border-gray-100 animate-fade-in-up">
            <p className="text-sm font-medium text-gray-700 mb-3">Slippage Tolerance</p>
            <div className="flex gap-2">
              {[0.1, 0.5, 1.0].map((s) => (
                <button
                  key={s}
                  onClick={() => setSlippage(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    slippage === s ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {s}%
                </button>
              ))}
            </div>
          </div>
        )}
        {/* From */}
        <div className="bg-gray-50 rounded-3xl p-5 border border-gray-100 mb-2 relative">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">You pay</span>
            <select
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 border border-gray-100 text-sm font-semibold focus:outline-none cursor-pointer"
            >
              {tokenList.map(t => <option key={t.symbol} value={t.symbol}>{t.symbol}</option>)}
            </select>
          </div>
          <input
            type="text"
            placeholder="0.00"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            className="w-full text-3xl font-bold bg-transparent focus:outline-none placeholder:text-gray-200"
          />
          <p className="text-sm text-gray-400 mt-1">Balance: {tokenList.find(t => t.symbol === fromToken)?.balance} {fromToken}</p>
        </div>
        {/* Swap arrow */}
        <div className="flex justify-center -my-4 relative z-10">
          <button onClick={handleSwap} className="w-10 h-10 bg-white rounded-full border border-gray-100 shadow-md flex items-center justify-center hover:bg-gray-50 active:scale-95 active:rotate-180 transition-all duration-300">
            <ArrowLeftRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        {/* To */}
        <div className="bg-gray-50 rounded-3xl p-5 border border-gray-100 mt-0">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">You receive</span>
            <select
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
              className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 border border-gray-100 text-sm font-semibold focus:outline-none cursor-pointer"
            >
              {tokenList.filter(t => t.symbol !== fromToken).map(t => <option key={t.symbol} value={t.symbol}>{t.symbol}</option>)}
            </select>
          </div>
          <input
            type="text"
            placeholder="0.00"
            value={toAmount}
            readOnly
            className="w-full text-3xl font-bold bg-transparent focus:outline-none placeholder:text-gray-200 text-gray-600"
          />
          <p className="text-sm text-gray-400 mt-1">Balance: {tokenList.find(t => t.symbol === toToken)?.balance} {toToken}</p>
        </div>
        {/* Info */}
        <div className="mt-5 space-y-2.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Rate</span>
            <span className="text-gray-700">1 {fromToken} ≈ {rate.toFixed(6)} {toToken}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Network Fee</span>
            <span className="text-gray-700">~$3.50</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Slippage</span>
            <span className="text-gray-700">{slippage}%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Route</span>
            <span className="text-gray-700 text-xs">{fromToken} → {toToken} via Uniswap V3</span>
          </div>
        </div>
        <div className="mt-8">
          <button className="w-full identity-gradient text-white py-4 rounded-2xl font-semibold text-lg shadow-lg active:scale-[0.98] transition-transform">
            Review Swap
          </button>
        </div>
      </div>
    </div>
  );
}
