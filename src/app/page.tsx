"use client";

import { useState } from "react";
import { CreateWallet } from "@/components/create-wallet";
import { ImportWallet } from "@/components/import-wallet";
import { SignMessage } from "@/components/sign-message";
import { WalletSecurity } from "@/components/wallet-security";
import { AIIntent } from "@/components/ai-intent";
import { ShopTab } from "@/components/bitrefill/ShopTab";
import { Wallet, Shield, Gift, Clock, Users, Plus, Home, Compass, User, Send, QrCode, ArrowLeftRight, Sparkles, ChevronRight, Eye, EyeOff, ArrowLeft, Activity, TrendingUp, Globe, CreditCard, X, Trophy, Palette } from "lucide-react";
import { Loader2 } from "lucide-react";
import { CommandPalette, useCommandPalette } from "@/components/command-palette";
import { Onboarding, useOnboarding } from "@/components/onboarding";
import { BackupReminder, useBackupReminder } from "@/components/backup-reminder";
import { AIAgentBanner } from "@/components/ai-agent";
import { AchievementsPage } from "@/components/achievements";
import { ThemeProvider, ThemePickerPage } from "@/components/themes";
import { MiniChart } from "@/components/sparkline";
import { getTokenPrices, getTokenBalance, getTotalBalance, formatPrice, formatChange } from "@/lib/prices";
import type { WalletData, ChainAddress } from "@/lib/tcx";
import type { PurchaseIntent } from "@/types/bitrefill";
import {
  WelcomePage, SendPage, ReceivePage, SwapPage, ActivityPage,
  HeritagePage, TokenDetailPage, NFTGalleryPage, TxDetailPage,
  SettingsPage, WatchWalletPage, DAppBrowserPage, NetworkSwitchPage,
  MnemonicDisplayPage, MnemonicVerifyPage, BuyPage, HelpPage,
} from "@/components/pages";
import type { TokenItem } from "@/components/pages";

/* ───────── Token Data ───────── */

function useTokenData(): TokenItem[] {
  const prices = getTokenPrices();
  return prices.map((t) => {
    const bal = getTokenBalance(t.symbol);
    return {
      symbol: t.symbol, name: t.name, balance: bal.balance,
      value: bal.usdValue, change: formatChange(t.change24h),
      up: t.change24h >= 0, color: t.color, abbr: t.abbr,
      price: formatPrice(t.price),
    };
  });
}

/* ───────── Main App ───────── */

function MainApp({ wallet, chainAddresses, purchaseIntent, walletName: name }: {
  wallet: WalletData | null; chainAddresses: ChainAddress[];
  purchaseIntent: PurchaseIntent | null; walletName?: string;
}) {
  const [activeTab, setActiveTab] = useState("home");
  const [subPage, setSubPage] = useState<string | null>(null);
  const [showBalance, setShowBalance] = useState(true);
  const [selectedToken, setSelectedToken] = useState(0);
  const [tokenSearch, setTokenSearch] = useState("");
  const { open: cmdOpen, setOpen: setCmdOpen, commands: cmdCommands } = useCommandPalette((page) => setSubPage(page));
  const { showOnboarding, completeOnboarding } = useOnboarding();
  const { showReminder, dismiss: dismissReminder, markBackedUp } = useBackupReminder();
  const TOKENS = useTokenData();

  const shortAddr = wallet?.address ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` : "0x1234...5678";
  const displayName = name || "My Wallet";
  const ethAddress = chainAddresses.find(a => a.chain === "ETHEREUM")?.address || wallet?.address || "";

  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "discover", label: "Discover", icon: Compass },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "profile", label: "Profile", icon: User },
  ];

  // ─── Sub pages ───
  if (subPage === "heritage") return <HeritagePage onBack={() => setSubPage(null)} ownerAddress={ethAddress} />;
  if (subPage === "create") return <CreateWallet onWalletCreated={() => setSubPage(null)} wallet={wallet} />;
  if (subPage === "import") return <ImportWallet onWalletImported={() => setSubPage(null)} wallet={wallet} />;
  if (subPage === "sign") return <SignMessage wallet={wallet} />;
  if (subPage === "security") return <WalletSecurity wallet={wallet} />;
  if (subPage === "shop") return <ShopTab wallet={wallet} addresses={chainAddresses} onNavigate={setSubPage} purchaseIntent={purchaseIntent} />;
  if (subPage === "ai") return <AIIntent wallet={wallet} onNavigate={setSubPage} onAction={() => {}} />;
  if (subPage === "send") return <SendPage onBack={() => setSubPage(null)} wallet={wallet} />;
  if (subPage === "receive") return <ReceivePage onBack={() => setSubPage(null)} address={ethAddress} />;
  if (subPage === "swap") return <SwapPage onBack={() => setSubPage(null)} />;
  if (subPage === "activity") return <ActivityPage onBack={() => setSubPage(null)} />;
  if (subPage === "token") return <TokenDetailPage onBack={() => setSubPage(null)} token={TOKENS[selectedToken]} />;
  if (subPage === "nfts") return <NFTGalleryPage onBack={() => setSubPage(null)} />;
  if (subPage === "network") return <NetworkSwitchPage onBack={() => setSubPage(null)} />;
  if (subPage === "txDetail") return <TxDetailPage onBack={() => setSubPage(null)} />;
  if (subPage === "settings") return <SettingsPage onBack={() => setSubPage(null)} />;
  if (subPage === "dapps") return <DAppBrowserPage onBack={() => setSubPage(null)} />;
  if (subPage === "watch") return <WatchWalletPage onBack={() => setSubPage(null)} />;
  if (subPage === "buy") return <BuyPage onBack={() => setSubPage(null)} />;
  if (subPage === "help") return <HelpPage onBack={() => setSubPage(null)} />;
  if (subPage === "achievements") return <AchievementsPage onBack={() => setSubPage(null)} />;
  if (subPage === "themes") return <ThemePickerPage onBack={() => setSubPage(null)} />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 pb-24">
        {/* ─── HOME TAB ─── */}
        {activeTab === "home" && (
          <div className="bg-white min-h-screen">
            {/* ── Rainbow Header ── */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 rainbow-gradient" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/15" />
              {/* Decorative orbs */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-2xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3 blur-2xl" />

              <div className="relative z-10 px-6 pt-16 pb-12 text-white">
                {/* Top bar */}
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-lg shadow-black/10 border border-white/10">
                        <span className="text-white text-lg font-extrabold">{shortAddr[2].toUpperCase()}</span>
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white/20" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold tracking-wide">{displayName}</p>
                      <p className="text-[11px] opacity-50 font-mono">{shortAddr}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowBalance(!showBalance)} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10 active:bg-white/20 transition-all">
                    {showBalance ? <Eye className="w-4.5 h-4.5" /> : <EyeOff className="w-4.5 h-4.5" />}
                  </button>
                </div>

                {/* Balance */}
                <div className="text-center mb-10">
                  <p className="text-xs font-medium opacity-50 uppercase tracking-widest mb-3">Total Balance</p>
                  <p className="text-[56px] font-extrabold tracking-tighter leading-none mb-3" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.15)" }}>
                    {showBalance ? getTotalBalance() : "****"}
                  </p>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full backdrop-blur-md border border-white/10">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold">+2.34%</span>
                    <span className="text-xs opacity-50">today</span>
                  </div>
                </div>

                {/* Network & Gas */}
                <div className="flex items-center justify-center gap-2 mb-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full backdrop-blur-md border border-white/10">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[11px] font-medium">Ethereum</span>
                  </div>
                  <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/8 rounded-full backdrop-blur-md border border-white/5">
                    <span className="text-[11px]">⛽</span>
                    <span className="text-[11px] font-medium opacity-70">12 gwei</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4">
                  {[
                    { icon: Send, label: "Send", action: "send" },
                    { icon: QrCode, label: "Receive", action: "receive" },
                    { icon: ArrowLeftRight, label: "Swap", action: "swap" },
                    { icon: Sparkles, label: "Buy", action: "buy" },
                  ].map((btn) => (
                    <button key={btn.label} onClick={() => btn.action && setSubPage(btn.action)} className="flex flex-col items-center gap-2 group">
                      <div className="w-[60px] h-[60px] bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-lg shadow-black/5 group-active:bg-white/25 group-active:scale-95 transition-all duration-200">
                        <btn.icon className="w-5 h-5" strokeWidth={2} />
                      </div>
                      <span className="text-[11px] font-medium opacity-80">{btn.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* Backup Reminder */}
            {showReminder && <BackupReminder onBackup={() => { markBackedUp(); setSubPage("create"); }} onDismiss={dismissReminder} />}
            {/* AI Agent */}
            <AIAgentBanner />
            {/* Token List */}
            <div className="px-5 pt-2 pb-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[15px] font-bold text-gray-900 tracking-tight">Tokens</h2>
                <span className="text-[11px] text-gray-400 font-medium">{TOKENS.length} assets</span>
              </div>
              {/* Search bar */}
              <div className="relative mb-5">
                <input type="text" placeholder="Search tokens..." value={tokenSearch} onChange={(e) => setTokenSearch(e.target.value)}
                  className="w-full bg-gray-50 rounded-2xl px-4 py-3 pl-11 border border-gray-100/80 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-400/30 focus:bg-white transition-all duration-200 placeholder:text-gray-400" />
                <svg className="w-[18px] h-[18px] text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" strokeLinecap="round" /></svg>
                {tokenSearch && (
                  <button onClick={() => setTokenSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-200 active:bg-gray-300 transition-colors">
                    <X className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                )}
              </div>
              {/* Token items */}
              <div className="space-y-0.5">
                {TOKENS.filter(t => !tokenSearch || t.name.toLowerCase().includes(tokenSearch.toLowerCase()) || t.symbol.toLowerCase().includes(tokenSearch.toLowerCase())).map((token, index) => (
                  <div key={token.symbol} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50/80 active:bg-gray-100/80 transition-all duration-200 cursor-pointer group animate-token-in" style={{ animationDelay: `${index * 0.05}s` }} onClick={() => { setSelectedToken(index); setSubPage("token"); }}>
                    <div className="relative shrink-0">
                      <div className={`w-12 h-12 ${token.color} rounded-2xl flex items-center justify-center text-white font-bold text-[13px] shadow-md shadow-${token.color.replace('bg-', '')}/20`}>{token.abbr}</div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm">
                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-[14px] text-gray-900 leading-tight">{token.name}</p>
                          <p className="text-[12px] text-gray-400 mt-0.5">{token.balance} {token.symbol}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <MiniChart positive={token.up} />
                          <div className="text-right">
                            <p className="font-semibold text-[14px] text-gray-900">{token.value}</p>
                            <p className={`text-[12px] font-semibold mt-0.5 ${token.up ? 'text-emerald-500' : 'text-red-500'}`}>{token.change}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {tokenSearch && TOKENS.filter(t => t.name.toLowerCase().includes(tokenSearch.toLowerCase()) || t.symbol.toLowerCase().includes(tokenSearch.toLowerCase())).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-sm">No tokens found for &quot;{tokenSearch}&quot;</p>
                  </div>
                )}
              </div>
            </div>
            {/* Quick Actions */}
            <div className="px-5 pb-8">
              <h2 className="text-[15px] font-bold text-gray-900 mb-4 tracking-tight">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Gift, label: "Heritage Wallet", desc: "Smart contract custody", page: "heritage", gradient: "from-purple-500/10 to-indigo-500/10", iconBg: "bg-purple-100", iconColor: "text-purple-600" },
                  { icon: Clock, label: "Gift Card Shop", desc: "29 popular gift cards", page: "shop", gradient: "from-orange-500/10 to-amber-500/10", iconBg: "bg-orange-100", iconColor: "text-orange-600" },
                  { icon: Users, label: "NFT Gallery", desc: "View your collections", page: "nfts", gradient: "from-pink-500/10 to-rose-500/10", iconBg: "bg-pink-100", iconColor: "text-pink-600" },
                  { icon: Globe, label: "Networks", desc: "Switch blockchain", page: "network", gradient: "from-blue-500/10 to-cyan-500/10", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
                ].map((item) => (
                  <div key={item.page} className={`bg-gradient-to-br ${item.gradient} rounded-2xl p-5 cursor-pointer border border-white/50 shadow-sm hover:shadow-md active:scale-[0.97] transition-all duration-200`} onClick={() => setSubPage(item.page)}>
                    <div className={`w-10 h-10 ${item.iconBg} rounded-xl flex items-center justify-center mb-3`}>
                      <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                    </div>
                    <p className="font-semibold text-[13px] text-gray-900">{item.label}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── DISCOVER TAB ─── */}
        {activeTab === "discover" && (
          <div className="bg-white min-h-screen">
            <div className="px-5 pt-14 pb-4">
              <h1 className="text-2xl font-bold mb-4">Discover</h1>
              <div className="bg-gray-50 rounded-2xl px-4 py-3.5 flex items-center gap-3 border border-gray-100 mb-5">
                <Compass className="w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Search tokens, DApps, or addresses" className="bg-transparent flex-1 text-sm focus:outline-none placeholder:text-gray-400" />
              </div>
              <div className="mb-6">
                <h2 className="text-sm font-bold text-gray-900 mb-3">Trending</h2>
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
                  {[
                    { symbol: "ETH", name: "Ethereum", change: "+5.2%", up: true, color: "bg-blue-500" },
                    { symbol: "SOL", name: "Solana", change: "+12.8%", up: true, color: "bg-violet-500" },
                    { symbol: "ARB", name: "Arbitrum", change: "+3.1%", up: true, color: "bg-blue-400" },
                    { symbol: "MATIC", name: "Polygon", change: "-2.3%", up: false, color: "bg-purple-500" },
                  ].map((t) => (
                    <div key={t.symbol} className="flex-shrink-0 w-36 bg-gray-50 rounded-2xl p-3.5 border border-gray-100 cursor-pointer active:scale-[0.97] transition-transform">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-8 h-8 ${t.color} rounded-full flex items-center justify-center text-white text-[10px] font-bold`}>{t.symbol.slice(0, 2)}</div>
                        <div>
                          <p className="font-semibold text-gray-900 text-xs">{t.name}</p>
                          <p className="text-[10px] text-gray-400">{t.symbol}</p>
                        </div>
                      </div>
                      <p className={`text-sm font-bold ${t.up ? 'text-green-500' : 'text-red-500'}`}>{t.change}</p>
                    </div>
                  ))}
                </div>
              </div>
              <h2 className="text-sm font-bold text-gray-900 mb-3">Services</h2>
            </div>
            <div className="px-5 pb-6 space-y-3">
              {[
                { bg: "from-orange-50 to-amber-50", border: "border-orange-100/50", icon: "🎁", title: "Gift Card Shop", desc: "29 popular gift cards", page: "shop" },
                { bg: "from-purple-50 to-indigo-50", border: "border-purple-100/50", icon: "🤖", title: "AI Assistant", desc: "Intent-driven trading", page: "ai" },
                { bg: "from-green-50 to-emerald-50", border: "border-green-100/50", icon: "🛡️", title: "Security Center", desc: "Anti-blind-sign protection", page: "security" },
                { bg: "from-pink-50 to-rose-50", border: "border-pink-100/50", icon: "🎁", title: "Heritage Wallet", desc: "Smart contract custody", page: "heritage" },
                { bg: "from-indigo-50 to-violet-50", border: "border-indigo-100/50", icon: "🌐", title: "DApp Browser", desc: "Explore Web3 apps", page: "dapps" },
                { bg: "from-gray-50 to-slate-50", border: "border-gray-100/50", icon: "👁", title: "Watch Wallet", desc: "Monitor any address", page: "watch" },
              ].map((item, i) => (
                <div key={i} className={`bg-gradient-to-r ${item.bg} rounded-2xl p-5 flex items-center justify-between cursor-pointer border ${item.border} active:scale-[0.99] transition-transform`} onClick={() => item.page && setSubPage(item.page)}>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── ACTIVITY TAB ─── */}
        {activeTab === "activity" && (
          <ActivityPage onBack={() => {}} />
        )}

        {/* ─── PROFILE TAB ─── */}
        {activeTab === "profile" && (
          <div className="bg-white min-h-screen">
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 rainbow-gradient" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/15" />
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-2xl" />
              <div className="relative z-10 px-6 pt-16 pb-10 text-white">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-lg border border-white/10">
                      <span className="text-white text-2xl font-extrabold">{shortAddr[2].toUpperCase()}</span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-white/20" />
                  </div>
                  <div>
                    <p className="font-bold text-xl tracking-tight">{displayName}</p>
                    <p className="text-[11px] opacity-50 font-mono mt-0.5">{shortAddr}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-5 py-5">
              {[
                { label: "Wallet", items: [
                  { icon: Wallet, title: "Wallet Management", desc: "Create/Import/Switch", page: "create" },
                  { icon: Shield, title: "Security Settings", desc: "Password/Biometrics", page: "security" },
                  { icon: Activity, title: "Transaction History", desc: "View all transactions", page: "activity" },
                ]},
                { label: "Features", items: [
                  { icon: Gift, title: "Heritage Wallet", desc: "Smart contract custody", page: "heritage" },
                  { icon: Eye, title: "Watch Wallet", desc: "Monitor any address", page: "watch" },
                  { icon: Compass, title: "NFT Gallery", desc: "View your collections", page: "nfts" },
                  { icon: Trophy, title: "Achievements", desc: "Your crypto milestones", page: "achievements" },
                  { icon: Palette, title: "Themes", desc: "Customize your wallet look", page: "themes" },
                ]},
                { label: "System", items: [
                  { icon: Globe, title: "Network", desc: "Ethereum Mainnet", page: "network" },
                  { icon: CreditCard, title: "Buy Crypto", desc: "MoonPay, Transak, Ramp", page: "buy" },
                  { icon: Sparkles, title: "Settings", desc: "Language, currency, notifications", page: "settings" },
                  { icon: Clock, title: "Help & Support", desc: "FAQs, guides, contact us", page: "help" },
                ]},
              ].map((section) => (
                <div key={section.label} className="mb-5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">{section.label}</p>
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <div key={item.page} className="bg-white rounded-2xl p-4 flex items-center justify-between border border-gray-100 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors" onClick={() => setSubPage(item.page)}>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center"><item.icon className="w-5 h-5 text-gray-600" /></div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-300" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-2xl border-t border-gray-200/50 safe-area-pb">
        <div className="flex justify-around py-2.5 px-2 max-w-lg mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const hasNotification = tab.id === "activity";
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-all duration-200 relative ${
                  isActive
                    ? 'text-blue-600'
                    : 'text-gray-400 active:text-gray-600'
                }`}>
                <div className="relative">
                  <Icon className="w-[22px] h-[22px]" strokeWidth={isActive ? 2.2 : 1.8} />
                  {hasNotification && (
                    <div className="absolute -top-1 -right-1.5 w-[7px] h-[7px] bg-red-500 rounded-full ring-2 ring-white" />
                  )}
                </div>
                <span className={`text-[10px] leading-none ${isActive ? 'font-bold' : 'font-medium'}`}>{tab.label}</span>
                {isActive && (
                  <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-blue-500" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {showOnboarding && <Onboarding onComplete={completeOnboarding} />}
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} commands={cmdCommands} />
      <button onClick={() => setCmdOpen(true)} className="fixed bottom-20 right-4 w-12 h-12 bg-gray-900 text-white rounded-2xl shadow-lg flex items-center justify-center active:scale-95 transition-transform z-40">
        <span className="text-xs font-mono font-bold">⌘K</span>
      </button>
    </div>
  );
}

/* ───────── Root Page ───────── */

export default function Page() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [page, setPage] = useState<"welcome" | "password" | "creating" | "mnemonic" | "verify" | "name" | "import" | "app">("welcome");
  const [chainAddresses, setChainAddresses] = useState<ChainAddress[]>([]);
  const [purchaseIntent] = useState<PurchaseIntent | null>(null);
  const [createError, setCreateError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [walletName, setWalletName] = useState("My Wallet");

  const handleSetPassword = async () => {
    if (!password || password.length < 6) { setCreateError("Password must be at least 6 characters"); return; }
    if (password !== confirmPassword) { setCreateError("Passwords do not match"); return; }
    setCreateError("");
    setPage("creating");
    try {
      const { createWallet: tcxCreateWallet, deriveAddress, getMnemonic, deriveMultiChainAddresses } = await import("@/lib/tcx");
      const { keystoreJson } = await tcxCreateWallet(password);
      const address = await deriveAddress(keystoreJson, password);
      const mnemonic = await getMnemonic(keystoreJson, password);
      setWallet({ keystoreJson, address, mnemonic, password });
      deriveMultiChainAddresses(keystoreJson, password).then(setChainAddresses).catch(() => {});
      setPage("mnemonic");
    } catch (e: any) {
      setCreateError(e.message || "Failed to create wallet");
      setPage("password");
    }
  };

  if (page === "welcome") return <WelcomePage onCreate={() => setPage("password")} onImport={() => setPage("import")} />;
  if (page === "import") return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-5 py-4 flex items-center border-b border-gray-100">
        <button onClick={() => setPage("welcome")} className="p-2 -ml-2 rounded-xl hover:bg-gray-50"><ArrowLeft className="w-5 h-5 text-gray-700" /></button>
        <h1 className="flex-1 text-center text-lg font-semibold mr-9">Import Wallet</h1>
      </div>
      <div className="flex-1 px-5 py-6"><ImportWallet onWalletImported={(w) => { setWallet(w); setWalletName("Imported Wallet"); setPage("app"); import("@/lib/tcx").then(({ deriveMultiChainAddresses }) => { deriveMultiChainAddresses(w.keystoreJson, w.password).then(setChainAddresses).catch(() => {}); }); }} wallet={wallet} /></div>
    </div>
  );
  if (page === "password") return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-5 py-4 flex items-center border-b border-gray-100">
        <button onClick={() => setPage("welcome")} className="p-2 -ml-2 rounded-xl hover:bg-gray-50"><ArrowLeft className="w-5 h-5 text-gray-700" /></button>
        <h1 className="flex-1 text-center text-lg font-semibold mr-9">Create Wallet</h1>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 identity-gradient rounded-full flex items-center justify-center mb-6 shadow-lg"><Shield className="w-10 h-10 text-white" /></div>
        <h2 className="text-2xl font-bold mb-2">Create a Password</h2>
        <p className="text-gray-500 text-sm mb-8 text-center max-w-xs">This password protects your wallet on this device. It cannot recover your wallet.</p>
        <div className="w-full max-w-sm space-y-4">
          <div><label className="text-sm font-medium text-gray-500 mb-2 block">Password</label><input type="password" placeholder="At least 6 characters" value={password} onChange={(e) => { setPassword(e.target.value); setCreateError(""); }} onKeyDown={(e) => e.key === "Enter" && handleSetPassword()} className="w-full bg-gray-50 rounded-2xl p-4 border border-gray-100 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20" /></div>
          <div><label className="text-sm font-medium text-gray-500 mb-2 block">Confirm Password</label><input type="password" placeholder="Re-enter password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setCreateError(""); }} onKeyDown={(e) => e.key === "Enter" && handleSetPassword()} className="w-full bg-gray-50 rounded-2xl p-4 border border-gray-100 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20" /></div>
          {createError && <p className="text-sm text-red-500 text-center">{createError}</p>}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4"><p className="text-xs text-amber-700">Your password is used to encrypt your wallet locally. If you forget it, you can always restore with your seed phrase.</p></div>
          <button onClick={handleSetPassword} className="w-full identity-gradient text-white py-4 rounded-2xl font-semibold text-lg shadow-lg active:scale-[0.98] transition-transform">Continue</button>
        </div>
      </div>
    </div>
  );
  if (page === "creating") return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="w-20 h-20 identity-gradient rounded-full flex items-center justify-center mb-6 shadow-lg animate-pulse"><Loader2 className="w-10 h-10 text-white animate-spin" /></div>
      <h2 className="text-2xl font-bold mb-2">Creating Your Wallet</h2>
      <p className="text-gray-500 text-sm text-center max-w-xs">Generating secure keys using Token Core WASM...</p>
      <div className="mt-6 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /><span className="text-sm text-gray-400">This may take a few seconds</span></div>
    </div>
  );
  if (page === "mnemonic" && wallet?.mnemonic) return <MnemonicDisplayPage onComplete={() => setPage("verify")} mnemonic={wallet.mnemonic} />;
  if (page === "verify" && wallet?.mnemonic) return <MnemonicVerifyPage onComplete={() => setPage("name")} mnemonic={wallet.mnemonic} />;
  if (page === "name") return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-5 py-4 flex items-center border-b border-gray-100">
        <button onClick={() => setPage("verify")} className="p-2 -ml-2 rounded-xl hover:bg-gray-50"><ArrowLeft className="w-5 h-5 text-gray-700" /></button>
        <h1 className="flex-1 text-center text-lg font-semibold mr-9">Name Your Wallet</h1>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 identity-gradient rounded-full flex items-center justify-center mb-6 shadow-lg"><span className="text-white text-3xl font-bold">{walletName[0]}</span></div>
        <h2 className="text-2xl font-bold mb-2">Name Your Wallet</h2>
        <p className="text-gray-500 text-sm mb-8 text-center max-w-xs">Give your wallet a name to easily identify it later.</p>
        <div className="w-full max-w-sm space-y-4">
          <input type="text" placeholder="e.g. My Savings, Trading Wallet" value={walletName} onChange={(e) => setWalletName(e.target.value)} className="w-full bg-gray-50 rounded-2xl p-4 border border-gray-100 text-lg text-center font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          <button onClick={() => setPage("app")} className="w-full identity-gradient text-white py-4 rounded-2xl font-semibold text-lg shadow-lg active:scale-[0.98] transition-transform">Enter Wallet</button>
          <button onClick={() => setPage("app")} className="w-full text-gray-400 text-sm py-2">Skip for now</button>
        </div>
      </div>
    </div>
  );

  return <MainApp wallet={wallet} chainAddresses={chainAddresses} purchaseIntent={purchaseIntent} walletName={walletName} />;
}
