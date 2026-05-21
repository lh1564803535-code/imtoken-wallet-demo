"use client";

import { useState, useRef } from "react";
import { Sparkles, Send, ArrowRight } from "lucide-react";
import { parsePurchaseIntent, isPurchaseQuery } from "@/components/bitrefill/BitrefillIntent";
import type { WalletData } from "@/lib/tcx";

interface Props {
  wallet: WalletData | null;
  onNavigate: (tab: string) => void;
  onAction: (action: string, payload?: string) => void;
}

interface IntentResult {
  type: "success" | "info" | "navigate" | "error";
  message: string;
  action?: string;
}

const SUGGESTIONS = [
  "Show my ETH address",
  "Prove I own all chains",
  "Sign a message",
  "Buy $50 Amazon gift card",
  "Show my gift cards",
];

function parseIntent(input: string, hasWallet: boolean): IntentResult {
  const lower = input.toLowerCase().trim();

  // No wallet guard
  if (!hasWallet && !lower.includes("create") && !lower.includes("import") && !lower.includes("restore") && !lower.includes("help")) {
    if (lower.includes("address") || lower.includes("sign") || lower.includes("proof") || lower.includes("export") || lower.includes("copy")) {
      return {
        type: "info",
        message: "You need a wallet first. Create one in the Create tab or import an existing mnemonic in the Import tab.",
      };
    }
  }

  // Show address
  if (lower.match(/show.*(eth|ethereum)/)) {
    return { type: "success", message: "Here's your Ethereum address.", action: "show-eth" };
  }
  if (lower.match(/show.*(btc|bitcoin)/)) {
    return { type: "success", message: "Here are your Bitcoin addresses.", action: "show-btc" };
  }
  if (lower.match(/show.*(tron|trx)/)) {
    return { type: "success", message: "Here's your TRON address.", action: "show-tron" };
  }
  if (lower.match(/show.*address/)) {
    return { type: "success", message: "Showing all your multi-chain addresses.", action: "show-all" };
  }

  // Copy all
  if (lower.match(/copy.*all|copy.*address/)) {
    return { type: "success", message: "Copied all addresses to clipboard!", action: "copy-all" };
  }

  // Prove ownership
  if (lower.match(/prove|proof|ownership|verify/)) {
    return { type: "navigate", message: "Generating cross-chain ownership proof...", action: "prove" };
  }

  // Sign message
  if (lower.match(/sign/)) {
    const msgMatch = input.match(/sign\s+(?:a\s+)?(?:message\s+)?(?:saying\s+)?["']?(.+?)["']?$/i);
    const payload = msgMatch ? msgMatch[1] : undefined;
    return { type: "navigate", message: payload ? `Navigating to Sign tab with message: "${payload}"` : "Opening the Sign tab for you.", action: "sign" };
  }

  // Export keystore
  if (lower.match(/export|download|keystore|backup/)) {
    return { type: "navigate", message: "Opening Security tab to export your keystore.", action: "export" };
  }

  // Create wallet
  if (lower.match(/create|new.*wallet|generate/)) {
    return { type: "navigate", message: "Let's create a new wallet!", action: "navigate-create" };
  }

  // Import wallet
  if (lower.match(/import|restore|recover/)) {
    return { type: "navigate", message: "Opening the Import tab to restore your wallet.", action: "navigate-import" };
  }

  // Help
  if (lower.match(/help|what can you|how/)) {
    return {
      type: "info",
      message: "I can help you: show addresses, copy them, prove cross-chain ownership, sign messages, export your keystore, buy gift cards, or navigate between tabs. Try saying \"Show my ETH address\" or \"Buy $50 Amazon gift card\"!",
    };
  }

  // Gift card vault
  if (lower.match(/my.*gift\s*card|my.*card|show.*vault|我的.*卡/)) {
    return { type: "navigate", message: "Opening your gift card vault.", action: "show-vault" };
  }

  // Shop / browse
  if (lower.match(/shop|store|browse|gift\s*card|商店|礼品/)) {
    return { type: "navigate", message: "Opening the gift card shop.", action: "show-shop" };
  }

  // Purchase intent (checked after all existing commands)
  if (isPurchaseQuery(lower)) {
    const intent = parsePurchaseIntent(input);
    if (intent) {
      const denomStr = intent.denomination ? ` ${intent.currency === "CNY" ? "¥" : "$"}${intent.denomination}` : "";
      return {
        type: "navigate",
        message: `Looking for${denomStr} ${intent.productType} gift card... Opening shop.`,
        action: "purchase",
      };
    }
    return {
      type: "navigate",
      message: "Opening the gift card shop for you.",
      action: "show-shop",
    };
  }

  // Fallback
  return {
    type: "info",
    message: "I can help with: showing addresses, proving ownership, signing messages, exporting keystore, or buying gift cards. Try one of the suggestions below!",
  };
}

export function AIIntent({ wallet, onNavigate, onAction }: Props) {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<IntentResult[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!input.trim()) return;
    const result = parseIntent(input, !!wallet);
    setResults((prev) => [...prev.slice(-4), result]);
    setInput("");

    // Execute action
    if (result.action) {
      switch (result.action) {
        case "show-eth":
        case "show-btc":
        case "show-tron":
        case "show-all":
          onAction(result.action);
          break;
        case "copy-all":
          onAction("copy-all");
          break;
        case "prove":
          onAction("prove");
          break;
        case "sign":
          onNavigate("sign");
          break;
        case "export":
          onNavigate("security");
          break;
        case "navigate-create":
          onNavigate("create");
          break;
        case "navigate-import":
          onNavigate("import");
          break;
        case "purchase":
        case "show-shop":
        case "show-vault":
          onNavigate("shop");
          break;
      }
    }
  };

  return (
    <div className="mb-4">
      {/* Collapsed: just the input bar */}
      <div
        className="rounded-xl ring-1 ring-[#007fff]/20 bg-white overflow-hidden transition-all duration-300"
        style={{ boxShadow: "0 2px 12px 0 color-mix(in srgb, #007fff 8%, transparent)" }}
      >
        {/* Header */}
        <button
          onClick={() => { setIsExpanded(!isExpanded); setTimeout(() => inputRef.current?.focus(), 100); }}
          className="w-full flex items-center gap-2 px-4 py-3 hover:bg-[#f8fbff] transition-colors"
        >
          <Sparkles className="h-4 w-4 text-[#007fff]" />
          <span className="text-sm font-medium text-[#111d4a]">AI Wallet Assistant</span>
          <span className="text-xs text-[#99a1af] ml-auto">Natural language control</span>
        </button>

        {/* Expanded content */}
        {isExpanded && (
          <div className="px-4 pb-4 space-y-3 animate-fade-in-up">
            {/* Results */}
            {results.length > 0 && (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {results.map((r, i) => (
                  <div
                    key={i}
                    className={`text-xs px-3 py-2 rounded-lg ${
                      r.type === "success"
                        ? "bg-emerald-50 text-emerald-700"
                        : r.type === "navigate"
                        ? "bg-blue-50 text-blue-700"
                        : r.type === "error"
                        ? "bg-red-50 text-red-700"
                        : "bg-[#f8f9fa] text-[#111d4a]"
                    }`}
                  >
                    {r.message}
                  </div>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Try: Show my BTC address, Prove I own all chains..."
                className="flex-1 text-sm bg-[#f8f9fa] rounded-full px-4 py-2 ring-1 ring-[#111d4a]/10 focus:outline-none focus:ring-2 focus:ring-[#007fff]/30 placeholder:text-[#99a1af]"
              />
              <button
                onClick={handleSubmit}
                disabled={!input.trim()}
                className="p-2 rounded-full bg-[#007fff] text-white hover:bg-[#006cd9] transition-colors disabled:opacity-30"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>

            {/* Suggestions */}
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    const result = parseIntent(s, !!wallet);
                    setResults((prev) => [...prev.slice(-4), result]);
                    if (result.action) {
                      switch (result.action) {
                        case "show-eth":
                        case "show-btc":
                        case "show-tron":
                        case "show-all":
                        case "copy-all":
                        case "prove":
                          onAction(result.action);
                          break;
                        case "sign":
                          onNavigate("sign");
                          break;
                        case "export":
                          onNavigate("security");
                          break;
                        case "navigate-create":
                          onNavigate("create");
                          break;
                        case "navigate-import":
                          onNavigate("import");
                          break;
                        case "purchase":
                        case "show-shop":
                        case "show-vault":
                          onNavigate("shop");
                          break;
                      }
                    }
                  }}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-[#f0f7ff] text-[#007fff] hover:bg-[#e0efff] transition-colors flex items-center gap-1"
                >
                  <ArrowRight className="h-2.5 w-2.5" />
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
