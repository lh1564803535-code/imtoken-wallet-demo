"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Copy, Check, Loader2, ShieldCheck, Fingerprint } from "lucide-react";
import type { WalletData, ChainAddress } from "@/lib/tcx";

const chainStyles: Record<string, { border: string; bg: string; icon: string }> = {
  ETHEREUM: { border: "border-l-[#007fff]", bg: "bg-blue-50/50", icon: "⟠" },
  BITCOIN: { border: "border-l-orange-500", bg: "bg-orange-50/50", icon: "₿" },
  TRON: { border: "border-l-red-500", bg: "bg-red-50/50", icon: "◎" },
};

interface Props {
  onWalletImported: (wallet: WalletData) => void;
  wallet: WalletData | null;
}

export function ImportWallet({ onWalletImported, wallet }: Props) {
  const [mnemonic, setMnemonic] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [chainAddresses, setChainAddresses] = useState<ChainAddress[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [allCopied, setAllCopied] = useState(false);
  const [proof, setProof] = useState<{ message: string; signature: string } | null>(null);
  const [proofLoading, setProofLoading] = useState(false);
  const [proofCopied, setProofCopied] = useState(false);

  const handleImport = async () => {
    const words = mnemonic.trim().split(/\s+/);
    if (words.length !== 12 && words.length !== 24) {
      setError("Please enter a valid 12 or 24 word mnemonic phrase");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { importWallet, deriveMultiChainAddresses } = await import("@/lib/tcx");
      const { keystoreJson, address } = await importWallet(mnemonic, password);
      const addresses = await deriveMultiChainAddresses(keystoreJson, password);
      setChainAddresses(addresses);
      onWalletImported({ keystoreJson, address, mnemonic: mnemonic.trim(), password });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to import wallet. Please check your mnemonic phrase.");
    } finally {
      setLoading(false);
    }
  };

  const copyAddress = (addr: string, index: number) => {
    navigator.clipboard.writeText(addr);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const copyAll = () => {
    const text = chainAddresses
      .map((a) => `${a.label}: ${a.address}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 1500);
  };

  const generateProof = async () => {
    if (!wallet || chainAddresses.length === 0) return;
    setProofLoading(true);
    try {
      const { signOwnershipProof } = await import("@/lib/tcx");
      const result = await signOwnershipProof(
        wallet.keystoreJson,
        wallet.password,
        chainAddresses
      );
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

  const imported = wallet && chainAddresses.length > 0;

  return (
    <div className="rounded-xl ring-1 ring-[#111d4a]/10 bg-white p-6" style={{ boxShadow: "0 2px 8px 0 color-mix(in srgb, #111d4a 4%, transparent)" }}>
      <div className="flex items-center gap-2 mb-1">
        <Download className="h-5 w-5 text-[#007fff]" />
        <h3 className="text-base font-semibold text-[#111d4a]">Import Wallet</h3>
      </div>
      <p className="text-sm text-[#99a1af] mb-5">
        Restore your wallet from a mnemonic phrase — prove you&apos;re always in control
      </p>

      {!imported ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mnemonic" className="text-[#111d4a]">Recovery Phrase</Label>
            <textarea
              id="mnemonic"
              placeholder="Enter your 12 or 24 word mnemonic phrase, separated by spaces"
              value={mnemonic}
              onChange={(e) => setMnemonic(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[80px] resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="import-password" className="text-[#111d4a]">Encryption Password</Label>
            <Input
              id="import-password"
              type="password"
              placeholder="Password to encrypt keystore (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleImport()}
              className="rounded-xl"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            onClick={handleImport}
            disabled={loading}
            className="w-full py-3 rounded-full bg-[#007fff] text-white text-sm font-medium hover:bg-[#006cd9] transition-colors disabled:opacity-50"
            style={{ boxShadow: "0 4px 14px 0 color-mix(in srgb, #007fff 20%, transparent)" }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Restoring wallet...
              </span>
            ) : (
              "Restore Wallet"
            )}
          </button>
          <p className="text-[10px] text-[#99a1af] text-center">
            Your mnemonic never leaves this browser. All cryptography runs locally via WASM.
          </p>
        </div>
      ) : (
        <div className="space-y-5 animate-fade-in-up">
          {/* Success */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#f8f9fa] ring-1 ring-[#111d4a]/10">
            <div className="w-10 h-10 rounded-full identity-gradient flex items-center justify-center flex-shrink-0">
              <span className="text-white text-lg">✅</span>
            </div>
            <div>
              <p className="text-sm font-medium text-[#111d4a]">
                Wallet restored successfully
              </p>
              <p className="text-xs text-[#99a1af] mt-0.5">
                Same seed, same addresses — your keys, your control
              </p>
            </div>
          </div>

          {/* Multi-Chain Address Tree */}
          {chainAddresses.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">🌱</span>
                <span className="text-xs font-semibold text-[#111d4a] uppercase tracking-wider">
                  Recovered Address Tree
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

              <button
                onClick={copyAll}
                className="mt-3 w-full py-2.5 rounded-full bg-[#007fff] text-white text-sm font-medium hover:bg-[#006cd9] transition-colors"
                style={{ boxShadow: "0 4px 14px 0 color-mix(in srgb, #007fff 20%, transparent)" }}
              >
                {allCopied ? "✓ Copied All Addresses" : "Copy All Addresses"}
              </button>
            </div>
          )}

          {/* Cross-Chain Ownership Proof */}
          {chainAddresses.length > 0 && (
            <div className="rounded-xl ring-2 ring-[#007fff]/30 bg-white p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Fingerprint className="h-5 w-5 text-[#007fff]" />
                <span className="text-sm font-semibold text-[#111d4a]">
                  Cross-Chain Ownership Proof
                </span>
              </div>
              <p className="text-xs text-[#99a1af]">
                Cryptographically prove you control all recovered addresses — no server, pure math.
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
                    <span className="text-xs font-medium text-[#111d4a]">
                      ETH PersonalSign Signature
                    </span>
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
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
