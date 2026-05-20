"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Info, Copy, Check, Shield } from "lucide-react";
import type { WalletData } from "@/lib/tcx";

interface Props {
  wallet: WalletData | null;
}

export function WalletInfo({ wallet }: Props) {
  const [showKeystore, setShowKeystore] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!wallet) {
    return (
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Wallet Info
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-muted px-3 py-3 text-sm text-muted-foreground">
            Create a wallet first to see details
          </div>
        </CardContent>
      </Card>
    );
  }

  const copyKeystore = () => {
    navigator.clipboard.writeText(JSON.stringify(wallet.keystore, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          Wallet Info
        </CardTitle>
        <CardDescription>Technical details of your wallet</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 animate-fade-in-up">
        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-md bg-muted p-3">
            <p className="text-xs text-muted-foreground mb-1">Chain</p>
            <Badge variant="secondary" className="font-mono">
              ETH
            </Badge>
          </div>
          <div className="rounded-md bg-muted p-3">
            <p className="text-xs text-muted-foreground mb-1">Derivation</p>
            <Badge variant="secondary" className="font-mono">
              m/44&apos;/60&apos;/0&apos;/0/0
            </Badge>
          </div>
          <div className="rounded-md bg-muted p-3">
            <p className="text-xs text-muted-foreground mb-1">Encryption</p>
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3 text-green-600" />
              <span className="text-xs font-medium">scrypt + AES-128-CTR</span>
            </div>
          </div>
          <div className="rounded-md bg-muted p-3">
            <p className="text-xs text-muted-foreground mb-1">Keystore Version</p>
            <Badge variant="secondary" className="font-mono">
              v3
            </Badge>
          </div>
        </div>

        {/* Keystore JSON */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-muted-foreground">
              Keystore JSON
            </Label>
            <div className="flex items-center gap-1">
              {showKeystore && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyKeystore}
                  className="h-7 px-2 text-xs"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      Copy
                    </>
                  )}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowKeystore(!showKeystore)}
                className="h-7 px-2"
              >
                {showKeystore ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          {showKeystore ? (
            <pre className="rounded-md bg-muted p-3 text-xs font-mono overflow-auto max-h-48">
              {JSON.stringify(wallet.keystore, null, 2)}
            </pre>
          ) : (
            <div className="rounded-md bg-muted px-3 py-3 text-sm text-muted-foreground">
              Click the eye icon to reveal keystore data
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={className}>{children}</span>;
}
