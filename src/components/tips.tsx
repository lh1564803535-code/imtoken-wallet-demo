"use client";

import { useState, useEffect, type ReactNode } from "react";
import { X, Lightbulb } from "lucide-react";

interface TipProps {
  id: string;
  title: string;
  message: string;
  position?: "top" | "bottom";
  children: ReactNode;
}

export function Tip({ id, title, message, position = "bottom", children }: TipProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(`tip-dismissed-${id}`);
    if (!dismissed) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [id]);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(`tip-dismissed-${id}`, "true");
  };

  if (!visible) return <>{children}</>;

  return (
    <div className="relative">
      {children}
      <div className={`absolute ${position === "top" ? "bottom-full mb-2" : "top-full mt-2"} left-0 right-0 z-30 animate-fade-in-up`}>
        <div className="bg-gray-900 text-white rounded-xl p-3 shadow-lg">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold mb-0.5">{title}</p>
              <p className="text-xs opacity-80">{message}</p>
            </div>
            <button onClick={dismiss} className="p-0.5 rounded hover:bg-white/10 shrink-0">
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className={`absolute ${position === "top" ? "top-full" : "bottom-full"} left-6 w-2 h-2 bg-gray-900 transform ${position === "top" ? "-translate-y-1 rotate-45" : "translate-y-1 rotate-45"}`} />
        </div>
      </div>
    </div>
  );
}

export function useTips() {
  const [activeTip, setActiveTip] = useState<string | null>(null);

  const showTip = (id: string) => {
    const dismissed = localStorage.getItem(`tip-dismissed-${id}`);
    if (!dismissed) setActiveTip(id);
  };

  const dismissTip = (id: string) => {
    setActiveTip(null);
    localStorage.setItem(`tip-dismissed-${id}`, "true");
  };

  return { activeTip, showTip, dismissTip };
}
