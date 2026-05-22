"use client";

import { useState, useEffect } from "react";
import type { WalletData, ChainAddress } from "@/lib/tcx";

interface Props {
  wallet: WalletData | null;
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

export function BalanceDashboard({ wallet, addresses, giftCardTotals }: Props) {
  const [ethBalance, setEthBalance] = useState<string | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);

  useEffect(() => {
    if (!wallet?.address) {
      setEthBalance(null);
      return;
    }
    let cancelled = false;
    setBalanceLoading(true);
    (async () => {
      try {
        const { ethers } = await import("ethers");
        const provider = new ethers.JsonRpcProvider("https://rpc.sepolia.org");
        const balance = await provider.getBalance(wallet.address);
        if (!cancelled) {
          setEthBalance(ethers.formatEther(balance));
        }
      } catch {
        if (!cancelled) {
          setEthBalance("0.0");
        }
      } finally {
        if (!cancelled) {
          setBalanceLoading(false);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [wallet?.address]);

  const uniqueChains = addresses.reduce<{ chain: string; label: string }[]>((acc, a) => {
    if (!acc.find((x) => x.chain === a.chain)) {
      acc.push({ chain: a.chain, label: a.label });
    }
    return acc;
  }, []);

  const hasGiftCards = Object.keys(giftCardTotals).length > 0;

  return (
    <div className="rounded-xl ring-1 ring-[#111d4a]/10 bg-gradient-to-r from-[#f0f7ff] to-white p-4 mb-4" style={{ boxShadow: "0 1px 4px 0 color-mix(in srgb, #111d4a 3%, transparent)" }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm">💰</span>
        <span className="text-xs font-semibold text-[#111d4a] uppercase tracking-wider">
          Your Spending Power
        </span>
        {balanceLoading && (
          <span className="text-[9px] text-[#99a1af] ml-auto">Querying Sepolia...</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Crypto */}
        <div>
          <p className="text-[10px] text-[#99a1af] mb-1.5">Crypto Assets</p>
          {wallet ? (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs">
                <span>{chainIcons.ETHEREUM}</span>
                <span className="text-[#111d4a] font-medium">
                  {ethBalance !== null ? parseFloat(ethBalance).toFixed(4) : "0.00"}
                </span>
                <span className="text-[#99a1af]">ETH</span>
              </div>
              {uniqueChains.filter(c => c.chain !== "ETHEREUM").map((c) => (
                <div key={c.chain} className="flex items-center gap-1.5 text-xs">
                  <span>{chainIcons[c.chain] || "●"}</span>
                  <span className="text-[#111d4a] font-medium">0.00</span>
                  <span className="text-[#99a1af]">{chainSymbols[c.chain] || c.chain}</span>
                </div>
              ))}
              {ethBalance !== null && parseFloat(ethBalance) === 0 && (
                <p className="text-[9px] text-[#99a1af] mt-1 italic">No test ETH yet</p>
              )}
              <p className="text-[9px] text-[#99a1af] mt-0.5 italic">Sepolia Testnet</p>
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
