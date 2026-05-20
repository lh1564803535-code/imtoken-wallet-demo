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
import { Eye, EyeOff, Info, Copy } from "lucide-react";
import type { WalletData } from "@/lib/tcx";

interface Props {
  wallet: WalletData | null;
}

export function WalletInfo({ wallet }: Props) {
  const [showKeystore, setShowKeystore] = useState(false);

  if (!wallet) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Wallet Info
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Create a wallet to see info
          </p>
        </CardContent>
      </Card>
    );
  }

  const copyKeystore = () => {
    navigator.clipboard.writeText(JSON.stringify(wallet.keystore, null, 2));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Wallet Info
        </CardTitle>
        <CardDescription>Details of your wallet</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Chain</span>
          <Badge variant="secondary">ETH</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Index</span>
          <Badge variant="secondary">0</Badge>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Keystore</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowKeystore(!showKeystore)}
            >
              {showKeystore ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {showKeystore ? (
            <div className="flex items-start gap-2">
              <pre className="flex-1 rounded bg-muted p-2 text-xs font-mono overflow-auto max-h-40">
                {JSON.stringify(wallet.keystore, null, 2)}
              </pre>
              <Button variant="outline" size="icon" onClick={copyKeystore}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <code className="block rounded bg-muted px-2 py-2 text-sm">
              ••••••••••••••••
            </code>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
