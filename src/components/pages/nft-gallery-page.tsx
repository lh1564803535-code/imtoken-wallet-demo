"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";

const MOCK_NFTS = [
  { name: "Rainbow World #1234", collection: "Rainbow World", color: "from-pink-400 to-purple-500", price: "1.24" },
  { name: "CryptoPunk #7891", collection: "CryptoPunks", color: "from-blue-400 to-cyan-400", price: "45.00" },
  { name: "BAYC #4567", collection: "Bored Ape YC", color: "from-orange-400 to-yellow-400", price: "12.50" },
  { name: "Azuki #2345", collection: "Azuki", color: "from-red-400 to-pink-400", price: "3.80" },
  { name: "Doodle #8901", collection: "Doodles", color: "from-green-400 to-teal-400", price: "1.15" },
  { name: "Moonbird #5678", collection: "Moonbirds", color: "from-indigo-400 to-blue-400", price: "2.30" },
];

export function NFTGalleryPage({ onBack }: { onBack: () => void }) {
  const [filter, setFilter] = useState("Collected");
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-5 py-4 flex items-center border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold mr-9">NFTs</h1>
      </div>
      <div className="flex-1 px-5 py-5">
        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-5">
          {["Collected", "Favorites", "Created"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              {f}
            </button>
          ))}
        </div>
        {/* Collection summary */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-400">{MOCK_NFTS.length} items</p>
          <p className="text-sm font-medium text-gray-600">Floor: 0.5 ETH</p>
        </div>
        {/* NFT Grid */}
        <div className="grid grid-cols-2 gap-3">
          {MOCK_NFTS.map((nft, i) => (
            <div key={i} className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm active:scale-[0.97] transition-transform cursor-pointer group">
              <div className={`aspect-square bg-gradient-to-br ${nft.color} flex items-center justify-center relative`}>
                <span className="text-5xl opacity-80 group-hover:scale-110 transition-transform">{["🌈", "👾", "🐵", "⛩️", "🎨", "🦉"][i]}</span>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100">
                  <span className="text-white text-xs font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">View</span>
                </div>
              </div>
              <div className="p-3">
                <p className="font-semibold text-sm text-gray-900 truncate">{nft.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-400">{nft.collection}</p>
                  <p className="text-xs font-medium text-gray-600">{nft.price} ETH</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
