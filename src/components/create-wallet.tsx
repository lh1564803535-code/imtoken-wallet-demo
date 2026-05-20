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
import { Wallet, Copy, Eye, EyeOff } from "lucide-react";
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
    if (wallet) navigator.clipboard.writeText(wallet.address);
  };

  const copyMnemonic = () => {
    if (wallet) navigator.clipboard.writeText(wallet.mnemonic);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
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
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button onClick={handleCreate} disabled={loading} className="w-full">
              {loading ? "Creating..." : "Create Wallet"}
            </Button>
          </>
        ) : (
          <div className="space-y-3">
            <div className="rounded-lg bg-green-50 p-3 text-green-700 text-sm">
              ✅ Wallet created successfully!
            </div>
            <div className="space-y-1">
              <Label>Address</Label>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded bg-muted px-2 py-1 text-sm font-mono break-all">
                  {wallet.address}
                </code>
                <Button variant="outline" size="icon" onClick={copyAddress}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label>Mnemonic</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMnemonic(!showMnemonic)}
                >
                  {showMnemonic ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {showMnemonic ? (
                <div className="flex items-center gap-2">
                  <code className="flex-1 rounded bg-muted px-2 py-2 text-sm font-mono break-all">
                    {wallet.mnemonic}
                  </code>
                  <Button variant="outline" size="icon" onClick={copyMnemonic}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <code className="block rounded bg-muted px-2 py-2 text-sm">
                  ••••••••••••••••••••••••••••••••
                </code>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
