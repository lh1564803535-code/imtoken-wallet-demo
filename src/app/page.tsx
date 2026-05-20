"use client";

import { useState } from "react";
import { CreateWallet } from "@/components/create-wallet";
import { SignMessage } from "@/components/sign-message";
import { WalletSecurity } from "@/components/wallet-security";
import { WalletProfile } from "@/components/wallet-profile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Wallet, PenLine, Shield, Link2 } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { WalletData } from "@/lib/tcx";

export default function Home() {
  const [wallet, setWallet] = useState<WalletData | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with Brand Header */}
      <header className="bg-gradient-to-br from-[#468BFF] to-[#2563EB] text-white">
        {/* Brand Bar */}
        <div className="mx-auto max-w-5xl px-6 pt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-tight">imToken</span>
            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              10th Anniversary
            </Badge>
          </div>
          <div className="hidden sm:block">
            <ConnectButton
              chainStatus="icon"
              showBalance={false}
              accountStatus="address"
            />
          </div>
        </div>
        {/* Hero Content */}
        <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Build with Token Core
          </h1>
          <p className="mt-3 text-base md:text-lg text-white/80 max-w-2xl">
            One mnemonic, multiple chains — derive ETH, BTC, and TRON addresses
            entirely in your browser via WebAssembly. No server, no extensions.
          </p>
        </div>
      </header>

      {/* Mobile Connect Button */}
      <div className="sm:hidden flex justify-center py-3 border-b border-border bg-white">
        <ConnectButton
          chainStatus="icon"
          showBalance={false}
          accountStatus="address"
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-2xl px-4 -mt-6 relative z-10 pb-12">
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 shadow-sm">
            <TabsTrigger value="create" className="gap-1.5">
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">Create</span>
            </TabsTrigger>
            <TabsTrigger value="sign" className="gap-1.5">
              <PenLine className="h-4 w-4" />
              <span className="hidden sm:inline">Sign</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-1.5">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="connect" className="gap-1.5">
              <Link2 className="h-4 w-4" />
              <span className="hidden sm:inline">Connect</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <CreateWallet onWalletCreated={setWallet} wallet={wallet} />
          </TabsContent>

          <TabsContent value="sign">
            <SignMessage wallet={wallet} />
          </TabsContent>

          <TabsContent value="security">
            <WalletSecurity wallet={wallet} />
          </TabsContent>

          <TabsContent value="connect">
            <WalletProfile />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border">
        Powered by Token Core (tcx-wasm) | imToken 10th Anniversary
      </footer>
    </div>
  );
}
