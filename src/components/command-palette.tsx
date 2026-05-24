"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import { Search, Send, QrCode, ArrowLeftRight, Compass, Shield, Gift, User, Settings, X } from "lucide-react";

interface Command {
  id: string;
  label: string;
  description: string;
  icon: ReactNode;
  action: () => void;
  shortcut?: string;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  commands: Command[];
}

export function CommandPalette({ open, onClose, commands }: CommandPaletteProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  const filtered = query
    ? commands.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.description.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      {/* Panel */}
      <div className="relative w-full max-w-md mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Type a command..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 text-base focus:outline-none placeholder:text-gray-400"
          />
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        {/* Commands */}
        <div className="max-h-80 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400">No commands found</div>
          ) : (
            filtered.map((cmd) => (
              <button
                key={cmd.id}
                onClick={() => { cmd.action(); onClose(); }}
                className="w-full flex items-center gap-4 px-5 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
              >
                <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                  {cmd.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">{cmd.label}</p>
                  <p className="text-xs text-gray-400">{cmd.description}</p>
                </div>
                {cmd.shortcut && (
                  <span className="text-[10px] px-2 py-1 bg-gray-100 rounded-lg text-gray-500 font-mono">{cmd.shortcut}</span>
                )}
              </button>
            ))
          )}
        </div>
        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-[10px] text-gray-400">Navigate with arrow keys</span>
          <span className="text-[10px] text-gray-400">ESC to close</span>
        </div>
      </div>
    </div>
  );
}

export function useCommandPalette(onNavigate: (page: string) => void) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const commands: Command[] = [
    { id: "send", label: "Send", description: "Send tokens to an address", icon: <Send className="w-4 h-4 text-gray-600" />, action: () => onNavigate("send"), shortcut: "S" },
    { id: "receive", label: "Receive", description: "Show your QR code", icon: <QrCode className="w-4 h-4 text-gray-600" />, action: () => onNavigate("receive"), shortcut: "R" },
    { id: "swap", label: "Swap", description: "Exchange tokens", icon: <ArrowLeftRight className="w-4 h-4 text-gray-600" />, action: () => onNavigate("swap"), shortcut: "X" },
    { id: "discover", label: "Discover", description: "Browse DApps", icon: <Compass className="w-4 h-4 text-gray-600" />, action: () => onNavigate("dapps") },
    { id: "security", label: "Security", description: "Security settings", icon: <Shield className="w-4 h-4 text-gray-600" />, action: () => onNavigate("security") },
    { id: "heritage", label: "Heritage Wallet", description: "Smart contract custody", icon: <Gift className="w-4 h-4 text-gray-600" />, action: () => onNavigate("heritage") },
    { id: "profile", label: "Profile", description: "Your wallet settings", icon: <User className="w-4 h-4 text-gray-600" />, action: () => onNavigate("profile") },
    { id: "settings", label: "Settings", description: "Language, currency, security", icon: <Settings className="w-4 h-4 text-gray-600" />, action: () => onNavigate("settings") },
    { id: "networks", label: "Networks", description: "Switch blockchain network", icon: <Compass className="w-4 h-4 text-gray-600" />, action: () => onNavigate("network") },
    { id: "nfts", label: "NFT Gallery", description: "View your NFTs", icon: <Gift className="w-4 h-4 text-gray-600" />, action: () => onNavigate("nfts") },
  ];

  return { open, setOpen, commands };
}
