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
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[5%] w-[350px] h-[350px] md:w-[480px] md:h-[480px] opacity-30 pointer-events-none">
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
          <div className="hidden sm:block">
            <ConnectButton
              chainStatus="icon"
              showBalance={false}
              accountStatus="address"
            />
          </div>
        </div>

        {/* Hero 内容 */}
        <div className="relative mx-auto max-w-5xl px-6 py-14 md:py-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/20 text-sm font-medium tracking-wide mb-4">
            🎂 Birthday celebration edition
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-none drop-shadow-lg">
            十周年快乐
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90 max-w-lg leading-relaxed">
            Your Digital World, Under Your Control
          </p>

          {/* 祝福语卡片 */}
          <div className="mt-6 inline-flex flex-col gap-1 px-6 py-4 rounded-3xl bg-white/15 border border-white/20 backdrop-blur-sm">
            <span className="text-xl font-extrabold tracking-tight">Happy Birthday, imToken! 🎉</span>
            <span className="text-sm text-white/85">愿你的下一个十年更精彩</span>
          </div>

          <p className="mt-5 text-sm text-white/60 max-w-lg leading-relaxed">
            Building a smoother crypto experience with trust, clarity, and a little birthday magic.
          </p>
        </div>

        {/* 生日蛋糕 */}
        <div className="animate-cake-rise absolute left-8 bottom-0 w-[280px] z-10">
          {/* 蛋糕盘 */}
          <div className="absolute left-[-14px] right-[-14px] bottom-[-18px] h-[28px] rounded-full bg-gradient-to-b from-white/95 to-[#dcf2ff]/95 shadow-lg" />
          {/* 蛋糕主体 */}
          <div className="relative h-[120px] rounded-t-3xl rounded-b-[28px] bg-gradient-to-b from-[#7de7ff] via-[#1fb8ff] to-[#007fff] border border-white/30 overflow-hidden">
            {/* 条纹装饰 */}
            <div className="absolute inset-0 opacity-30" style={{ background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.18) 0 10px, transparent 10px 24px)' }} />
            {/* 龙图标 */}
            <div className="absolute left-1/2 top-3 -translate-x-1/2 w-16 h-16 rounded-2xl bg-gradient-to-b from-white/95 to-[#f0fbff]/90 shadow-lg flex items-center justify-center">
              <img src="/favicon.svg" alt="" className="w-12 h-12" />
            </div>
            {/* 火焰 */}
            <div className="cake-flame" />
            {/* 蜡烛棒 */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-5 rounded-full bg-gradient-to-b from-[#d7edf7] to-[#93bdd1]" />
          </div>
          {/* 奶油层 */}
          <div className="absolute left-4 right-4 top-[-10px] h-[28px] rounded-full bg-gradient-to-b from-white/98 to-[#e9faff]/88 shadow-md" />
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
      <main className="flex-1 mx-auto w-full max-w-2xl px-4 -mt-4 relative z-10 pb-12">
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
