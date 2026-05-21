"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PenLine, Copy, Check, Loader2 } from "lucide-react";
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

  return (
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
  );
}
