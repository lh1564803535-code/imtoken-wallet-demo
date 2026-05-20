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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Wallet, Copy, Check, Eye, EyeOff, Loader2 } from "lucide-react";
import type { WalletData } from "@/lib/tcx";

interface Props {
  onWalletCreated: (wallet: WalletData) => void;
  wallet: WalletData | null;
}

export function CreateWallet({ onWalletCreated, wallet }: Props) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedMnemonic, setCopiedMnemonic] = useState(false);

  const handleCreate = async () => {
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { createWallet, deriveAddress } = await import("@/lib/tcx");
      const { keystore, mnemonic } = await createWallet(password);
      const address = await deriveAddress(keystore);
      onWalletCreated({ keystore, address, mnemonic, password });
    } catch (e: any) {
      setError(e.message || "Failed to create wallet");
    } finally {
      setLoading(false);
    }
  };

  const copyAddress = () => {
    if (wallet) {
      navigator.clipboard.writeText(wallet.address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 1500);
    }
  };

  const copyMnemonic = () => {
    if (wallet) {
      navigator.clipboard.writeText(wallet.mnemonic);
      setCopiedMnemonic(true);
      setTimeout(() => setCopiedMnemonic(false), 1500);
    }
  };

  const mnemonicWords = wallet?.mnemonic.split(" ") || [];

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          Create Wallet
        </CardTitle>
        <CardDescription>
          Create a new ETH wallet using Token Core
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!wallet ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button
              onClick={handleCreate}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating wallet...
                </>
              ) : (
                "Create Wallet"
              )}
            </Button>
          </>
        ) : (
          <div className="space-y-4 animate-fade-in-up">
            <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-green-700 text-sm font-medium">
              ✅ Wallet created successfully!
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <Label>Address</Label>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-md bg-muted px-3 py-2 text-sm font-mono break-all">
                  {wallet.address}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyAddress}
                  className="shrink-0"
                >
                  {copiedAddress ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Mnemonic */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label>Mnemonic Phrase</Label>
                <div className="flex items-center gap-1">
                  {showMnemonic && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyMnemonic}
                      className="h-7 px-2 text-xs"
                    >
                      {copiedMnemonic ? (
                        <>
                          <Check className="h-3 w-3 text-green-600" />
                          Copied
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
                    onClick={() => setShowMnemonic(!showMnemonic)}
                    className="h-7 px-2"
                  >
                    {showMnemonic ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              {showMnemonic ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-3 rounded-md bg-muted">
                  {mnemonicWords.map((word, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="justify-start font-mono text-xs py-1.5 px-2"
                    >
                      <span className="text-muted-foreground mr-1">
                        {i + 1}.
                      </span>
                      {word}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="rounded-md bg-muted px-3 py-3 text-sm text-muted-foreground">
                  Click the eye icon to reveal your mnemonic phrase
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
