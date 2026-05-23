"use client";

import { useState, useEffect } from "react";
import { Wallet, Gift, TrendingUp, RefreshCw, ExternalLink } from "lucide-react";
import type { WalletData, ChainAddress } from "@/lib/tcx";

interface Props {
  wallet: WalletData | null;
  addresses: ChainAddress[];
  giftCardTotals: Record<string, number>;
}

interface ChainBalance {
  chain: string;
  label: string;
  symbol: string;
  icon: string;
  balance: string;
  loading: boolean;
}

const CHAIN_CONFIG: Record<string, { icon: string; symbol: string; rpc: string; explorer: string }> = {
  ETHEREUM: { icon: "🔷", symbol: "ETH", rpc: "https://rpc.sepolia.org", explorer: "https://sepolia.etherscan.io" },
  BITCOIN: { icon: "₿", symbol: "BTC", rpc: "", explorer: "https://blockstream.info/testnet" },
  TRON: { icon: "◈", symbol: "TRX", rpc: "", explorer: "https://shasta.tronscan.org" },
};

export function BalanceDashboard({ wallet, addresses, giftCardTotals }: Props) {
  const [chainBalances, setChainBalances] = useState<ChainBalance[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBalances = async () => {
    if (!wallet?.address || addresses.length === 0) {
      setChainBalances([]);
      return;
    }

    setRefreshing(true);

    // Initialize with loading state
    const initial: ChainBalance[] = addresses
      .filter((a, i, arr) => arr.findIndex((x) => x.chain === a.chain) === i)
      .map((a) => {
        const config = CHAIN_CONFIG[a.chain] || { icon: "🔗", symbol: a.chain, rpc: "", explorer: "" };
        return {
          chain: a.chain,
          label: a.label,
          symbol: config.symbol,
          icon: config.icon,
          balance: "0.00",
          loading: config.rpc !== "",
        };
      });
    setChainBalances(initial);

    // Fetch ETH balance from Sepolia
    try {
      const { ethers } = await import("ethers");
      const provider = new ethers.JsonRpcProvider("https://rpc.sepolia.org");
      const balance = await provider.getBalance(wallet.address);
      const formatted = parseFloat(ethers.formatEther(balance)).toFixed(4);

      setChainBalances((prev) =>
        prev.map((c) =>
          c.chain === "ETHEREUM" ? { ...c, balance: formatted, loading: false } : c
        )
      );
    } catch {
      setChainBalances((prev) =>
        prev.map((c) => (c.chain === "ETHEREUM" ? { ...c, balance: "0.00", loading: false } : c))
      );
    }

    setRefreshing(false);
  };

  useEffect(() => {
    fetchBalances();
  }, [wallet?.address, addresses.length]);

  const hasGiftCards = Object.keys(giftCardTotals).length > 0;
  const totalCrypto = chainBalances.reduce((sum, c) => {
    if (c.symbol === "ETH") return sum + parseFloat(c.balance) * 3500;
    return sum;
  }, 0);
  const totalGiftCards = Object.values(giftCardTotals).reduce((sum, v) => sum + v, 0);

  return (
    <div className="rounded-xl ring-1 ring-[#111d4a]/10 bg-white overflow-hidden mb-4" style={{ boxShadow: "0 2px 8px 0 color-mix(in srgb, #111d4a 4%, transparent)" }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#007fff] to-[#0cc5ff] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-white" />
          <span className="text-sm font-semibold text-white">Portfolio</span>
        </div>
        <button
          onClick={fetchBalances}
          disabled={refreshing || !wallet}
          className="p-1.5 rounded-full hover:bg-white/20 transition-colors disabled:opacity-30"
          title="Refresh balances"
        >
          <RefreshCw className={"h-3.5 w-3.5 text-white" + (refreshing ? " animate-spin" : "")} />
        </button>
      </div>

      {/* Total Value */}
      <div className="px-4 py-3 bg-gradient-to-b from-[#f0f7ff] to-white border-b border-[#e0e3e8]/50">
        <p className="text-[10px] text-[#99a1af] uppercase tracking-wider">Total Value (Est.)</p>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-xl font-bold text-[#111d4a]">
            ${(totalCrypto + totalGiftCards).toFixed(2)}
          </span>
          <span className="text-[10px] text-[#99a1af]">USD</span>
        </div>
        <div className="flex gap-3 mt-1.5 text-[10px] text-[#99a1af]">
          <span>Crypto: ${totalCrypto.toFixed(2)}</span>
          <span>&middot;</span>
          <span>Gift Cards: ${totalGiftCards.toFixed(2)}</span>
        </div>
      </div>

      {/* Chain Balances */}
      {wallet ? (
        <div className="px-4 py-3 space-y-2">
          {chainBalances.map((c) => (
            <div key={c.chain} className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2">
                <span className="text-base">{c.icon}</span>
                <div>
                  <p className="text-xs font-medium text-[#111d4a]">{c.label}</p>
                  <p className="text-[10px] text-[#99a1af]">{c.chain}</p>
                </div>
              </div>
              <div className="text-right">
                {c.loading ? (
                  <span className="text-xs text-[#99a1af]">Loading...</span>
                ) : (
                  <div>
                    <p className="text-xs font-medium text-[#111d4a]">{c.balance} {c.symbol}</p>
                    {c.symbol === "ETH" && (
                      <p className="text-[10px] text-[#99a1af]">${(parseFloat(c.balance) * 3500).toFixed(2)}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Sepolia badge */}
          <div className="pt-1.5 border-t border-[#e0e3e8]/50">
            <span className="text-[9px] text-[#99a1af] italic">Sepolia Testnet &middot; Not real funds</span>
          </div>
        </div>
      ) : (
        <div className="px-4 py-6 text-center">
          <Wallet className="h-8 w-8 text-[#99a1af] mx-auto mb-2" />
          <p className="text-xs text-[#99a1af]">Create or import a wallet to see your portfolio</p>
        </div>
      )}

      {/* Gift Cards */}
      {hasGiftCards && (
        <div className="px-4 py-3 bg-[#f8f9fa] border-t border-[#e0e3e8]/50">
          <div className="flex items-center gap-1.5 mb-2">
            <Gift className="h-3.5 w-3.5 text-[#007fff]" />
            <span className="text-xs font-medium text-[#111d4a]">Gift Card Balance</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(giftCardTotals).map(([currency, amount]) => (
              <div key={currency} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white ring-1 ring-[#e0e3e8]">
                <span className="text-xs font-semibold text-[#111d4a]">
                  {currency === "CNY" ? "\u00a5" : "$"}{amount}
                </span>
                <span className="text-[10px] text-[#99a1af]">{currency}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}