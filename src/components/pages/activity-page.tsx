"use client";

import { useState } from "react";
import { Send, TrendingDown, ArrowLeftRight, Activity } from "lucide-react";

interface Tx {
  type: "Send" | "Receive" | "Swap";
  token: string;
  amount: string;
  usd: string;
  time: string;
  color: string;
  iconColor: string;
  hash: string;
}

interface TxGroup {
  label: string;
  txs: Tx[];
}

const MOCK_GROUPS: TxGroup[] = [
  { label: "Today", txs: [
    { type: "Send", token: "ETH", amount: "-0.1", usd: "-$269.13", time: "2 hours ago", color: "bg-red-50", iconColor: "text-red-500", hash: "0xabcd...1234" },
  ]},
  { label: "Yesterday", txs: [
    { type: "Receive", token: "ETH", amount: "+0.5", usd: "+$1,345.67", time: "1 day ago", color: "bg-green-50", iconColor: "text-green-500", hash: "0xefgh...5678" },
  ]},
  { label: "This Week", txs: [
    { type: "Swap", token: "ETH → BTC", amount: "0.05", usd: "$134.57", time: "3 days ago", color: "bg-blue-50", iconColor: "text-blue-500", hash: "0xswap...9012" },
    { type: "Send", token: "TRX", amount: "-100", usd: "-$14.40", time: "5 days ago", color: "bg-red-50", iconColor: "text-red-500", hash: "0xtrx...3456" },
  ]},
  { label: "Earlier", txs: [
    { type: "Receive", token: "USDT", amount: "+200", usd: "+$200.00", time: "1 week ago", color: "bg-green-50", iconColor: "text-green-500", hash: "0xusdt...7890" },
  ]},
];

export function ActivityPage({ onTxClick }: { onBack?: () => void; onTxClick?: () => void }) {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Sent", "Received", "Swaps"];

  const filteredGroups = filter === "All"
    ? MOCK_GROUPS
    : MOCK_GROUPS.map(g => ({
        ...g,
        txs: g.txs.filter(t => {
          if (filter === "Sent") return t.type === "Send";
          if (filter === "Received") return t.type === "Receive";
          if (filter === "Swaps") return t.type === "Swap";
          return true;
        }),
      })).filter(g => g.txs.length > 0);

  const hasTransactions = filteredGroups.length > 0;

  return (
    <div className="bg-white min-h-screen">
      <div className="px-5 pt-14 pb-4">
        <h1 className="text-2xl font-bold mb-4">Activity</h1>
        <div className="flex gap-2 mb-4">
          {filters.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {hasTransactions ? (
        filteredGroups.map((group) => (
          <div key={group.label} className="px-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{group.label}</p>
            <div className="space-y-1 mb-4">
              {group.txs.map((tx, i) => (
                <div key={i} className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer" onClick={() => onTxClick?.()}>
                  <div className={`w-11 h-11 ${tx.color} rounded-full flex items-center justify-center shrink-0`}>
                    {tx.type === "Send" ? <Send className={`w-5 h-5 ${tx.iconColor}`} /> :
                     tx.type === "Receive" ? <TrendingDown className={`w-5 h-5 ${tx.iconColor} rotate-180`} /> :
                     <ArrowLeftRight className={`w-5 h-5 ${tx.iconColor}`} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-gray-900 text-sm">{tx.type} {tx.token}</p>
                      <p className="font-semibold text-sm text-gray-900">{tx.amount} {tx.token.split(" → ")[0]}</p>
                    </div>
                    <div className="flex justify-between items-center mt-0.5">
                      <p className="text-xs text-gray-400 font-mono">{tx.hash}</p>
                      <p className="text-xs text-gray-400">{tx.usd}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center px-6 pt-20">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Activity className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium mb-1">No transactions yet</p>
          <p className="text-sm text-gray-400 text-center max-w-xs">Your transaction history will appear here once you send or receive tokens.</p>
        </div>
      )}
    </div>
  );
}
