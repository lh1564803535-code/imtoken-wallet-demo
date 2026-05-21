"use client";

import { useState } from "react";
import { CreateWallet } from "@/components/create-wallet";
import { ImportWallet } from "@/components/import-wallet";
import { SignMessage } from "@/components/sign-message";
import { WalletSecurity } from "@/components/wallet-security";
import { AIIntent } from "@/components/ai-intent";
import { ShopTab } from "@/components/bitrefill/ShopTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Wallet, PenLine, Shield, Download, Lock, ShoppingBag } from "lucide-react";
import type { WalletData, ChainAddress } from "@/lib/tcx";

export default function Home() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [activeTab, setActiveTab] = useState("create");
  const [chainAddresses, setChainAddresses] = useState<ChainAddress[]>([]);

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
  };

  const handleWalletCreated = (w: WalletData) => {
    setWallet(w);
    // Derive addresses for balance dashboard
    import("@/lib/tcx").then(({ deriveMultiChainAddresses }) => {
      deriveMultiChainAddresses(w.keystoreJson, w.password).then(setChainAddresses).catch(() => {});
    });
  };

  const handleWalletImported = (w: WalletData) => {
    setWallet(w);
    import("@/lib/tcx").then(({ deriveMultiChainAddresses }) => {
      deriveMultiChainAddresses(w.keystoreJson, w.password).then(setChainAddresses).catch(() => {});
    });
  };

  const handleAIAction = (action: string) => {
    switch (action) {
      case "show-eth":
      case "show-btc":
      case "show-tron":
      case "show-all":
        if (wallet) setActiveTab("create");
        break;
      case "copy-all":
        if (wallet) setActiveTab("create");
        break;
      case "prove":
        if (wallet) setActiveTab("create");
        break;
      case "purchase":
      case "show-shop":
        setActiveTab("shop");
        break;
      case "show-vault":
        setActiveTab("shop");
        break;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f0f7ff] to-white">
      {/* 纸屑飘落效果 */}
      <div className="confetti-container">
        <div className="confetti" style={{ left: '4%', background: '#007fff', animationDuration: '8.5s' }} />
        <div className="confetti" style={{ left: '10%', background: '#f5c84c', animationDuration: '10.5s', animationDelay: '-1.2s' }} />
        <div className="confetti" style={{ left: '16%', background: '#ff6b6b', animationDuration: '9s', animationDelay: '-2.1s' }} />
        <div className="confetti" style={{ left: '22%', background: '#0cc5ff', animationDuration: '11s', animationDelay: '-4.8s' }} />
        <div className="confetti" style={{ left: '28%', background: '#007fff', animationDuration: '9.4s', animationDelay: '-5.2s' }} />
        <div className="confetti" style={{ left: '34%', background: '#f5c84c', animationDuration: '12s', animationDelay: '-2.7s' }} />
        <div className="confetti" style={{ left: '40%', background: '#ff6b6b', animationDuration: '10.2s', animationDelay: '-4.1s' }} />
        <div className="confetti" style={{ left: '46%', background: '#007fff', animationDuration: '8.9s', animationDelay: '-1.4s' }} />
        <div className="confetti" style={{ left: '52%', background: '#f5c84c', animationDuration: '11.4s', animationDelay: '-6.2s' }} />
        <div className="confetti" style={{ left: '58%', background: '#0cc5ff', animationDuration: '10.1s', animationDelay: '-3.3s' }} />
        <div className="confetti" style={{ left: '64%', background: '#ff6b6b', animationDuration: '9.7s', animationDelay: '-7.1s' }} />
        <div className="confetti" style={{ left: '70%', background: '#007fff', animationDuration: '12.5s', animationDelay: '-5.4s' }} />
        <div className="confetti" style={{ left: '76%', background: '#f5c84c', animationDuration: '8.6s', animationDelay: '-2.2s' }} />
        <div className="confetti" style={{ left: '82%', background: '#ff6b6b', animationDuration: '11.2s', animationDelay: '-6.6s' }} />
        <div className="confetti" style={{ left: '88%', background: '#0cc5ff', animationDuration: '9.2s', animationDelay: '-1.8s' }} />
        <div className="confetti" style={{ left: '94%', background: '#007fff', animationDuration: '10.8s', animationDelay: '-4.4s' }} />
      </div>

      {/* 气球飘浮效果 */}
      <div className="balloon" style={{ left: '5%', background: 'linear-gradient(180deg, #70e9ff, #0aa0f0)', animationDelay: '0s' }} />
      <div className="balloon" style={{ left: '15%', width: '50px', height: '68px', background: 'linear-gradient(180deg, #ffd96c, #f3a83d)', animationDelay: '2.4s' }} />
      <div className="balloon" style={{ right: '8%', background: 'linear-gradient(180deg, #ff8f8f, #ef5b5b)', animationDelay: '1.4s' }} />
      <div className="balloon" style={{ right: '18%', width: '54px', height: '72px', background: 'linear-gradient(180deg, #8ce4ff, #4bb8ff)', animationDelay: '3.2s' }} />

      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#0CC5FF] to-[#007FFF] text-white rounded-b-[32px]">
        {/* 右侧主视觉 SVG */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[10%] w-[250px] h-[250px] md:w-[320px] md:h-[320px] opacity-25 pointer-events-none">
          <img
            src="/anniversary-visual.svg"
            alt=""
            className="w-full h-full object-contain animate-slow-spin"
          />
        </div>

        {/* 闪光点 */}
        <div className="sparkle-dot" style={{ left: '45%', top: '20%', animationDelay: '0s' }} />
        <div className="sparkle-dot" style={{ left: '55%', top: '15%', animationDelay: '0.6s' }} />
        <div className="sparkle-dot" style={{ right: '15%', top: '60%', animationDelay: '1.2s' }} />

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
        </div>

        {/* Hero 内容 */}
        <div className="relative mx-auto max-w-5xl px-6 py-8 md:py-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/20 text-sm font-medium tracking-wide mb-3">
            🔐 AI-Native Zero-Trust Wallet
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight drop-shadow-lg">
            Your Digital World,<br />Under Your Control
          </h1>
          <p className="mt-2 text-base md:text-lg text-white/90 font-medium tracking-tight">
            1 Seed · 5 Chains · 0 Servers · Pure Cryptography
          </p>

          {/* 核心价值主张 */}
          <div className="mt-4 inline-flex flex-col gap-0.5 px-5 py-3 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-sm">
            <span className="text-sm font-bold tracking-tight">Happy Birthday, imToken! 🎂</span>
            <span className="text-xs text-white/85">十年守护用户主权，下一个十年更精彩</span>
          </div>
        </div>

        {/* 生日蛋糕 */}
        <div className="animate-cake-rise absolute left-6 bottom-0 w-[180px] z-10">
          <div className="absolute left-[-10px] right-[-10px] bottom-[-12px] h-[20px] rounded-full bg-gradient-to-b from-white/95 to-[#dcf2ff]/95 shadow-lg" />
          <div className="relative h-[80px] rounded-t-2xl rounded-b-[20px] bg-gradient-to-b from-[#7de7ff] via-[#1fb8ff] to-[#007fff] border border-white/30 overflow-hidden">
            <div className="absolute inset-0 opacity-30" style={{ background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.18) 0 10px, transparent 10px 24px)' }} />
            <div className="absolute left-1/2 top-2 -translate-x-1/2 w-11 h-11 rounded-xl bg-gradient-to-b from-white/95 to-[#f0fbff]/90 shadow-lg flex items-center justify-center">
              <img src="/favicon.svg" alt="" className="w-8 h-8" />
            </div>
            <div className="cake-flame" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-3 rounded-full bg-gradient-to-b from-[#d7edf7] to-[#93bdd1]" />
          </div>
          <div className="absolute left-3 right-3 top-[-7px] h-[18px] rounded-full bg-gradient-to-b from-white/98 to-[#e9faff]/88 shadow-md" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 -mt-4 relative z-10 pb-12">
        {/* Zero Trust Architecture Banner */}
        <div className="mb-4 rounded-xl bg-[#f0f7ff] ring-1 ring-[#007fff]/10 px-4 py-3 flex items-start gap-3">
          <Lock className="h-4 w-4 text-[#007fff] mt-0.5 flex-shrink-0" />
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#111d4a]">
            <span>✅ Keys generated locally via WASM</span>
            <span>✅ PBKDF2 × 600k rounds</span>
            <span>✅ No server involved</span>
            <span>✅ Open source & auditable</span>
          </div>
        </div>

        {/* AI Intent Assistant */}
        <AIIntent wallet={wallet} onNavigate={handleNavigate} onAction={handleAIAction} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6 rounded-full p-1 h-auto">
            <TabsTrigger value="create" className="gap-1.5 rounded-full py-2.5">
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">Create</span>
            </TabsTrigger>
            <TabsTrigger value="import" className="gap-1.5 rounded-full py-2.5">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Import</span>
            </TabsTrigger>
            <TabsTrigger value="sign" className="gap-1.5 rounded-full py-2.5">
              <PenLine className="h-4 w-4" />
              <span className="hidden sm:inline">Sign</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-1.5 rounded-full py-2.5">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="shop" className="gap-1.5 rounded-full py-2.5 relative">
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Shop</span>
              <span className="absolute -top-1 -right-1 px-1 py-0.5 bg-red-500 text-white text-[8px] font-bold rounded-full leading-none">NEW</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <CreateWallet onWalletCreated={handleWalletCreated} wallet={wallet} />
          </TabsContent>

          <TabsContent value="import">
            <ImportWallet onWalletImported={handleWalletImported} wallet={wallet} />
          </TabsContent>

          <TabsContent value="sign">
            <SignMessage wallet={wallet} />
          </TabsContent>

          <TabsContent value="security">
            <WalletSecurity wallet={wallet} />
          </TabsContent>

          <TabsContent value="shop">
            <ShopTab wallet={wallet} addresses={chainAddresses} onNavigate={handleNavigate} />
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
          Powered by Token Core (tcx-wasm) · AI-Native Zero-Trust Wallet · Your Digital World, Under Your Control
        </p>
      </footer>
    </div>
  );
}
