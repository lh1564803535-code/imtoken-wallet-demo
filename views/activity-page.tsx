"use client";

import { ArrowLeft, Send, TrendingDown, ArrowLeftRight } from "lucide-react";

export function ActivityPage({ onBack }: { onBack: () => void }) {
  const txs = [
    { type: "Send", token: "ETH", amount: "-0.1", to: "0x5678...abcd", time: "2 hours ago", status: "Confirmed" },
    { type: "Receive", token: "ETH", amount: "+0.5", from: "0xefgh...1234", time: "1 day ago", status: "Confirmed" },
    { type: "Swap", token: "ETH → BTC", amount: "0.05", to: "Swap", time: "3 days ago", status: "Confirmed" },
    { type: "Send", token: "TRX", amount: "-100", to: "0x9876...5432", time: "5 days ago", status: "Confirmed" },
    { type: "Receive", token: "ETH", amount: "+1.0", from: "0xabcd...efgh", time: "1 week ago", status: "Confirmed" },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-5 py-4 flex items-center border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold mr-9">Activity</h1>
      </div>
      <div className="flex-1 px-5 py-4">
        <div className="space-y-1">
          {txs.map((tx, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center ${
                tx.type === "Send" ? "bg-red-50" : tx.type === "Receive" ? "bg-green-50" : "bg-blue-50"
              }`}>
                {tx.type === "Send" ? <Send className="w-5 h-5 text-red-500" /> :
                 tx.type === "Receive" ? <TrendingDown className="w-5 h-5 text-green-500 rotate-180" /> :
                 <ArrowLeftRight className="w-5 h-5 text-blue-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-900">{tx.type}</p>
                  <p className={`font-semibold ${tx.amount.startsWith("+") ? "text-green-500" : tx.amount.startsWith("-") ? "text-gray-900" : "text-gray-900"}`}>
                    {tx.amount} {tx.token.includes("→") ? "" : tx.token}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-sm text-gray-400 truncate">{tx.to || tx.from}</p>
                  <p className="text-xs text-gray-300">{tx.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
