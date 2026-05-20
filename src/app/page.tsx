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
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#0CC5FF] to-[#007FFF] text-white">
        {/* 右侧主视觉 SVG */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[10%] w-[350px] h-[350px] md:w-[480px] md:h-[480px] opacity-25 pointer-events-none">
          <img
            src="/anniversary-visual.svg"
            alt=""
            className="w-full h-full object-contain animate-slow-spin"
          />
        </div>

        {/* 散落的装饰光点 */}
        <div className="absolute left-[8%] top-[18%] w-2 h-2 bg-white/30 rounded-full blur-[1px]" />
        <div className="absolute left-[22%] top-[55%] w-1.5 h-1.5 bg-white/20 rounded-full blur-[1px]" />
        <div className="absolute left-[12%] top-[38%] w-1 h-1 bg-white/40 rounded-full" />
        <div className="absolute right-[30%] top-[15%] w-1 h-1 bg-white/25 rounded-full" />
        <div className="absolute right-[20%] top-[70%] w-1.5 h-1.5 bg-white/15 rounded-full blur-[1px]" />

        {/* 品牌栏 */}
        <div className="relative mx-auto max-w-5xl px-6 pt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="animate-breathe">
              <img
                src="/favicon.svg"
                alt="imToken"
                className="h-10 w-10 rounded-xl animate-pulse-glow"
              />
            </div>
            <span className="text-xl font-bold tracking-tight">imToken</span>
            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm rounded-full">
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

        {/* Hero 内容 */}
        <div className="relative mx-auto max-w-5xl px-6 py-14 md:py-20">
          <p className="text-sm font-medium tracking-widest uppercase text-white/50 mb-3">
            Celebrating 10 Years of Digital Freedom
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            十周年快乐
          </h1>
          <h2 className="text-lg md:text-xl font-medium mt-2 text-white/85">
            Your Digital World, Under Your Control
          </h2>
          <p className="mt-4 text-sm md:text-base text-white/60 max-w-lg leading-relaxed">
            One mnemonic, five chains — create, sign, and manage your multi-chain
            wallets entirely in your browser via WebAssembly. No server, no
            extensions.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <div className="h-px w-10 bg-white/30" />
            <span className="text-xs text-white/40 tracking-wider font-medium">
              2016 — 2026
            </span>
            <div className="h-px w-10 bg-white/30" />
          </div>
        </div>
      </header>

      {/* Mobile Connect Button */}
      <div className="sm:hidden flex justify-center py-3 border-b border-[#e0e3e8] bg-white">
        <ConnectButton
          chainStatus="icon"
          showBalance={false}
          accountStatus="address"
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-2xl px-4 -mt-6 relative z-10 pb-12">
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 shadow-sm rounded-full">
            <TabsTrigger value="create" className="gap-1.5 rounded-full">
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">Create</span>
            </TabsTrigger>
            <TabsTrigger value="sign" className="gap-1.5 rounded-full">
              <PenLine className="h-4 w-4" />
              <span className="hidden sm:inline">Sign</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-1.5 rounded-full">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="connect" className="gap-1.5 rounded-full">
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
      <footer className="py-8 text-center text-sm text-[#99a1af] border-t border-[#e0e3e8] bg-white">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img
            src="/favicon.svg"
            alt="imToken"
            className="h-5 w-5 opacity-60 rounded"
          />
          <span className="font-medium text-[#111d4a]">
            imToken 10th Anniversary
          </span>
        </div>
        <p className="text-xs text-[#99a1af]/80">
          Powered by Token Core (tcx-wasm) · Your Digital World, Under Your
          Control
        </p>
      </footer>
    </div>
  );
}
