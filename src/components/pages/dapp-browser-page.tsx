"use client";

import { useState } from "react";
import { ArrowLeft, Compass } from "lucide-react";

const DAPPS = [
  { name: "Uniswap", desc: "Decentralized Exchange", category: "DeFi", color: "from-pink-500 to-rose-500", icon: "🦄" },
  { name: "Aave", desc: "Lending & Borrowing", category: "DeFi", color: "from-purple-500 to-indigo-500", icon: "👻" },
  { name: "OpenSea", desc: "NFT Marketplace", category: "NFT", color: "from-blue-500 to-cyan-500", icon: "🌊" },
  { name: "Lido", desc: "Liquid Staking", category: "DeFi", color: "from-cyan-500 to-teal-500", icon: "🌊" },
  { name: "ENS", desc: "Ethereum Name Service", category: "Utility", color: "from-indigo-500 to-blue-500", icon: "📛" },
  { name: "Zora", desc: "NFT Creation", category: "NFT", color: "from-gray-800 to-gray-900", icon: "⚡" },
  { name: "Curve", desc: "Stablecoin DEX", category: "DeFi", color: "from-yellow-500 to-amber-500", icon: "📈" },
  { name: "Compound", desc: "Lending Protocol", category: "DeFi", color: "from-green-500 to-emerald-500", icon: "🏦" },
];

export function DAppBrowserPage({ onBack }: { onBack: () => void }) {
  const [filter, setFilter] = useState("All");
  const categories = ["All", "DeFi", "NFT", "Utility"];
  const filtered = filter === "All" ? DAPPS : DAPPS.filter(d => d.category === filter);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-5 py-4 flex items-center border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold mr-9">DApps</h1>
      </div>
      <div className="px-5 py-4">
        {/* Search */}
        <div className="bg-gray-50 rounded-2xl px-4 py-3 flex items-center gap-3 border border-gray-100 mb-4">
          <Compass className="w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search DApps" className="bg-transparent flex-1 text-sm focus:outline-none placeholder:text-gray-400" />
        </div>
        {/* Category filter */}
        <div className="flex gap-2 mb-5 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === cat ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {/* DApp grid */}
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((dapp, i) => (
            <div key={i} className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm active:scale-[0.97] transition-transform cursor-pointer">
              <div className={`aspect-[4/3] bg-gradient-to-br ${dapp.color} flex items-center justify-center`}>
                <span className="text-4xl">{dapp.icon}</span>
              </div>
              <div className="p-3">
                <p className="font-semibold text-sm text-gray-900">{dapp.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{dapp.desc}</p>
                <span className="inline-block mt-2 text-[10px] px-2 py-0.5 bg-gray-100 rounded-full text-gray-500 font-medium">{dapp.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
