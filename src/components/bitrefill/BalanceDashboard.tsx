"use client";

import type { ChainAddress } from "@/lib/tcx";

interface Props {
  addresses: ChainAddress[];
  giftCardTotals: Record<string, number>;
}

const chainIcons: Record<string, string> = {
  ETHEREUM: "⟠",
  BITCOIN: "₿",
  TRON: "◎",
};

const chainSymbols: Record<string, string> = {
  ETHEREUM: "ETH",
  BITCOIN: "BTC",
  TRON: "TRX",
};

export function BalanceDashboard({ addresses, giftCardTotals }: Props) {
  const uniqueChains = addresses.reduce<{ chain: string; label: string }[]>((acc, a) => {
    if (!acc.find((x) => x.chain === a.chain)) {
      acc.push({ chain: a.chain, label: a.label });
    }
    return acc;
  }, []);

  const hasGiftCards = Object.keys(giftCardTotals).length > 0;
  const totalGiftCardValue = Object.entries(giftCardTotals)
    .map(([currency, amount]) => `${currency === "CNY" ? "¥" : "$"}${amount}`)
    .join(" + ");

  return (
    <div className="rounded-xl ring-1 ring-[#111d4a]/10 bg-gradient-to-r from-[#f0f7ff] to-white p-4 mb-4" style={{ boxShadow: "0 1px 4px 0 color-mix(in srgb, #111d4a 3%, transparent)" }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm">💰</span>
        <span className="text-xs font-semibold text-[#111d4a] uppercase tracking-wider">
          Your Spending Power
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Crypto */}
        <div>
          <p className="text-[10px] text-[#99a1af] mb-1.5">Crypto Assets</p>
          {uniqueChains.length > 0 ? (
            <div className="space-y-1">
              {uniqueChains.map((c) => (
                <div key={c.chain} className="flex items-center gap-1.5 text-xs">
                  <span>{chainIcons[c.chain] || "●"}</span>
                  <span className="text-[#111d4a] font-medium">0.00</span>
                  <span className="text-[#99a1af]">{chainSymbols[c.chain] || c.chain}</span>
                </div>
              ))}
              <p className="text-[9px] text-[#99a1af] mt-1 italic">Demo — connect for real balances</p>
            </div>
          ) : (
            <p className="text-xs text-[#99a1af]">No wallet</p>
          )}
        </div>

        {/* Gift Cards */}
        <div>
          <p className="text-[10px] text-[#99a1af] mb-1.5">Gift Card Balance</p>
          {hasGiftCards ? (
            <div className="space-y-1">
              {Object.entries(giftCardTotals).map(([currency, amount]) => (
                <div key={currency} className="flex items-center gap-1.5 text-xs">
                  <span>🎁</span>
                  <span className="text-[#111d4a] font-semibold">
                    {currency === "CNY" ? "¥" : "$"}{amount}
                  </span>
                  <span className="text-[#99a1af]">{currency}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#99a1af]">$0</p>
          )}
        </div>
      </div>
    </div>
  );
}
