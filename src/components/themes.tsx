"use client";

import { useState, useEffect, createContext, useContext, type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

export interface Theme {
  id: string;
  name: string;
  emoji: string;
  gradient: string;
  accent: string;
  bg: string;
}

export const THEMES: Theme[] = [
  { id: "rainbow", name: "Rainbow", emoji: "🌈", gradient: "linear-gradient(135deg, #ff3b30, #ff9500, #ffcc00, #34c759, #007aff, #5856d6, #af52de)", accent: "#007aff", bg: "#ffffff" },
  { id: "midnight", name: "Midnight", emoji: "🌙", gradient: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460, #533483)", accent: "#533483", bg: "#0a0a1a" },
  { id: "ocean", name: "Ocean", emoji: "🌊", gradient: "linear-gradient(135deg, #0077b6, #00b4d8, #48cae4, #90e0ef)", accent: "#0077b6", bg: "#f0f8ff" },
  { id: "sunset", name: "Sunset", emoji: "🌅", gradient: "linear-gradient(135deg, #ff6b6b, #ffa07a, #ffd700, #ff69b4)", accent: "#ff6b6b", bg: "#fffaf0" },
  { id: "forest", name: "Forest", emoji: "🌲", gradient: "linear-gradient(135deg, #2d5016, #4a7c59, #6b8f71, #a3c9a8)", accent: "#4a7c59", bg: "#f0f7f0" },
  { id: "cyberpunk", name: "Cyberpunk", emoji: "⚡", gradient: "linear-gradient(135deg, #ff00ff, #00ffff, #ff00ff, #ffff00)", accent: "#ff00ff", bg: "#0a0a0a" },
];

const THEME_DESCRIPTIONS: Record<string, string> = {
  rainbow: "Classic Rainbow vibes. Colorful and fun.",
  midnight: "Dark mode with deep blue-purple tones.",
  ocean: "Cool blue serenity. Calm and focused.",
  sunset: "Warm gradient. Cozy and inviting.",
  forest: "Natural green. Fresh and earthy.",
  cyberpunk: "Neon glow. Bold and electric.",
};

interface ThemeContextType {
  theme: Theme;
  setTheme: (id: string) => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextType>({
  theme: THEMES[0],
  setTheme: () => {},
  themes: THEMES,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentId, setCurrentId] = useState("rainbow");

  useEffect(() => {
    const saved = localStorage.getItem("wallet-theme");
    if (saved && THEMES.find(t => t.id === saved)) setCurrentId(saved);
  }, []);

  const setTheme = (id: string) => {
    setCurrentId(id);
    localStorage.setItem("wallet-theme", id);
    const theme = THEMES.find(t => t.id === id) || THEMES[0];
    const root = document.documentElement;
    // Apply theme CSS variables with transition
    root.style.setProperty("--theme-gradient", theme.gradient);
    root.style.setProperty("--theme-accent", theme.accent);
    root.style.setProperty("--theme-bg", theme.bg);
    // Smooth transition
    root.style.transition = "background-color 0.3s ease, color 0.3s ease";
    if (theme.id === "midnight" || theme.id === "cyberpunk") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  const theme = THEMES.find(t => t.id === currentId) || THEMES[0];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemePickerPage({ onBack }: { onBack: () => void }) {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-5 py-4 flex items-center border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold mr-9">Themes</h1>
      </div>
      <div className="flex-1 px-5 py-6">
        <p className="text-[13px] text-gray-500 mb-6 leading-relaxed">Choose a theme that matches your style.<br /><span className="text-gray-400">Your wallet, your vibe.</span></p>
        <div className="grid grid-cols-2 gap-4">
          {themes.map((t) => (
            <button key={t.id} onClick={() => setTheme(t.id)}
              className={`rounded-2xl overflow-hidden border-2 transition-all duration-300 text-left group ${
                theme.id === t.id
                  ? 'border-blue-500 shadow-xl shadow-blue-500/20 scale-[1.02]'
                  : 'border-gray-100 hover:border-gray-200 hover:shadow-md active:scale-[0.98]'
              }`}>
              <div className="w-full h-20 relative" style={{ background: t.gradient }}>
                {theme.id === t.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                    <span className="text-green-500 text-xs font-bold">✓</span>
                  </div>
                )}
              </div>
              <div className="p-3.5 bg-white">
                <div className="flex items-center gap-2">
                  <span className="text-base">{t.emoji}</span>
                  <span className="font-semibold text-[13px] text-gray-900">{t.name}</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5">{THEME_DESCRIPTIONS[t.id] || ""}</p>
                {theme.id === t.id && <span className="text-[11px] text-blue-500 font-semibold mt-1 block">Active Theme</span>}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
