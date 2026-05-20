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
import {
  Wallet,
  Copy,
  Check,
  Eye,
  EyeOff,
  Loader2,
  TreePine,
} from "lucide-react";
import type { WalletData, ChainAddress } from "@/lib/tcx";

interface Props {
  onWalletCreated: (wallet: WalletData) => void;
  wallet: WalletData | null;
}

export function CreateWallet({ onWalletCreated, wallet }: Props) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [copiedMnemonic, setCopiedMnemonic] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
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

      // Derive multi-chain addresses
      const addresses = await deriveMultiChainAddresses(keystoreJson, password);
      setChainAddresses(addresses);

      onWalletCreated({ keystoreJson, address, mnemonic, password });
    } catch (e: any) {
      setError(e.message || "Failed to create wallet");
    } finally {
      setLoading(false);
    }
  };

  const copyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopiedAddress(addr);
    setTimeout(() => setCopiedAddress(null), 1500);
  };

  const copyMnemonic = () => {
    if (wallet) {
      navigator.clipboard.writeText(wallet.mnemonic);
      setCopiedMnemonic(true);
      setTimeout(() => setCopiedMnemonic(false), 1500);
    }
  };

  const copyAllAddresses = () => {
    const text = chainAddresses
      .map((a) => `${a.label}: ${a.address}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
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
          Create a new multi-chain wallet using Token Core
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
          <div className="space-y-5 animate-fade-in-up">
            <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-green-700 text-sm font-medium">
              ✅ Wallet created — addresses derived across{" "}
              {chainAddresses.length} chains
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

            {/* Multi-Chain Address Tree */}
            {chainAddresses.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <TreePine className="h-4 w-4 text-primary" />
                  <Label className="text-sm font-medium">
                    Multi-Chain Address Tree
                  </Label>
                </div>
                <div className="rounded-md border border-border bg-card overflow-hidden">
                  {chainAddresses.map((item, index) => {
                    const isLast = index === chainAddresses.length - 1;
                    return (
                      <div
                        key={item.label}
                        className="animate-fade-in-up border-b border-border last:border-b-0 px-4 py-3"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-muted-foreground font-mono text-xs select-none">
                            {isLast ? "└──" : "├──"}
                          </span>
                          <Badge
                            variant="secondary"
                            className="text-xs font-medium"
                          >
                            {item.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 ml-8">
                          <code className="flex-1 text-xs font-mono break-all text-foreground/80">
                            {item.address}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyAddress(item.address)}
                            className="h-7 px-2 shrink-0"
                          >
                            {copiedAddress === item.address ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Copy All */}
                <Button
                  variant="outline"
                  onClick={copyAllAddresses}
                  className="w-full"
                >
                  {copiedAll ? (
                    <>
                      <Check className="h-4 w-4 text-green-600" />
                      Copied All Addresses!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy All Addresses
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
