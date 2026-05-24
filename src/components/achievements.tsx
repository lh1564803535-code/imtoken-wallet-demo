"use client";

import { useState, useEffect } from "react";
import { Trophy, Star, Zap, Shield, Gift, Send, ArrowLeftRight, Lock, ArrowLeft, Globe, Eye } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  unlocked: boolean;
  rarity: "common" | "rare" | "epic" | "legendary";
}

const ALL_ACHIEVEMENTS: Omit<Achievement, "unlocked">[] = [
  { id: "first_wallet", title: "Genesis", desc: "Created your first wallet", icon: <Star className="w-5 h-5" />, rarity: "common" },
  { id: "first_send", title: "First Flight", desc: "Sent your first transaction", icon: <Send className="w-5 h-5" />, rarity: "common" },
  { id: "first_swap", title: "DeFi Explorer", desc: "Made your first token swap", icon: <ArrowLeftRight className="w-5 h-5" />, rarity: "rare" },
  { id: "backed_up", title: "Safety First", desc: "Backed up your seed phrase", icon: <Shield className="w-5 h-5" />, rarity: "common" },
  { id: "heritage_setup", title: "Legacy Builder", desc: "Set up Heritage Wallet", icon: <Gift className="w-5 h-5" />, rarity: "epic" },
  { id: "portfolio_100", title: "Century Club", desc: "Portfolio reached $100", icon: <Trophy className="w-5 h-5" />, rarity: "rare" },
  { id: "portfolio_1000", title: "Four Figures", desc: "Portfolio reached $1,000", icon: <Trophy className="w-5 h-5" />, rarity: "epic" },
  { id: "multi_chain", title: "Chain Hopper", desc: "Used 3+ different chains", icon: <Zap className="w-5 h-5" />, rarity: "rare" },
  { id: "dapp_user", title: "Web3 Native", desc: "Connected to a DApp", icon: <Globe className="w-5 h-5" />, rarity: "rare" },
  { id: "watch_wallet", title: "Watcher", desc: "Added a watch-only wallet", icon: <Eye className="w-5 h-5" />, rarity: "common" },
  { id: "first_buy", title: "Fiat Gateway", desc: "Bought crypto with fiat", icon: <Star className="w-5 h-5" />, rarity: "rare" },
  { id: "theme_change", title: "Fashionista", desc: "Changed your wallet theme", icon: <Star className="w-5 h-5" />, rarity: "common" },
  { id: "achievement_hunter", title: "Achievement Hunter", desc: "Unlocked 8 achievements", icon: <Trophy className="w-5 h-5" />, rarity: "epic" },
  { id: "whale", title: "Whale Status", desc: "Portfolio reached $10,000", icon: <Trophy className="w-5 h-5" />, rarity: "legendary" },
];

const RARITY_COLORS: Record<string, { bg: string; text: string; border: string; glow: string; xp: number }> = {
  common: { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200", glow: "", xp: 10 },
  rare: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", glow: "shadow-blue-100", xp: 25 },
  epic: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200", glow: "shadow-purple-200", xp: 50 },
  legendary: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", glow: "shadow-amber-200", xp: 100 },
};

export function AchievementsPage({ onBack }: { onBack: () => void }) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const unlocked = JSON.parse(localStorage.getItem("achievements") || '["first_wallet","backed_up"]');
    setAchievements(ALL_ACHIEVEMENTS.map(a => ({ ...a, unlocked: unlocked.includes(a.id) })));
  }, []);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const totalXP = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + (RARITY_COLORS[a.rarity]?.xp || 10), 0);
  const maxXP = achievements.reduce((sum, a) => sum + (RARITY_COLORS[a.rarity]?.xp || 10), 0);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-5 py-4 flex items-center border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold mr-9">Achievements</h1>
      </div>
      <div className="flex-1 px-5 py-6">
        {/* Progress */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-purple-500" />
              <span className="font-semibold text-gray-900">Your Progress</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-purple-600">{unlockedCount}/{totalCount}</span>
              <span className="text-xs text-gray-400 ml-2">({totalXP} XP)</span>
            </div>
          </div>
          <div className="w-full h-2 bg-purple-100 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${(unlockedCount / totalCount) * 100}%` }} />
          </div>
        </div>

        {/* Achievement grid */}
        <div className="space-y-3">
          {achievements.map((a, index) => {
            const colors = RARITY_COLORS[a.rarity];
            return (
              <div key={a.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                a.unlocked ? `${colors.bg} ${colors.border} shadow-sm ${a.rarity === 'legendary' ? 'animate-legendary' : ''}` : 'bg-gray-50/50 border-gray-100 opacity-40'
              }`} style={{ animationDelay: `${index * 0.05}s` }}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${a.unlocked ? `${colors.bg} shadow-md` : 'bg-gray-100'}`}>
                  {a.unlocked ? <div className={colors.text}>{a.icon}</div> : <Lock className="w-5 h-5 text-gray-300" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`font-semibold text-sm ${a.unlocked ? 'text-gray-900' : 'text-gray-400'}`}>{a.title}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${a.unlocked ? `${colors.bg} ${colors.text} border ${colors.border}` : 'bg-gray-100 text-gray-400'}`}>{a.rarity}</span>
                  </div>
                  <p className={`text-xs mt-0.5 ${a.unlocked ? 'text-gray-500' : 'text-gray-300'}`}>{a.desc}</p>
                </div>
                {a.unlocked && <span className="text-green-500 text-lg font-bold">✓</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function useAchievements() {
  const unlock = (id: string) => {
    try {
      const current = JSON.parse(localStorage.getItem("achievements") || '["first_wallet"]');
      if (!current.includes(id)) {
        current.push(id);
        localStorage.setItem("achievements", JSON.stringify(current));
      }
    } catch {
      localStorage.setItem("achievements", JSON.stringify(["first_wallet", id]));
    }
  };

  return { unlock };
}
