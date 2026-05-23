"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, ArrowRight, ShoppingCart, Gift, Globe, Plane, Loader2 } from "lucide-react";
import {
  parsePurchaseIntent,
  isPurchaseQuery,
  isGeneralQuestion,
  getSuggestions,
  detectTravelIntent,
  getTravelProducts,
} from "@/components/bitrefill/BitrefillIntent";
import { searchProductsByIntent } from "@/lib/bitrefill-api";
import type { WalletData } from "@/lib/tcx";
import type { BitrefillProduct } from "@/types/bitrefill";

interface Props {
  wallet: WalletData | null;
  onNavigate: (tab: string) => void;
  onAction: (action: string, payload?: string) => void;
}

interface IntentResult {
  type: "success" | "info" | "navigate" | "error" | "products" | "travel" | "thinking";
  message: string;
  action?: string;
  payload?: string;
  products?: BitrefillProduct[];
  suggestions?: string[];
  destination?: string;
  countryCode?: string;
}

const DEFAULT_SUGGESTIONS = [
  "Show my ETH address",
  "Buy $50 Amazon gift card",
  "I'm going to Japan",
  "Prove I own all chains",
  "Show my gift cards",
];

const COUNTRY_FLAGS: Record<string, string> = {
  JP: "🇯🇵", KR: "🇰🇷", CN: "🇨🇳", HK: "🇭🇰", TW: "🇹🇼",
  TH: "🇹🇭", SG: "🇸🇬", VN: "🇻🇳", MY: "🇲🇾", ID: "🇮🇩",
  PH: "🇵🇭", IN: "🇮🇳", US: "🇺🇸", GB: "🇬🇧", FR: "🇫🇷",
  DE: "🇩🇪", IT: "🇮🇹", ES: "🇪🇸", AU: "🇦🇺", CA: "🇨🇦",
  BR: "🇧🇷", MX: "🇲🇽", AE: "🇦🇪", EG: "🇪🇬", ZA: "🇿🇦",
};

const TRAVEL_TIPS: Record<string, string> = {
  JP: "Tip: Japan eSIM covers Tokyo, Osaka, Kyoto. Most shops accept crypto gift cards.",
  KR: "Tip: Korea has great mobile coverage. Grab a Kakao/Melon card for local apps.",
  CN: "Tip: Grab a Didi card for rides and Meituan for food delivery.",
  TH: "Tip: Thailand eSIM works in Bangkok, Phuket, Chiang Mai.",
  US: "Tip: Amazon US ships nationwide. Uber works in all major cities.",
  SG: "Tip: Singapore is fully cashless. Grab and foodpanda are popular.",
  DEFAULT: "Tip: Check local gift cards and eSIM for the best travel experience.",
};

function parseIntent(input: string, hasWallet: boolean): IntentResult {
  const lower = input.toLowerCase().trim();

  // No wallet guard
  if (
    !hasWallet &&
    !lower.includes("create") &&
    !lower.includes("import") &&
    !lower.includes("restore") &&
    !lower.includes("help")
  ) {
    if (
      lower.includes("address") ||
      lower.includes("sign") ||
      lower.includes("proof") ||
      lower.includes("export") ||
      lower.includes("copy")
    ) {
      return {
        type: "info",
        message: "You need a wallet first. Create one in the Create tab or import an existing mnemonic in the Import tab.",
        suggestions: ["Create wallet", "Import wallet"],
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
    return {
      type: "navigate",
      message: payload ? "Navigating to Sign tab with message: " + payload : "Opening the Sign tab for you.",
      action: "sign",
    };
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
  if (lower.match(/help|what can you|how do i/)) {
    return {
      type: "info",
      message: "I'm your e-commerce wallet assistant. Here's what I can do:\n\n💳 Buy gift cards (Amazon, Steam, Netflix, Uber...)\n📱 Buy eSIM for travel (Japan, Thailand, Europe...)\n👛 Show & manage your gift card vault\n🔐 Prove cross-chain ownership\n✍️ Sign messages & transactions\n🌍 Travel recommendations with local cards\n\nTry saying: \"I'm going to Japan\" or \"Buy $50 Amazon card\"",
      suggestions: DEFAULT_SUGGESTIONS,
    };
  }

  // Gift card vault
  if (lower.match(/my.*gift\s*card|my.*card|show.*vault/)) {
    return { type: "navigate", message: "Opening your gift card vault.", action: "show-vault" };
  }

  // Shop / browse
  if (lower.match(/shop|store|browse|gift\s*card/)) {
    return { type: "navigate", message: "Opening the gift card shop.", action: "show-shop" };
  }

  // === Travel intent detection ===
  const travel = detectTravelIntent(input);
  if (travel) {
    const flag = COUNTRY_FLAGS[travel.countryCode] || "🌍";
    const tip = TRAVEL_TIPS[travel.countryCode] || TRAVEL_TIPS["DEFAULT"];
    const productKeywords = getTravelProducts(travel.countryCode);
    const allProducts: BitrefillProduct[] = [];
    for (const kw of productKeywords) {
      const found = searchProductsByIntent(kw);
      for (const p of found) {
        if (!allProducts.some((x) => x.id === p.id)) {
          allProducts.push(p);
        }
      }
    }

    // Also search for eSIM for this destination
    const esimProducts = searchProductsByIntent("esim " + travel.destination);

    // Merge and deduplicate, prioritize eSIM
    const merged = [...esimProducts, ...allProducts];
    const unique = merged.filter((p, i) => merged.findIndex((x) => x.id === p.id) === i).slice(0, 5);

    if (unique.length > 0) {
      return {
        type: "travel",
        message: flag + " Heading to " + travel.destination + "!\n\n" + tip + "\n\nHere's what I recommend:",
        products: unique,
        destination: travel.destination,
        countryCode: travel.countryCode,
        suggestions: ["Buy " + unique[0].name, "Show my gift cards"],
      };
    }

    return {
      type: "info",
      message: flag + " Heading to " + travel.destination + "! Browse our shop for local gift cards and eSIMs.",
      action: "show-shop",
      suggestions: ["Browse gift cards", "Buy eSIM"],
    };
  }

  // eSIM queries
  if (lower.match(/esim|sim\s*card|data\s*plan|roaming|travel\s+data/)) {
    const esimProducts = searchProductsByIntent("esim");
    if (esimProducts.length > 0) {
      return {
        type: "products",
        message: "Found " + esimProducts.length + " eSIM options for travel:",
        products: esimProducts.slice(0, 4),
        suggestions: ["I'm going to Japan", "I'm going to Thailand"],
      };
    }
  }

  // === Purchase intent with product search ===
  if (isPurchaseQuery(lower)) {
    const intent = parsePurchaseIntent(input);
    if (intent) {
      const products = searchProductsByIntent(intent.productType, intent.denomination);

      if (products.length > 0) {
        const denomStr = intent.denomination
          ? " " + (intent.currency === "CNY" ? "Y" : "$") + intent.denomination
          : "";
        return {
          type: "products",
          message: "Found " + products.length + " matching" + denomStr + " " + intent.productType + " gift card" + (products.length > 1 ? "s" : "") + ":",
          action: "purchase",
          payload: JSON.stringify(intent),
          products: products.slice(0, 3),
        };
      }

      return {
        type: "navigate",
        message: 'Searching for "' + intent.productType + '" gift cards... Opening shop.',
        action: "purchase",
        payload: JSON.stringify(intent),
      };
    }

    return {
      type: "info",
      message: "I can help you buy gift cards! Try something like:",
      suggestions: [
        "Buy $50 Amazon gift card",
        "Buy $25 Steam card",
        "Get a Netflix card",
      ],
    };
  }

  // General questions
  if (isGeneralQuestion(lower)) {
    return {
      type: "info",
      message: "I'm a wallet assistant focused on crypto payments, gift cards, and travel eSIMs. I might not answer general questions, but I can help you with:\n- Buying gift cards with crypto\n- eSIM for travel\n- Wallet operations\n\nWhat would you like to do?",
      suggestions: getSuggestions(input),
    };
  }

  // Product mention without buy keyword
  const productKeywords = [
    "amazon", "steam", "netflix", "spotify", "uber", "apple", "google",
    "playstation", "psn", "xbox", "nintendo", "itunes", "esim",
  ];
  const hasProductMention = productKeywords.some((k) => lower.includes(k));

  if (hasProductMention) {
    const products = searchProductsByIntent(lower);
    if (products.length > 0) {
      return {
        type: "products",
        message: "Found " + products.length + " gift card" + (products.length > 1 ? "s" : "") + " matching your query:",
        products: products.slice(0, 3),
        suggestions: ["Buy $50 " + products[0].name + " card"],
      };
    }
  }

  // Final fallback
  return {
    type: "info",
    message: "I didn't quite catch that. Here are some things I can help with:",
    suggestions: getSuggestions(input),
  };
}

export function AIIntent({ wallet, onNavigate, onAction }: Props) {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<IntentResult[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollTop = resultsRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [results]);

  const executeAction = (result: IntentResult) => {
    if (!result.action) return;
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
        onAction("purchase", result.payload);
        onNavigate("shop");
        break;
      case "show-shop":
      case "show-vault":
        onNavigate("shop");
        break;
    }
  };

  const handleSubmit = () => {
    if (!input.trim() || isThinking) return;
    const userInput = input;
    setInput("");
    setIsThinking(true);

    // Show thinking animation
    setResults((prev) => [...prev.slice(-4), { type: "thinking", message: "Thinking..." }]);

    // Simulate processing delay for better UX
    setTimeout(() => {
      const result = parseIntent(userInput, !!wallet);
      setResults((prev) => {
        const filtered = prev.filter((r) => r.type !== "thinking");
        return [...filtered.slice(-4), result];
      });
      setIsThinking(false);
      executeAction(result);
    }, 600);
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (isThinking) return;
    setInput(suggestion);
    setIsThinking(true);
    setResults((prev) => [...prev.slice(-4), { type: "thinking", message: "Thinking..." }]);

    setTimeout(() => {
      const result = parseIntent(suggestion, !!wallet);
      setResults((prev) => {
        const filtered = prev.filter((r) => r.type !== "thinking");
        return [...filtered.slice(-4), result];
      });
      setIsThinking(false);
      setInput("");
      executeAction(result);
    }, 600);
  };

  const handleProductClick = (product: BitrefillProduct) => {
    const intent = {
      productType: product.name,
      denomination: product.denominations[0],
      currency: product.currency,
      raw: "Buy $" + product.denominations[0] + " " + product.name,
    };
    onAction("purchase", JSON.stringify(intent));
    onNavigate("shop");
  };

  return (
    <div className="mb-4">
      <div
        className="rounded-xl ring-1 ring-[#007fff]/20 bg-white overflow-hidden transition-all duration-300"
        style={{ boxShadow: "0 2px 12px 0 color-mix(in srgb, #007fff 8%, transparent)" }}
      >
        <button
          onClick={() => {
            setIsExpanded(!isExpanded);
            setTimeout(() => inputRef.current?.focus(), 100);
          }}
          className="w-full flex items-center gap-2 px-4 py-3 hover:bg-[#f8fbff] transition-colors"
        >
          <Sparkles className="h-4 w-4 text-[#007fff]" />
          <span className="text-sm font-medium text-[#111d4a]">AI Wallet Assistant</span>
          <span className="text-xs text-[#99a1af] ml-auto">Gift cards, eSIM & crypto payments</span>
        </button>

        {isExpanded && (
          <div className="px-4 pb-4 space-y-3 animate-fade-in-up">
            {results.length > 0 && (
              <div ref={resultsRef} className="space-y-2 max-h-72 overflow-y-auto scroll-smooth">
                {results.map((r, i) => (
                  <div key={i} className="space-y-2">
                    {/* Thinking animation */}
                    {r.type === "thinking" ? (
                      <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-[#f8f9fa] text-[#99a1af]">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>Searching products & gift cards...</span>
                      </div>
                    ) : (
                      <>
                        <div
                          className={"text-xs px-3 py-2 rounded-lg whitespace-pre-line " + (
                            r.type === "success"
                              ? "bg-emerald-50 text-emerald-700"
                              : r.type === "navigate"
                              ? "bg-blue-50 text-blue-700"
                              : r.type === "error"
                              ? "bg-red-50 text-red-700"
                              : r.type === "products"
                              ? "bg-amber-50 text-amber-700"
                              : r.type === "travel"
                              ? "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-800 border border-blue-200"
                              : "bg-[#f8f9fa] text-[#111d4a]"
                          )}
                        >
                          <div className="flex items-start gap-1.5">
                            {r.type === "products" && <Gift className="h-3 w-3 flex-shrink-0 mt-0.5" />}
                            {r.type === "travel" && <Plane className="h-3 w-3 flex-shrink-0 mt-0.5" />}
                            <span className="leading-relaxed">{r.message}</span>
                          </div>
                        </div>

                        {(r.type === "products" || r.type === "travel") && r.products && r.products.length > 0 && (
                          <div className="flex gap-2 overflow-x-auto pb-1">
                            {r.products.map((p) => (
                              <button
                                key={p.id}
                                onClick={() => handleProductClick(p)}
                                className="flex-shrink-0 flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white border border-[#e0e3e8] hover:border-[#007fff] hover:shadow-md transition-all text-left group"
                              >
                                {p.category === "esim" ? (
                                  <Globe className="h-4 w-4 text-cyan-500 group-hover:text-cyan-600" />
                                ) : (
                                  <ShoppingCart className="h-4 w-4 text-[#007fff] group-hover:text-[#006cd9]" />
                                )}
                                <div>
                                  <div className="text-xs font-medium text-[#111d4a] group-hover:text-[#007fff]">{p.name}</div>
                                  <div className="text-[10px] text-[#99a1af] flex items-center gap-1">
                                    <span>{"$" + p.denominations[0]}+</span>
                                    <span>&middot;</span>
                                    <span className="capitalize">{p.category}</span>
                                    {(p.discount ?? 0) > 0 && (
                                      <span className="text-emerald-600 font-medium">
                                        &middot; {(p.discount ?? 0) * 100}% off
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[9px] text-[#b0b5c0] mt-0.5">
                                    {p.supportedCrypto.join(", ")}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        {r.suggestions && r.suggestions.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {r.suggestions.map((s) => (
                              <button
                                key={s}
                                onClick={() => handleSuggestionClick(s)}
                                className="text-[10px] px-2 py-1 rounded-full bg-[#f0f7ff] text-[#007fff] hover:bg-[#e0efff] transition-colors"
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Try: Buy $50 Amazon or I'm going to Japan"
                className="flex-1 text-sm bg-[#f8f9fa] rounded-full px-4 py-2.5 ring-1 ring-[#111d4a]/10 focus:outline-none focus:ring-2 focus:ring-[#007fff]/30 placeholder:text-[#99a1af] disabled:opacity-50"
                disabled={isThinking}
              />
              <button
                onClick={handleSubmit}
                disabled={!input.trim() || isThinking}
                className="p-2.5 rounded-full bg-[#007fff] text-white hover:bg-[#006cd9] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isThinking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {DEFAULT_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSuggestionClick(s)}
                  disabled={isThinking}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-[#f0f7ff] text-[#007fff] hover:bg-[#e0efff] transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                  {s.match(/going to|travel/i) ? <Plane className="h-2.5 w-2.5" /> : <ArrowRight className="h-2.5 w-2.5" />}
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