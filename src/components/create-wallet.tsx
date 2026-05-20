"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Copy, Check, Eye, EyeOff, Loader2 } from "lucide-react";
import type { WalletData, ChainAddress } from "@/lib/tcx";

const chainStyles: Record<string, { border: string; bg: string; icon: string }> = {
  ETHEREUM: { border: "border-l-[#007fff]", bg: "bg-blue-50/50", icon: "⟠" },
  BITCOIN: { border: "border-l-orange-500", bg: "bg-orange-50/50", icon: "₿" },
  TRON: { border: "border-l-red-500", bg: "bg-red-50/50", icon: "◎" },
};

interface Props {
  onWalletCreated: (wallet: WalletData) => void;
  wallet: WalletData | null;
}

export function CreateWallet({ onWalletCreated, wallet }: Props) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedMnemonic, setCopiedMnemonic] = useState(false);
  const [allCopied, setAllCopied] = useState(false);
  const [chainAddresses, setChainAddresses] = useState<ChainAddress[]>([]);

  const handleCreate = async () => {
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { createWallet, deriveAddress, getMnemonic, deriveMultiChainAddresses } =
        await import("@/lib/tcx");
      const { keystoreJson } = await createWallet(password);
      const address = await deriveAddress(keystoreJson, password);
      const mnemonic = await getMnemonic(keystoreJson, password);
      const addresses = await deriveMultiChainAddresses(keystoreJson, password);
      setChainAddresses(addresses);
      onWalletCreated({ keystoreJson, address, mnemonic, password });
    } catch (e: any) {
      setError(e.message || "Failed to create wallet");
    } finally {
      setLoading(false);
    }
  };

  const copyAddress = (addr: string, index: number) => {
    navigator.clipboard.writeText(addr);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const copyMnemonic = () => {
    if (wallet) {
      navigator.clipboard.writeText(wallet.mnemonic);
      setCopiedMnemonic(true);
      setTimeout(() => setCopiedMnemonic(false), 1500);
    }
  };

  const copyAll = () => {
    const text = chainAddresses
      .map((a) => `${a.label}: ${a.address}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 1500);
  };

  return (
    <div className="rounded-xl ring-1 ring-[#111d4a]/10 bg-white p-6" style={{ boxShadow: "0 2px 8px 0 color-mix(in srgb, #111d4a 4%, transparent)" }}>
      <div className="flex items-center gap-2 mb-1">
        <Wallet className="h-5 w-5 text-[#007fff]" />
        <h3 className="text-base font-semibold text-[#111d4a]">Create Wallet</h3>
      </div>
      <p className="text-sm text-[#99a1af] mb-5">
        Create a new multi-chain wallet using Token Core
      </p>

      {!wallet ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#111d4a]">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              className="rounded-xl"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full py-3 rounded-full bg-[#007fff] text-white text-sm font-medium hover:bg-[#006cd9] transition-colors disabled:opacity-50"
            style={{ boxShadow: "0 4px 14px 0 color-mix(in srgb, #007fff 20%, transparent)" }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating wallet...
              </span>
            ) : (
              "Create Wallet"
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-5 animate-fade-in-up">
          {/* Success — 龙图标祝福 */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#f8f9fa] ring-1 ring-[#111d4a]/10">
            <div className="w-10 h-10 rounded-full identity-gradient flex items-center justify-center flex-shrink-0">
              <span className="text-white text-lg">🐉</span>
            </div>
            <div>
              <p className="text-sm font-medium text-[#111d4a]">
                Wallet created — your digital world is ready
              </p>
              <p className="text-xs text-[#99a1af] mt-0.5">
                One seed, five chains, fully under your control
              </p>
            </div>
          </div>

          {/* Mnemonic */}
          <div className="p-3 rounded-xl bg-amber-50 ring-1 ring-amber-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-amber-600 text-sm">🔑</span>
                <span className="text-xs font-medium text-amber-700 uppercase tracking-wider">
                  Secret Recovery Phrase
                </span>
              </div>
              <div className="flex items-center gap-1">
                {showMnemonic && (
                  <button
                    onClick={copyMnemonic}
                    className="p-1 rounded-full hover:bg-amber-100 transition-colors"
                    title="Copy mnemonic"
                  >
                    {copiedMnemonic ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-amber-600" />
                    )}
                  </button>
                )}
                <button
                  onClick={() => setShowMnemonic(!showMnemonic)}
                  className="p-1 rounded-full hover:bg-amber-100 transition-colors"
                >
                  {showMnemonic ? (
                    <EyeOff className="h-3.5 w-3.5 text-amber-600" />
                  ) : (
                    <Eye className="h-3.5 w-3.5 text-amber-600" />
                  )}
                </button>
              </div>
            </div>
            {showMnemonic ? (
              <p className="font-mono text-xs text-amber-800 leading-relaxed break-all">
                {wallet.mnemonic}
              </p>
            ) : (
              <p className="text-xs text-amber-600">
                Click the eye icon to reveal
              </p>
            )}
            <p className="text-[10px] text-amber-500 mt-2">
              ⚠ Never share this phrase. Anyone with it can steal your assets.
            </p>
          </div>

          {/* Multi-Chain Address Tree */}
          {chainAddresses.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">🌱</span>
                <span className="text-xs font-semibold text-[#111d4a] uppercase tracking-wider">
                  Multi-Chain Address Tree
                </span>
              </div>

              {chainAddresses.map((addr, i) => {
                const style = chainStyles[addr.chain] || chainStyles.ETHEREUM;
                return (
                  <div
                    key={i}
                    className={`animate-address-reveal flex items-center justify-between p-3 rounded-xl ring-1 ring-[#111d4a]/10 border-l-4 ${style.border} ${style.bg} bg-[#f8f9fa] hover:shadow-md transition-shadow duration-200`}
                    style={{ animationDelay: `${i * 0.12}s` }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-lg flex-shrink-0">{style.icon}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#111d4a]">
                          {addr.label}
                        </p>
                        <p className="text-xs font-mono text-[#99a1af] truncate max-w-[240px] sm:max-w-[320px]">
                          {addr.address}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => copyAddress(addr.address, i)}
                      className="flex-shrink-0 ml-2 p-1.5 rounded-full hover:bg-[#f0f2f5] transition-colors"
                      title="Copy address"
                    >
                      {copiedIndex === i ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-[#99a1af]" />
                      )}
                    </button>
                  </div>
                );
              })}

              {/* Copy All */}
              <button
                onClick={copyAll}
                className="mt-3 w-full py-2.5 rounded-full bg-[#007fff] text-white text-sm font-medium hover:bg-[#006cd9] transition-colors"
                style={{ boxShadow: "0 4px 14px 0 color-mix(in srgb, #007fff 20%, transparent)" }}
              >
                {allCopied ? "✓ Copied All Addresses" : "Copy All Addresses"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
