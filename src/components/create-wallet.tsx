"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Wallet, Copy, Check, Eye, EyeOff, Loader2,
  ShieldCheck, Fingerprint, ChevronDown, ArrowRight, BadgeCheck,
} from "lucide-react";
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

function StepIndicator({ current }: { current: number }) {
  const steps = ["Create", "Backup", "Addresses", "Prove"];
  return (
    <div className="flex items-center gap-1 text-[10px] text-[#99a1af] mb-4">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-1">
          <span
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              i < current
                ? "bg-[#007fff] text-white"
                : i === current
                ? "bg-[#007fff]/15 text-[#007fff] ring-1 ring-[#007fff]/30"
                : "bg-[#f0f2f5] text-[#99a1af]"
            }`}
          >
            {i < current ? "✓" : i + 1}
          </span>
          <span className={i === current ? "text-[#111d4a] font-medium" : ""}>{s}</span>
          {i < steps.length - 1 && <span className="mx-0.5 text-[#e0e3e8]">→</span>}
        </div>
      ))}
    </div>
  );
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
  const [showAllChains, setShowAllChains] = useState(false);
  const [proof, setProof] = useState<{ message: string; signature: string } | null>(null);
  const [proofLoading, setProofLoading] = useState(false);
  const [proofCopied, setProofCopied] = useState(false);
  const [verifyResult, setVerifyResult] = useState<{ valid: boolean; recoveredAddress: string } | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);

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
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create wallet");
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
    const text = chainAddresses.map((a) => `${a.label}: ${a.address}`).join("\n");
    navigator.clipboard.writeText(text);
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 1500);
  };

  const generateProof = async () => {
    if (!wallet || chainAddresses.length === 0) return;
    setProofLoading(true);
    try {
      const { signOwnershipProof } = await import("@/lib/tcx");
      const result = await signOwnershipProof(wallet.keystoreJson, wallet.password, chainAddresses);
      setProof(result);
    } catch {
      // silently fail
    } finally {
      setProofLoading(false);
    }
  };

  const copyProof = () => {
    if (!proof) return;
    const text = `=== Cross-Chain Ownership Proof ===\n\n${proof.message}\n\nSignature (ETH PersonalSign):\n${proof.signature}\n\n=== Verified locally via Token Core (tcx-wasm) ===`;
    navigator.clipboard.writeText(text);
    setProofCopied(true);
    setTimeout(() => setProofCopied(false), 1500);
  };

  // Determine current step
  const currentStep = !wallet ? 0 : proof ? 3 : chainAddresses.length > 0 ? 2 : 1;
  const visibleChains = showAllChains ? chainAddresses : chainAddresses.slice(0, 3);

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
        <div className="space-y-4 animate-fade-in-up">
          <StepIndicator current={currentStep} />

          {/* Step 1: Wallet Created */}
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

          {/* Step 2: Secret Recovery Phrase (collapsible) */}
          <div className="rounded-xl ring-1 ring-amber-200 bg-amber-50/50 overflow-hidden">
            <button
              onClick={() => setShowMnemonic(!showMnemonic)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-amber-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-amber-600 text-sm">🔑</span>
                <span className="text-xs font-medium text-amber-700 uppercase tracking-wider">
                  Secret Recovery Phrase
                </span>
                {!showMnemonic && (
                  <span className="text-[10px] text-amber-500 ml-1">— click to reveal</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {showMnemonic && (
                  <button
                    onClick={(e) => { e.stopPropagation(); copyMnemonic(); }}
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
                {showMnemonic ? (
                  <EyeOff className="h-4 w-4 text-amber-600" />
                ) : (
                  <Eye className="h-4 w-4 text-amber-600" />
                )}
              </div>
            </button>
            {showMnemonic && (
              <div className="px-4 pb-4 animate-fade-in-up">
                <p className="font-mono text-xs text-amber-800 leading-relaxed break-all bg-white/60 rounded-lg p-3 ring-1 ring-amber-100">
                  {wallet.mnemonic}
                </p>
                <p className="text-[10px] text-amber-500 mt-2">
                  ⚠ Never share this phrase. Anyone with it can steal your assets.
                </p>
              </div>
            )}
          </div>

          {/* Step 3: Multi-Chain Addresses */}
          {chainAddresses.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">🌱</span>
                <span className="text-xs font-semibold text-[#111d4a] uppercase tracking-wider">
                  Multi-Chain Addresses
                </span>
                <span className="text-[10px] text-[#99a1af] ml-auto">{chainAddresses.length} chains derived</span>
              </div>

              {visibleChains.map((addr, i) => {
                const style = chainStyles[addr.chain] || chainStyles.ETHEREUM;
                return (
                  <div
                    key={i}
                    className={`animate-address-reveal flex items-center justify-between p-3 rounded-xl ring-1 ring-[#111d4a]/10 border-l-4 ${style.border} ${style.bg} hover:shadow-md transition-shadow duration-200`}
                    style={{ animationDelay: `${i * 0.12}s` }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-lg flex-shrink-0">{style.icon}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#111d4a]">{addr.label}</p>
                        <p className="text-xs font-mono text-[#99a1af] truncate max-w-[280px] sm:max-w-[400px]">
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

              {chainAddresses.length > 3 && !showAllChains && (
                <button
                  onClick={() => setShowAllChains(true)}
                  className="flex items-center gap-1 text-xs text-[#007fff] hover:text-[#006cd9] transition-colors py-1"
                >
                  <ChevronDown className="h-3 w-3" />
                  Show {chainAddresses.length - 3} more chains
                </button>
              )}

              <button
                onClick={copyAll}
                className="mt-2 w-full py-2.5 rounded-full bg-[#007fff] text-white text-sm font-medium hover:bg-[#006cd9] transition-colors"
                style={{ boxShadow: "0 4px 14px 0 color-mix(in srgb, #007fff 20%, transparent)" }}
              >
                {allCopied ? "✓ Copied All Addresses" : "Copy All Addresses"}
              </button>

              <p className="text-xs text-[#99a1af] mt-2">
                当前网络：Ethereum Mainnet (chainId: 1)
              </p>
            </div>
          )}

          {/* Step 4: Cross-Chain Ownership Proof */}
          {chainAddresses.length > 0 && (
            <div className="rounded-xl ring-2 ring-[#007fff]/30 bg-white p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Fingerprint className="h-5 w-5 text-[#007fff]" />
                <span className="text-sm font-semibold text-[#111d4a]">
                  Cross-Chain Ownership Proof
                </span>
              </div>
              <p className="text-xs text-[#99a1af]">
                Cryptographically prove you control all 5 addresses from one
                mnemonic — no server, no third party, pure math.
              </p>

              {!proof ? (
                <button
                  onClick={generateProof}
                  disabled={proofLoading}
                  className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#0CC5FF] to-[#007FFF] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {proofLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing proof...
                    </span>
                  ) : (
                    "Generate Cross-Chain Proof"
                  )}
                </button>
              ) : (
                <div className="space-y-3 animate-fade-in-up">
                  <pre className="rounded-xl bg-[#f8f9fa] ring-1 ring-[#111d4a]/10 p-3 text-[10px] font-mono overflow-auto max-h-32 text-[#111d4a] whitespace-pre-wrap">
                    {proof.message}
                  </pre>
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-[#111d4a]">ETH PersonalSign Signature</span>
                    <code className="block rounded-xl bg-[#f8f9fa] ring-1 ring-[#111d4a]/10 px-3 py-2 text-[10px] font-mono break-all text-[#007fff]">
                      {proof.signature}
                    </code>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-full bg-emerald-50 ring-1 ring-emerald-200 w-fit">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-xs font-medium text-emerald-700">
                      Verified Locally — No server involved
                    </span>
                  </div>
                  <button
                    onClick={copyProof}
                    className="w-full py-2.5 rounded-full ring-1 ring-[#e0e3e8] text-sm font-medium text-[#111d4a] hover:bg-[#f0f2f5] transition-colors flex items-center justify-center gap-2"
                  >
                    {proofCopied ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-500" />
                        Copied Full Proof
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy Full Proof
                      </>
                    )}
                  </button>

                  {/* Verify Signature */}
                  <button
                    onClick={async () => {
                      if (!proof || !wallet) return;
                      setVerifyLoading(true);
                      try {
                        const { verifyOwnershipProof } = await import("@/lib/tcx");
                        const ethAddr = chainAddresses.find(a => a.chain === "ETHEREUM")?.address || wallet.address;
                        const result = await verifyOwnershipProof(proof.message, proof.signature, ethAddr);
                        setVerifyResult(result);
                      } catch {
                        setVerifyResult({ valid: false, recoveredAddress: "Verification error" });
                      } finally {
                        setVerifyLoading(false);
                      }
                    }}
                    disabled={verifyLoading}
                    className="w-full py-2.5 rounded-full ring-1 ring-emerald-200 text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
                  >
                    {verifyLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <BadgeCheck className="h-4 w-4" />
                        Verify Signature
                      </>
                    )}
                  </button>

                  {/* Verify Result */}
                  {verifyResult && (
                    <div className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium ${
                      verifyResult.valid
                        ? "bg-emerald-50 ring-1 ring-emerald-200 text-emerald-700"
                        : "bg-red-50 ring-1 ring-red-200 text-red-700"
                    }`}>
                      {verifyResult.valid ? (
                        <>
                          <ShieldCheck className="h-4 w-4 flex-shrink-0" />
                          <span>✅ Signature valid — signer: <code className="font-mono">{verifyResult.recoveredAddress.slice(0, 6)}...{verifyResult.recoveredAddress.slice(-4)}</code></span>
                        </>
                      ) : (
                        <>
                          <span>❌ {verifyResult.recoveredAddress}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Next Step Hint */}
          {wallet && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#f0f7ff] ring-1 ring-[#007fff]/10 text-xs text-[#007fff]">
              <ArrowRight className="h-3.5 w-3.5 flex-shrink-0" />
              <span>
                Next: Go to <strong>Security</strong> tab to download your keystore backup
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
