"use client";

import { useState, useEffect, useCallback } from "react";
import { Sparkles, TrendingUp, TrendingDown, Shield, Gift, Lightbulb, X } from "lucide-react";

interface AgentMessage {
  text: string;
  icon: React.ReactNode;
  mood: "happy" | "excited" | "cautious" | "proud" | "helpful" | "worried" | "curious";
}

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "late_night";
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

function getDayVibe(): string {
  const day = new Date().getDay();
  if (day === 0 || day === 6) return "weekend";
  if (day === 1) return "monday";
  if (day === 5) return "friday";
  return "weekday";
}

const GREETINGS: AgentMessage[] = [
  // Morning
  { text: "Good morning! Let's see how your portfolio slept.", icon: <TrendingUp className="w-3.5 h-3.5" />, mood: "happy" },
  { text: "GM! Coffee and crypto — name a better combo.", icon: <Sparkles className="w-3.5 h-3.5" />, mood: "excited" },
  { text: "Rise and grind! The markets await.", icon: <TrendingUp className="w-3.5 h-3.5" />, mood: "excited" },
  // Afternoon
  { text: "Hey! Markets are active today. Want to check your gains?", icon: <TrendingUp className="w-3.5 h-3.5" />, mood: "happy" },
  { text: "Afternoon check-in: your assets are safe and sound.", icon: <Shield className="w-3.5 h-3.5" />, mood: "helpful" },
  { text: "Mid-day vibes. Everything's looking solid.", icon: <Sparkles className="w-3.5 h-3.5" />, mood: "happy" },
  // Evening
  { text: "Good evening! Time to review your daily portfolio.", icon: <TrendingUp className="w-3.5 h-3.5" />, mood: "helpful" },
  { text: "Evening vibes. Your crypto journey continues.", icon: <Sparkles className="w-3.5 h-3.5" />, mood: "happy" },
  { text: "Night owl mode. Let's see what the markets did today.", icon: <TrendingUp className="w-3.5 h-3.5" />, mood: "curious" },
  // Late night
  { text: "Burning the midnight oil? Remember to rest!", icon: <Shield className="w-3.5 h-3.5" />, mood: "cautious" },
  { text: "Late night crypto session? I respect the dedication.", icon: <Sparkles className="w-3.5 h-3.5" />, mood: "excited" },
  // Weekend
  { text: "Weekend vibes! Perfect time to explore DeFi.", icon: <Sparkles className="w-3.5 h-3.5" />, mood: "excited" },
  { text: "Happy weekend! Lower gas fees ahead.", icon: <TrendingUp className="w-3.5 h-3.5" />, mood: "happy" },
  // Monday
  { text: "Monday motivation: new week, new crypto opportunities.", icon: <Sparkles className="w-3.5 h-3.5" />, mood: "excited" },
  // Friday
  { text: "TGIF! Time to check those weekend gains.", icon: <TrendingUp className="w-3.5 h-3.5" />, mood: "happy" },
  // Generic
  { text: "Welcome back! Ready to explore the crypto world?", icon: <Sparkles className="w-3.5 h-3.5" />, mood: "excited" },
  { text: "Good to see you! Let me check on your assets.", icon: <Shield className="w-3.5 h-3.5" />, mood: "helpful" },
  { text: "Your digital fortress awaits. All systems nominal.", icon: <Shield className="w-3.5 h-3.5" />, mood: "proud" },
  { text: "Another day, another opportunity in crypto.", icon: <Sparkles className="w-3.5 h-3.5" />, mood: "curious" },
  { text: "Your wallet missed you. Let's make today count.", icon: <Gift className="w-3.5 h-3.5" />, mood: "happy" },
];

const TIPS: AgentMessage[] = [
  { text: "Pro tip: Always verify addresses before sending. One wrong character = lost funds.", icon: <Shield className="w-3.5 h-3.5" />, mood: "cautious" },
  { text: "Did you know? You can swap tokens directly from this wallet.", icon: <Lightbulb className="w-3.5 h-3.5" />, mood: "helpful" },
  { text: "Heritage tip: Set up beneficiaries to protect your crypto for loved ones.", icon: <Gift className="w-3.5 h-3.5" />, mood: "proud" },
  { text: "Security reminder: Never share your seed phrase with anyone.", icon: <Shield className="w-3.5 h-3.5" />, mood: "cautious" },
  { text: "Fun fact: The first Bitcoin transaction bought two pizzas for 10,000 BTC!", icon: <Sparkles className="w-3.5 h-3.5" />, mood: "excited" },
  { text: "Achievement tip: Send your first transaction to earn 'First Flight'.", icon: <Gift className="w-3.5 h-3.5" />, mood: "helpful" },
  { text: "Try the Command Palette! Press the ⌘K button for quick actions.", icon: <Lightbulb className="w-3.5 h-3.5" />, mood: "curious" },
  { text: "Diversification tip: Don't put all eggs in one basket.", icon: <Shield className="w-3.5 h-3.5" />, mood: "cautious" },
  { text: "Gas tip: Network fees are usually lower on weekends.", icon: <Lightbulb className="w-3.5 h-3.5" />, mood: "helpful" },
  { text: "Scam alert: If someone asks for your seed phrase, it's 100% a scam.", icon: <Shield className="w-3.5 h-3.5" />, mood: "worried" },
  { text: "DeFi fact: Uniswap processes billions in daily volume.", icon: <Sparkles className="w-3.5 h-3.5" />, mood: "excited" },
  { text: "NFT tip: Check floor prices before buying. Research is key.", icon: <Lightbulb className="w-3.5 h-3.5" />, mood: "curious" },
];

const MOOD_STYLES: Record<string, { gradient: string; border: string; avatarBg: string }> = {
  happy: { gradient: "from-blue-50/80 to-cyan-50/80", border: "border-blue-100/50", avatarBg: "from-blue-400 to-cyan-400" },
  excited: { gradient: "from-purple-50/80 to-pink-50/80", border: "border-purple-100/50", avatarBg: "from-purple-400 to-pink-400" },
  cautious: { gradient: "from-amber-50/80 to-orange-50/80", border: "border-amber-100/50", avatarBg: "from-amber-400 to-orange-400" },
  proud: { gradient: "from-green-50/80 to-emerald-50/80", border: "border-green-100/50", avatarBg: "from-green-400 to-emerald-400" },
  helpful: { gradient: "from-gray-50/80 to-slate-50/80", border: "border-gray-100/50", avatarBg: "from-gray-400 to-slate-400" },
  worried: { gradient: "from-red-50/80 to-orange-50/80", border: "border-red-100/50", avatarBg: "from-red-400 to-orange-400" },
  curious: { gradient: "from-indigo-50/80 to-violet-50/80", border: "border-indigo-100/50", avatarBg: "from-indigo-400 to-violet-400" },
};

export function AIAgentBanner() {
  const [message, setMessage] = useState<AgentMessage>(GREETINGS[0]);
  const [visible, setVisible] = useState(true);
  const [typed, setTyped] = useState("");
  const [typing, setTyping] = useState(true);
  const [thinking, setThinking] = useState(true);

  useEffect(() => {
    const timePeriod = getTimeGreeting();
    const dayVibe = getDayVibe();
    const timeGreetings = GREETINGS.filter(g => {
      if (timePeriod === "morning") return g.text.includes("morning") || g.text.includes("GM") || g.text.includes("Rise");
      if (timePeriod === "afternoon") return g.text.includes("afternoon") || g.text.includes("Hey") || g.text.includes("Mid-day");
      if (timePeriod === "evening") return g.text.includes("evening") || g.text.includes("Evening") || g.text.includes("Night owl");
      if (timePeriod === "late_night") return g.text.includes("midnight") || g.text.includes("rest") || g.text.includes("Late night");
      return false;
    });
    const dayGreetings = GREETINGS.filter(g => {
      if (dayVibe === "weekend") return g.text.includes("Weekend") || g.text.includes("weekend");
      if (dayVibe === "monday") return g.text.includes("Monday");
      if (dayVibe === "friday") return g.text.includes("TGIF") || g.text.includes("Friday");
      return false;
    });
    // Avoid recent messages
    const recent = JSON.parse(localStorage.getItem("agent-recent") || "[]") as string[];
    const rand = Math.random();
    let pool;
    if (rand < 0.5 && timeGreetings.length > 0) pool = timeGreetings;
    else if (rand < 0.8 && dayGreetings.length > 0) pool = dayGreetings;
    else pool = [...GREETINGS, ...TIPS];
    // Filter out recently shown messages
    const filtered = pool.filter(g => !recent.includes(g.text));
    const final = filtered.length > 0 ? filtered : pool;
    const random = final[Math.floor(Math.random() * final.length)];
    // Save to recent (keep last 5)
    const newRecent = [random.text, ...recent].slice(0, 5);
    localStorage.setItem("agent-recent", JSON.stringify(newRecent));
    // Show thinking first, then message
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setMessage(random);
      setTyped("");
      setTyping(true);
    }, 800);
  }, []);

  // Typing effect
  useEffect(() => {
    if (!typing) return;
    if (typed.length >= message.text.length) {
      setTyping(false);
      return;
    }
    const timer = setTimeout(() => {
      setTyped(message.text.slice(0, typed.length + 1));
    }, 20);
    return () => clearTimeout(timer);
  }, [typed, typing, message.text]);

  if (!visible) return null;

  const style = MOOD_STYLES[message.mood] || MOOD_STYLES.helpful;

  return (
    <div className={`mx-5 mb-4 bg-gradient-to-r ${style.gradient} rounded-2xl p-4 border ${style.border} animate-fade-in-up backdrop-blur-sm`}>
      <div className="flex items-start gap-3">
        {/* Animated avatar */}
        <div className={`w-10 h-10 bg-gradient-to-br ${style.avatarBg} rounded-xl flex items-center justify-center shrink-0 shadow-md relative`}>
          <span className="text-white text-lg">🤖</span>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">AI Agent</span>
              <div className={`${message.mood === 'excited' ? 'text-purple-500' : message.mood === 'cautious' ? 'text-amber-500' : 'text-blue-500'}`}>
                {message.icon}
              </div>
            </div>
            <button onClick={() => setVisible(false)} className="p-1 rounded-lg hover:bg-black/5 transition-colors">
              <X className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
          <p className="text-[13px] text-gray-700 leading-relaxed">
            {thinking ? (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </span>
            ) : (
              <>
                {typed}
                {typing && <span className="inline-block w-0.5 h-3.5 bg-gray-400 ml-0.5 animate-pulse" />}
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export function useAgentReaction() {
  const [reaction, setReaction] = useState<AgentMessage | null>(null);

  const trigger = useCallback((key: string) => {
    const reactions: Record<string, AgentMessage> = {
      gain: { text: "Your portfolio is up! Great day for crypto.", icon: <TrendingUp className="w-3.5 h-3.5" />, mood: "excited" },
      loss: { text: "Markets are down. Stay calm, HODL strong.", icon: <TrendingDown className="w-3.5 h-3.5" />, mood: "cautious" },
      firstSend: { text: "First send! You're becoming a crypto pro.", icon: <Sparkles className="w-3.5 h-3.5" />, mood: "proud" },
      firstSwap: { text: "Your first swap! Welcome to DeFi.", icon: <Sparkles className="w-3.5 h-3.5" />, mood: "excited" },
      backup: { text: "Backed up! Smart move. Your future self thanks you.", icon: <Shield className="w-3.5 h-3.5" />, mood: "proud" },
    };
    setReaction(reactions[key] || null);
    setTimeout(() => setReaction(null), 5000);
  }, []);

  return { reaction, trigger };
}
