"use client";

import { useState } from "react";
import { ArrowLeft, TrendingUp, TrendingDown, Send } from "lucide-react";
import { getPriceHistory, type Timeframe } from "@/lib/prices";

export interface TokenItem {
  symbol: string;
  name: string;
  balance: string;
  value: string;
  change: string;
  up: boolean;
  color: string;
  abbr: string;
  price: string;
}

export function TokenDetailPage({ onBack, token }: { onBack: () => void; token: TokenItem }) {
  const [timeframe, setTimeframe] = useState<Timeframe>("1D");
  const timeframes: Timeframe[] = ["1H", "1D", "1W", "1M", "1Y"];
  const chartPoints = getPriceHistory(token.symbol, timeframe);
  const maxVal = Math.max(...chartPoints);
  const minVal = Math.min(...chartPoints);
  const range = maxVal - minVal || 1;
  const chartPath = chartPoints.map((v, i) => {
    const x = (i / (chartPoints.length - 1)) * 320;
    const y = 100 - ((v - minVal) / range) * 80;
    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
  }).join(" ");
  const areaPath = chartPath + ` L 320 100 L 0 100 Z`;
  // Price at chart end
  const lastPrice = chartPoints[chartPoints.length - 1];
  const firstPrice = chartPoints[0];
  const priceChange = ((lastPrice - firstPrice) / firstPrice * 100).toFixed(2);
  const isUp = lastPrice >= firstPrice;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-5 py-4 flex items-center border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex-1 flex items-center justify-center gap-2 mr-9">
          <div className={`w-6 h-6 ${token.color} rounded-full flex items-center justify-center text-white text-[10px] font-bold`}>{token.abbr}</div>
          <span className="text-lg font-semibold">{token.name}</span>
        </div>
      </div>
      <div className="flex-1 px-5 py-6">
        {/* Price header */}
        <div className="text-center mb-6">
          <p className="text-4xl font-extrabold text-gray-900">{token.value}</p>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            {isUp ? <TrendingUp className="w-4 h-4 text-green-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
            <span className={`text-sm font-semibold ${isUp ? 'text-green-500' : 'text-red-500'}`}>{isUp ? "+" : ""}{priceChange}% ({timeframe})</span>
          </div>
        </div>
        {/* Chart */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100">
          <svg viewBox="0 0 320 110" className="w-full h-28">
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isUp ? "#34c759" : "#ff3b30"} stopOpacity="0.25" />
                <stop offset="100%" stopColor={isUp ? "#34c759" : "#ff3b30"} stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Grid lines */}
            {[20, 40, 60, 80].map(y => (
              <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="#f0f0f5" strokeWidth="0.5" />
            ))}
            <path d={areaPath.replace(/L 0 100 Z/, `L 320 110 L 0 110 Z`)} fill="url(#chartGrad)" />
            <path d={chartPath.replace(/100/g, "110")} fill="none" stroke={isUp ? "#34c759" : "#ff3b30"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* End dot */}
            <circle cx="320" cy={110 - ((lastPrice - minVal) / range) * 80} r="4" fill={isUp ? "#34c759" : "#ff3b30"} />
          </svg>
          <div className="flex justify-between mt-3">
            {timeframes.map((period) => (
              <button key={period} onClick={() => setTimeframe(period)} className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${timeframe === period ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}>
                {period}
              </button>
            ))}
          </div>
        </div>
        {/* Balance info */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-400">Your Balance</span>
            <span className="text-sm text-gray-400">≈ {token.value}</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{token.balance} {token.symbol}</p>
        </div>
        {/* Action buttons */}
        <div className="flex gap-3 mb-6">
          <button className="flex-1 identity-gradient text-white py-3.5 rounded-2xl font-semibold shadow-lg active:scale-[0.98] transition-transform">Send</button>
          <button className="flex-1 bg-gray-100 text-gray-900 py-3.5 rounded-2xl font-semibold active:scale-[0.98] transition-transform">Receive</button>
          <button className="flex-1 bg-gray-100 text-gray-900 py-3.5 rounded-2xl font-semibold active:scale-[0.98] transition-transform">Swap</button>
        </div>
        {/* Recent transactions */}
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-3">Recent Activity</h3>
          <div className="space-y-1">
            {[
              { type: "Received", amount: `+0.2 ${token.symbol}`, time: "2 days ago", positive: true },
              { type: "Sent", amount: `-0.05 ${token.symbol}`, time: "5 days ago", positive: false },
              { type: "Swap", amount: `+0.1 ${token.symbol}`, time: "1 week ago", positive: true },
            ].map((tx, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${tx.positive ? 'bg-green-50' : 'bg-red-50'}`}>
                  {tx.positive ? <TrendingDown className="w-4 h-4 text-green-500 rotate-180" /> : <Send className="w-4 h-4 text-red-500" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{tx.type}</p>
                  <p className="text-xs text-gray-400">{tx.time}</p>
                </div>
                <p className={`font-semibold text-sm ${tx.positive ? 'text-green-500' : 'text-gray-900'}`}>{tx.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
