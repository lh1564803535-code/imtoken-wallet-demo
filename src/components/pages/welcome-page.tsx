"use client";

import { Wallet, Download, Shield, Sparkles, Trophy, Gift } from "lucide-react";

export function WelcomePage({ onCreate, onImport }: { onCreate: () => void; onImport: () => void }) {
  return (
    <div className="min-h-screen flex flex-col bg-white overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50 via-blue-50 to-white" />
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-20 identity-gradient blur-3xl" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Logo */}
          <div className="relative mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s", opacity: 0 }}>
            <div className="w-24 h-24 rounded-[2rem] identity-gradient flex items-center justify-center shadow-xl">
              <div className="w-20 h-20 bg-white rounded-[1.5rem] flex items-center justify-center">
                <Wallet className="w-10 h-10 text-blue-500" />
              </div>
            </div>
            <div className="absolute inset-0 rounded-[2rem] identity-gradient opacity-20 animate-ping" />
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight animate-fade-in-up" style={{ animationDelay: "0.2s", opacity: 0 }}>
            AI Agent Wallet
          </h1>
          <p className="text-gray-400 mb-6 text-sm animate-fade-in-up" style={{ animationDelay: "0.25s", opacity: 0 }}>
            by Token Core • v1.0.0
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 animate-fade-in-up" style={{ animationDelay: "0.3s", opacity: 0 }}>
            {[
              { icon: Sparkles, label: "AI Agent", color: "text-purple-500 bg-purple-50" },
              { icon: Trophy, label: "Achievements", color: "text-amber-500 bg-amber-50" },
              { icon: Gift, label: "Heritage", color: "text-pink-500 bg-pink-50" },
            ].map((badge) => (
              <div key={badge.label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${badge.color} border border-current/10`}>
                <badge.icon className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">{badge.label}</span>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="w-full max-w-sm space-y-3 animate-fade-in-up" style={{ animationDelay: "0.4s", opacity: 0 }}>
            <button onClick={onCreate} className="w-full identity-gradient text-white py-4 rounded-2xl font-semibold text-lg shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-transform hover:shadow-xl">
              Create New Wallet
            </button>
            <button onClick={onImport} className="w-full bg-white text-gray-900 py-4 rounded-2xl font-semibold text-lg border border-gray-200 flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform hover:bg-gray-50 hover:border-gray-300">
              <Download className="w-5 h-5" /> Import Existing Wallet
            </button>
          </div>
        </div>
      </div>

      {/* Trust indicators */}
      <div className="px-6 py-5 bg-white border-t border-gray-50 animate-fade-in-up" style={{ animationDelay: "0.5s", opacity: 0 }}>
        <div className="flex items-center justify-center gap-5 text-xs text-gray-400">
          <div className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-green-500" /><span>Non-Custodial</span></div>
          <div className="w-1 h-1 rounded-full bg-gray-200" />
          <div className="flex items-center gap-1.5"><span className="text-blue-500">⟠</span><span>ETH • BTC • TRON</span></div>
          <div className="w-1 h-1 rounded-full bg-gray-200" />
          <span>Open Source</span>
        </div>
      </div>
    </div>
  );
}
