"use client";

import { useAccount, useDisconnect, useChainId } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Link2, Unlink } from "lucide-react";
import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function WalletProfile() {
  const { address, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const [copied, setCopied] = useState(false);

  const chainName =
    chainId === baseSepolia.id ? "Base Sepolia" : `Chain ${chainId}`;

  const truncateAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  if (!isConnected) {
    return (
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-primary" />
            Connect External Wallet
          </CardTitle>
          <CardDescription>
            Connect MetaMask, WalletConnect, or other wallets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-muted px-3 py-3 text-sm text-muted-foreground">
            Connect an external wallet to interact with Base Sepolia testnet.
            This demonstrates Token Core alongside Web3 wallet integration.
          </div>
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-primary" />
          Connected Wallet
        </CardTitle>
        <CardDescription>External wallet via {connector?.name}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 animate-fade-in-up">
        {/* Connection Status */}
        <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-green-700 text-sm font-medium">
          ✅ Wallet connected
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-md bg-muted p-3">
            <p className="text-xs text-muted-foreground mb-1">Network</p>
            <Badge variant="secondary" className="font-mono">
              {chainName}
            </Badge>
          </div>
          <div className="rounded-md bg-muted p-3">
            <p className="text-xs text-muted-foreground mb-1">Connector</p>
            <Badge variant="secondary">{connector?.name || "Unknown"}</Badge>
          </div>
        </div>

        {/* Address */}
        <div className="space-y-1.5">
          <span className="text-sm text-muted-foreground">Address</span>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded-md bg-muted px-3 py-2 text-sm font-mono">
              {truncateAddress(address!)}
            </code>
            <Button
              variant="outline"
              size="icon"
              onClick={copyAddress}
              className="shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Disconnect */}
        <Button
          variant="outline"
          onClick={() => disconnect()}
          className="w-full"
        >
          <Unlink className="h-4 w-4" />
          Disconnect
        </Button>
      </CardContent>
    </Card>
  );
}
