"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PenLine, Copy, Check, Loader2, Send } from "lucide-react";
import type { WalletData } from "@/lib/tcx";

interface Props {
  wallet: WalletData | null;
}

export function SignMessage({ wallet }: Props) {
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Transaction signing state
  const [txTo, setTxTo] = useState("0x0000000000000000000000000000000000000000");
  const [txAmount, setTxAmount] = useState("0.01");
  const [txGasLimit, setTxGasLimit] = useState("21000");
  const [txChainId, setTxChainId] = useState("1");
  const [txSignature, setTxSignature] = useState("");
  const [txLoading, setTxLoading] = useState(false);
  const [txError, setTxError] = useState("");
  const [txCopied, setTxCopied] = useState(false);

  const handleSign = async () => {
    if (!wallet || !message) return;
    setLoading(true);
    setError("");
    try {
      const { signMessage } = await import("@/lib/tcx");
      const sig = await signMessage(
        wallet.keystoreJson,
        wallet.password,
        message
      );
      setSignature(sig);
    } catch (e: any) {
      setError(e.message || "Failed to sign");
    } finally {
      setLoading(false);
    }
  };

  const copySignature = () => {
    navigator.clipboard.writeText(signature);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSignTx = async () => {
    if (!wallet) return;
    setTxLoading(true);
    setTxError("");
    try {
      const { signTransaction } = await import("@/lib/tcx");
      const sig = await signTransaction(
        wallet.keystoreJson,
        wallet.password,
        {
          to: txTo,
          amount: txAmount,
          gasLimit: txGasLimit,
          chainId: parseInt(txChainId),
        }
      );
      setTxSignature(sig);
    } catch (e: any) {
      setTxError(e.message || "Transaction signing failed");
    } finally {
      setTxLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sign Message Card */}
      <div className="rounded-xl ring-1 ring-[#111d4a]/10 bg-white p-6" style={{ boxShadow: "0 2px 8px 0 color-mix(in srgb, #111d4a 4%, transparent)" }}>
        <div className="flex items-center gap-2 mb-1">
          <PenLine className="h-5 w-5 text-[#007fff]" />
          <h3 className="text-base font-semibold text-[#111d4a]">Sign Message</h3>
        </div>
        <p className="text-sm text-[#99a1af] mb-5">
          Sign a message to prove you own this wallet — no server involved
        </p>

        <div className="space-y-4">
          {!wallet && (
            <div className="rounded-xl bg-[#f8f9fa] ring-1 ring-[#111d4a]/10 px-3 py-3 text-sm text-[#99a1af]">
              Create a wallet first to sign messages
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-[#111d4a]">Message</Label>
            <Input
              id="message"
              placeholder="Enter message to sign"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={!wallet}
              onKeyDown={(e) => e.key === "Enter" && handleSign()}
              className="rounded-xl"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            onClick={handleSign}
            disabled={!wallet || loading || !message}
            className="w-full py-3 rounded-full bg-[#007fff] text-white text-sm font-medium hover:bg-[#006cd9] transition-colors disabled:opacity-50"
            style={{ boxShadow: "0 4px 14px 0 color-mix(in srgb, #007fff 20%, transparent)" }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing...
              </span>
            ) : (
              "Sign Message"
            )}
          </button>
          {signature && (
            <div className="space-y-1.5 animate-fade-in-up">
              <div className="flex items-center justify-between">
                <Label className="text-[#111d4a]">Signature</Label>
                <button
                  onClick={copySignature}
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-xs hover:bg-[#f0f2f5] transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-500" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 text-[#99a1af]" />
                      <span className="text-[#99a1af]">Copy</span>
                    </>
                  )}
                </button>
              </div>
              <code className="block rounded-xl bg-[#f8f9fa] ring-1 ring-[#111d4a]/10 px-3 py-2 text-xs font-mono break-all text-[#111d4a]">
                {signature}
              </code>
            </div>
          )}
        </div>
      </div>

      {/* Offline Transaction Signing Card */}
      <div className="rounded-xl ring-1 ring-[#111d4a]/10 bg-white p-6" style={{ boxShadow: "0 2px 8px 0 color-mix(in srgb, #111d4a 4%, transparent)" }}>
        <div className="flex items-center gap-2 mb-1">
          <Send className="h-5 w-5 text-[#007fff]" />
          <h3 className="text-base font-semibold text-[#111d4a]">Offline Transaction Signing</h3>
        </div>
        <p className="text-sm text-[#99a1af] mb-5">
          Construct and sign an ETH transfer locally — nothing is broadcast
        </p>

        {!wallet ? (
          <div className="rounded-xl bg-[#f8f9fa] ring-1 ring-[#111d4a]/10 px-3 py-3 text-sm text-[#99a1af]">
            Create a wallet first to sign transactions
          </div>
        ) : (
          <div className="space-y-4">
            {/* To Address */}
            <div className="space-y-2">
              <Label htmlFor="tx-to" className="text-[#111d4a]">To Address</Label>
              <Input
                id="tx-to"
                placeholder="0x..."
                value={txTo}
                onChange={(e) => setTxTo(e.target.value)}
                className="rounded-xl font-mono text-xs"
              />
            </div>

            {/* Amount + Gas Limit row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="tx-amount" className="text-[#111d4a]">Amount (ETH)</Label>
                <Input
                  id="tx-amount"
                  type="number"
                  step="0.001"
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tx-gas" className="text-[#111d4a]">Gas Limit</Label>
                <Input
                  id="tx-gas"
                  type="number"
                  value={txGasLimit}
                  onChange={(e) => setTxGasLimit(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            </div>

            {/* Chain ID */}
            <div className="space-y-2">
              <Label htmlFor="tx-chain" className="text-[#111d4a]">Chain ID</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="tx-chain"
                  type="number"
                  value={txChainId}
                  onChange={(e) => setTxChainId(e.target.value)}
                  className="rounded-xl w-24"
                />
                <Badge variant="secondary" className="text-xs rounded-full">
                  {txChainId === "1" ? "Ethereum Mainnet" : txChainId === "11155111" ? "Sepolia" : `Chain ${txChainId}`}
                </Badge>
              </div>
            </div>

            {txError && <p className="text-sm text-destructive">{txError}</p>}

            {/* Sign button */}
            <button
              onClick={handleSignTx}
              disabled={txLoading}
              className="w-full py-3 rounded-full bg-[#007fff] text-white text-sm font-medium hover:bg-[#006cd9] transition-colors disabled:opacity-50"
              style={{ boxShadow: "0 4px 14px 0 color-mix(in srgb, #007fff 20%, transparent)" }}
            >
              {txLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing transaction...
                </span>
              ) : (
                "Sign Transaction"
              )}
            </button>

            {/* Result */}
            {txSignature && (
              <div className="space-y-1.5 animate-fade-in-up">
                <div className="flex items-center justify-between">
                  <Label className="text-[#111d4a]">Signed Transaction</Label>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(txSignature);
                      setTxCopied(true);
                      setTimeout(() => setTxCopied(false), 1500);
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded-full text-xs hover:bg-[#f0f2f5] transition-colors"
                  >
                    {txCopied ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-500" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 text-[#99a1af]" />
                        <span className="text-[#99a1af]">Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <code className="block rounded-xl bg-[#f8f9fa] ring-1 ring-[#111d4a]/10 px-3 py-2 text-xs font-mono break-all text-[#111d4a]">
                  {txSignature}
                </code>
                <div className="flex items-center gap-2 p-2 rounded-full bg-[#f0f7ff] ring-1 ring-[#007fff]/10 w-fit">
                  <span className="text-[10px] text-[#007fff] font-medium">
                    Signed but NOT broadcast — you control when to submit
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
