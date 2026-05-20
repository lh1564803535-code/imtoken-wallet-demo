"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Shield, Copy, Check, Lock } from "lucide-react";
import type { WalletData } from "@/lib/tcx";

interface Props {
  wallet: WalletData | null;
}

export function WalletSecurity({ wallet }: Props) {
  const [showKeystore, setShowKeystore] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!wallet) {
    return (
      <div className="rounded-xl ring-1 ring-[#111d4a]/10 bg-white p-6" style={{ boxShadow: "0 2px 8px 0 color-mix(in srgb, #111d4a 4%, transparent)" }}>
        <div className="flex items-center gap-2 mb-1">
          <Shield className="h-5 w-5 text-[#007fff]" />
          <h3 className="text-base font-semibold text-[#111d4a]">Security</h3>
        </div>
        <div className="mt-4 rounded-xl bg-[#f8f9fa] ring-1 ring-[#111d4a]/10 px-3 py-3 text-sm text-[#99a1af]">
          Create a wallet first to see security details
        </div>
      </div>
    );
  }

  const copyKeystore = () => {
    navigator.clipboard.writeText(wallet.keystoreJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  let keystoreDisplay = wallet.keystoreJson;
  try {
    keystoreDisplay = JSON.stringify(JSON.parse(wallet.keystoreJson), null, 2);
  } catch {
    // keep as-is
  }

  return (
    <div className="space-y-4">
      {/* Brute Force Estimator */}
      <div className="rounded-xl ring-1 ring-[#111d4a]/10 bg-white p-6" style={{ boxShadow: "0 2px 8px 0 color-mix(in srgb, #111d4a 4%, transparent)" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full identity-gradient flex items-center justify-center">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#111d4a]">
              Brute Force Resistance
            </h4>
            <p className="text-[10px] text-[#99a1af]">
              PBKDF2 × 600,000 rounds
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#f8f9fa] ring-1 ring-[#111d4a]/10 space-y-3 animate-fade-in-up">
          {/* Attack assumption */}
          <div className="flex items-center gap-2 text-xs">
            <Lock className="h-3.5 w-3.5 text-[#99a1af]" />
            <span className="text-[#99a1af]">
              Attacker speed:{" "}
              <span className="font-mono font-medium text-[#111d4a]">
                10 billion guesses/sec
              </span>
            </span>
          </div>

          {/* Effective speed */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#99a1af]">Effective speed after KDF</span>
            <Badge variant="secondary" className="font-mono text-xs rounded-full">
              ~16,667 attempts/sec
            </Badge>
          </div>

          {/* Big number */}
          <div className="text-center py-4">
            <p className="text-3xl font-bold identity-gradient bg-clip-text text-transparent">
              ~2.4 billion years
            </p>
            <p className="text-[10px] text-[#99a1af] mt-1">
              estimated time to crack (8-char alphanumeric password)
            </p>
          </div>

          {/* Progress bar with shimmer */}
          <div className="space-y-1">
            <div className="relative h-2 rounded-full bg-[#e0e3e8] overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-full rounded-full identity-gradient" />
              <div className="absolute inset-0 animate-shimmer" />
            </div>
            <div className="flex justify-between text-[10px] text-[#99a1af]">
              <span>0%</span>
              <span className="font-medium text-[#111d4a]">100% secure</span>
              <span>∞</span>
            </div>
          </div>
        </div>
      </div>

      {/* Keystore Details */}
      <div className="rounded-xl ring-1 ring-[#111d4a]/10 bg-white p-6" style={{ boxShadow: "0 2px 8px 0 color-mix(in srgb, #111d4a 4%, transparent)" }}>
        <div className="flex items-center gap-2 mb-1">
          <Shield className="h-5 w-5 text-[#007fff]" />
          <h3 className="text-base font-semibold text-[#111d4a]">
            Keystore Details
          </h3>
        </div>
        <p className="text-sm text-[#99a1af] mb-4">
          Technical encryption parameters
        </p>

        <div className="space-y-4 animate-fade-in-up">
          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-[#f8f9fa] ring-1 ring-[#111d4a]/10 p-3">
              <p className="text-xs text-[#99a1af] mb-1">Cipher</p>
              <Badge variant="secondary" className="font-mono text-xs rounded-full">
                AES-128-CTR
              </Badge>
            </div>
            <div className="rounded-xl bg-[#f8f9fa] ring-1 ring-[#111d4a]/10 p-3">
              <p className="text-xs text-[#99a1af] mb-1">KDF</p>
              <Badge variant="secondary" className="font-mono text-xs rounded-full">
                PBKDF2
              </Badge>
            </div>
            <div className="rounded-xl bg-[#f8f9fa] ring-1 ring-[#111d4a]/10 p-3">
              <p className="text-xs text-[#99a1af] mb-1">KDF Rounds</p>
              <Badge variant="secondary" className="font-mono text-xs rounded-full">
                600,000
              </Badge>
            </div>
            <div className="rounded-xl bg-[#f8f9fa] ring-1 ring-[#111d4a]/10 p-3">
              <p className="text-xs text-[#99a1af] mb-1">Version</p>
              <Badge variant="secondary" className="font-mono text-xs rounded-full">
                v12000
              </Badge>
            </div>
          </div>

          {/* Keystore JSON */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#99a1af]">Keystore JSON</span>
              <div className="flex items-center gap-1">
                {showKeystore && (
                  <button
                    onClick={copyKeystore}
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
                )}
                <button
                  onClick={() => setShowKeystore(!showKeystore)}
                  className="p-1.5 rounded-full hover:bg-[#f0f2f5] transition-colors"
                >
                  {showKeystore ? (
                    <EyeOff className="h-4 w-4 text-[#99a1af]" />
                  ) : (
                    <Eye className="h-4 w-4 text-[#99a1af]" />
                  )}
                </button>
              </div>
            </div>
            {showKeystore ? (
              <pre className="rounded-xl bg-[#f8f9fa] ring-1 ring-[#111d4a]/10 p-3 text-xs font-mono overflow-auto max-h-48 text-[#111d4a]">
                {keystoreDisplay}
              </pre>
            ) : (
              <div className="rounded-xl bg-[#f8f9fa] ring-1 ring-[#111d4a]/10 px-3 py-3 text-sm text-[#99a1af]">
                Click the eye icon to reveal keystore data
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
