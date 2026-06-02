"use client";

import { useState } from "react";
import { ArrowLeft, Gift, Plus, Users, Shield, ArrowLeftRight, Clock } from "lucide-react";
import { createVault, getVault, addBeneficiary, deposit, checkIn, triggerSwitch, getTimeRemaining, getTotalDeposited, updateTimeout, removeBeneficiary } from "@/lib/heritage";
import type { HeritageVault } from "@/lib/heritage";

export function HeritagePage({ onBack, ownerAddress }: { onBack: () => void; ownerAddress?: string }) {
  const [vaultState, setVaultState] = useState<HeritageVault | null>(getVault());
  const [view, setView] = useState<"dashboard" | "add" | "deposit" | "settings" | "claim">("dashboard");
  const [benName, setBenName] = useState("");
  const [benAddr, setBenAddr] = useState("");
  const [benShare, setBenShare] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [depositToken, setDepositToken] = useState("ETH");
  const [claimAddr, setClaimAddr] = useState("");
  const [toast, setToast] = useState("");
  const owner = ownerAddress || "0x1234567890abcdef1234567890abcdef12345678";

  const refresh = () => setVaultState(getVault());
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const handleCreateVault = () => {
    createVault(owner, 90);
    refresh();
    showToast("Heritage vault created!");
  };

  const handleAddBeneficiary = () => {
    if (!benName || !benAddr || !benShare) return;
    const share = parseInt(benShare);
    if (share < 1 || share > 100) { showToast("Share must be 1-100%"); return; }
    const ok = addBeneficiary(benName, benAddr, share);
    if (!ok) { showToast("Failed - check address/total shares"); return; }
    setBenName(""); setBenAddr(""); setBenShare("");
    refresh();
    setView("dashboard");
    showToast("Beneficiary added!");
  };

  const handleDeposit = () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) return;
    const colors: Record<string, { color: string; abbr: string }> = {
      ETH: { color: "bg-blue-500", abbr: "ET" },
      BTC: { color: "bg-orange-500", abbr: "BT" },
      USDT: { color: "bg-green-500", abbr: "US" },
    };
    const c = colors[depositToken] || colors.ETH;
    deposit("0x" + depositToken, depositToken, depositAmount, c.color, c.abbr);
    setDepositAmount("");
    refresh();
    setView("dashboard");
    showToast(`${depositAmount} ${depositToken} deposited!`);
  };

  const handleCheckIn = () => {
    checkIn();
    refresh();
    showToast("Heartbeat confirmed!");
  };

  const handleTrigger = () => {
    if (!claimAddr) return;
    const ok = triggerSwitch(claimAddr);
    if (!ok) { showToast("Not a valid beneficiary or vault not expired"); return; }
    refresh();
    showToast("Switch triggered - assets available for claim");
  };

  const timeRemaining = getTimeRemaining();
  const totalDeposited = getTotalDeposited();
  const allocatedShares = vaultState?.beneficiaries.reduce((s, b) => s + b.sharePercent, 0) || 0;

  // No vault yet - creation screen
  if (!vaultState) {
    return (
      <div className="bg-white min-h-screen">
        <div className="px-5 py-4 flex items-center border-b border-gray-100">
          <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="flex-1 text-center text-lg font-semibold mr-9">Heritage Wallet</h1>
        </div>
        <div className="flex flex-col items-center justify-center px-6 pt-20">
          <div className="w-20 h-20 identity-gradient rounded-full flex items-center justify-center mb-6 shadow-lg">
            <Gift className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Heritage Wallet</h2>
          <p className="text-gray-500 text-center mb-8 max-w-xs">Protect your crypto assets with a smart contract inheritance plan. If you stop checking in, your beneficiaries can claim.</p>
          <button onClick={handleCreateVault} className="w-full max-w-sm identity-gradient text-white py-4 rounded-2xl font-semibold text-lg shadow-lg active:scale-[0.98] transition-transform">
            Create Heritage Vault
          </button>
        </div>
        {toast && <div className="fixed bottom-4 left-4 right-4 bg-gray-900 text-white py-3 px-5 rounded-2xl text-sm font-medium text-center animate-fade-in-up z-50">{toast}</div>}
      </div>
    );
  }

  // Add beneficiary view
  if (view === "add") {
    return (
      <div className="bg-white min-h-screen">
        <div className="px-5 py-4 flex items-center border-b border-gray-100">
          <button onClick={() => setView("dashboard")} className="p-2 -ml-2 rounded-xl hover:bg-gray-50"><ArrowLeft className="w-5 h-5 text-gray-700" /></button>
          <h1 className="flex-1 text-center text-lg font-semibold mr-9">Add Beneficiary</h1>
        </div>
        <div className="px-5 py-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-500 mb-2 block">Name</label>
            <input value={benName} onChange={e => setBenName(e.target.value)} placeholder="e.g. Son, Parents, Spouse" className="w-full bg-gray-50 rounded-2xl p-4 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500 mb-2 block">Ethereum Address</label>
            <input value={benAddr} onChange={e => setBenAddr(e.target.value)} placeholder="0x..." className="w-full bg-gray-50 rounded-2xl p-4 border border-gray-100 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/20" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500 mb-2 block">Share Percentage ({100 - allocatedShares}% remaining)</label>
            <input value={benShare} onChange={e => setBenShare(e.target.value)} type="number" min="1" max={100 - allocatedShares} placeholder="50" className="w-full bg-gray-50 rounded-2xl p-4 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20" />
          </div>
          <button onClick={handleAddBeneficiary} className="w-full identity-gradient text-white py-4 rounded-2xl font-semibold shadow-lg active:scale-[0.98] transition-transform">Add Beneficiary</button>
        </div>
        {toast && <div className="fixed bottom-4 left-4 right-4 bg-gray-900 text-white py-3 px-5 rounded-2xl text-sm font-medium text-center animate-fade-in-up z-50">{toast}</div>}
      </div>
    );
  }

  // Deposit view
  if (view === "deposit") {
    return (
      <div className="bg-white min-h-screen">
        <div className="px-5 py-4 flex items-center border-b border-gray-100">
          <button onClick={() => setView("dashboard")} className="p-2 -ml-2 rounded-xl hover:bg-gray-50"><ArrowLeft className="w-5 h-5 text-gray-700" /></button>
          <h1 className="flex-1 text-center text-lg font-semibold mr-9">Deposit</h1>
        </div>
        <div className="px-5 py-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-500 mb-2 block">Asset</label>
            <select value={depositToken} onChange={e => setDepositToken(e.target.value)} className="w-full bg-gray-50 rounded-2xl p-4 border border-gray-100 text-sm focus:outline-none cursor-pointer">
              <option value="ETH">ETH (Balance: 0.5)</option>
              <option value="BTC">BTC (Balance: 0.001)</option>
              <option value="USDT">USDT (Balance: 200)</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500 mb-2 block">Amount</label>
            <input value={depositAmount} onChange={e => setDepositAmount(e.target.value)} type="text" placeholder="0.00" className="w-full bg-gray-50 rounded-2xl p-5 border border-gray-100 text-3xl font-bold text-center focus:outline-none focus:ring-2 focus:ring-purple-500/20" />
          </div>
          <button onClick={handleDeposit} className="w-full identity-gradient text-white py-4 rounded-2xl font-semibold shadow-lg active:scale-[0.98] transition-transform">Deposit to Heritage Vault</button>
          <p className="text-xs text-gray-400 text-center">Assets will be locked in the smart contract until triggered by inactivity</p>
        </div>
        {toast && <div className="fixed bottom-4 left-4 right-4 bg-gray-900 text-white py-3 px-5 rounded-2xl text-sm font-medium text-center animate-fade-in-up z-50">{toast}</div>}
      </div>
    );
  }

  // Claim view
  if (view === "claim") {
    return (
      <div className="bg-white min-h-screen">
        <div className="px-5 py-4 flex items-center border-b border-gray-100">
          <button onClick={() => setView("dashboard")} className="p-2 -ml-2 rounded-xl hover:bg-gray-50"><ArrowLeft className="w-5 h-5 text-gray-700" /></button>
          <h1 className="flex-1 text-center text-lg font-semibold mr-9">Claim Assets</h1>
        </div>
        <div className="px-5 py-6 space-y-5">
          {vaultState.status === "triggered" ? (
            <>
              <div className="bg-green-50 border border-green-100 rounded-2xl p-5 text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">✅</span>
                </div>
                <p className="font-bold text-gray-900 text-lg">Vault Triggered</p>
                <p className="text-sm text-gray-500 mt-1">The owner has missed the check-in deadline. Beneficiaries can now claim.</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 mb-2 block">Your Beneficiary Address</label>
                <input value={claimAddr} onChange={e => setClaimAddr(e.target.value)} placeholder="0x..." className="w-full bg-gray-50 rounded-2xl p-4 border border-gray-100 text-sm font-mono focus:outline-none" />
              </div>
              <button onClick={handleTrigger} className="w-full bg-green-500 text-white py-4 rounded-2xl font-semibold shadow-lg active:scale-[0.98] transition-transform">Claim Your Share</button>
            </>
          ) : (
            <div className="text-center pt-10">
              <p className="text-gray-500">The vault has not been triggered yet.</p>
              <p className="text-sm text-gray-400 mt-2">Assets become claimable only after the owner misses the check-in deadline.</p>
            </div>
          )}
        </div>
        {toast && <div className="fixed bottom-4 left-4 right-4 bg-gray-900 text-white py-3 px-5 rounded-2xl text-sm font-medium text-center animate-fade-in-up z-50">{toast}</div>}
      </div>
    );
  }

  // Settings view
  if (view === "settings") {
    return (
      <div className="bg-white min-h-screen">
        <div className="px-5 py-4 flex items-center border-b border-gray-100">
          <button onClick={() => setView("dashboard")} className="p-2 -ml-2 rounded-xl hover:bg-gray-50"><ArrowLeft className="w-5 h-5 text-gray-700" /></button>
          <h1 className="flex-1 text-center text-lg font-semibold mr-9">Settings</h1>
        </div>
        <div className="px-5 py-6 space-y-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Timeout Period</p>
          <div className="flex gap-2">
            {[30, 90, 180, 365].map(d => (
              <button key={d} onClick={() => { updateTimeout(d); refresh(); showToast(`Timeout set to ${d} days`); }}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${vaultState.timeoutDays === d ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {d}d
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400">How long before the vault can be triggered after your last check-in.</p>
          <div className="h-px bg-gray-100 my-4" />
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Danger Zone</p>
          {vaultState.beneficiaries.map(b => (
            <div key={b.address} className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
              <span className="text-sm text-red-700">{b.name}</span>
              <button onClick={() => { removeBeneficiary(b.address); refresh(); showToast("Removed"); }} className="text-xs text-red-500 font-medium">Remove</button>
            </div>
          ))}
        </div>
        {toast && <div className="fixed bottom-4 left-4 right-4 bg-gray-900 text-white py-3 px-5 rounded-2xl text-sm font-medium text-center animate-fade-in-up z-50">{toast}</div>}
      </div>
    );
  }

  // Dashboard (main view)
  return (
    <div className="bg-white min-h-screen">
      <div className="px-5 py-4 flex items-center border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold mr-9">Heritage Wallet</h1>
      </div>
      <div className="px-5 py-6 space-y-5">
        {/* Vault Card */}
        <div className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-xl" />
          <div className="relative z-10 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Gift className="w-4.5 h-4.5" />
                </div>
                <span className="font-semibold text-[15px]">Heritage Vault</span>
              </div>
              <span className={`text-[11px] px-3 py-1 rounded-full font-semibold backdrop-blur-sm ${
                vaultState.status === "active" ? "bg-green-400/20 text-green-100 border border-green-400/20" :
                vaultState.status === "grace_period" ? "bg-yellow-400/20 text-yellow-100 border border-yellow-400/20" :
                "bg-red-400/20 text-red-100 border border-red-400/20"
              }`}>{vaultState.status === "active" ? "Active" : vaultState.status === "grace_period" ? "Grace Period" : "Triggered"}</span>
            </div>
            <p className="text-[40px] font-extrabold tracking-tighter mb-1" style={{ textShadow: "0 2px 15px rgba(0,0,0,0.15)" }}>{totalDeposited}</p>
            <p className="text-[12px] opacity-60">{vaultState.deposits.length} deposit(s) • {vaultState.beneficiaries.length} beneficiary(ies)</p>
          </div>
        </div>

        {/* Vault Timeline */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Vault Lifecycle</p>
          <div className="flex items-center gap-1">
            {["Created", "Active", "Grace", "Triggered", "Claimed"].map((step, i) => {
              const statusOrder = { active: 1, grace_period: 2, triggered: 3, claimed: 4 };
              const current = statusOrder[vaultState.status as keyof typeof statusOrder] || 0;
              const isPast = i <= current;
              const isCurrent = i === current;
              return (
                <div key={step} className="flex-1 flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full mb-1 transition-colors ${isCurrent ? 'bg-blue-500 ring-4 ring-blue-100' : isPast ? 'bg-green-500' : 'bg-gray-200'}`} />
                  <span className={`text-[10px] ${isCurrent ? 'text-blue-600 font-semibold' : isPast ? 'text-green-600' : 'text-gray-300'}`}>{step}</span>
                  {i < 4 && <div className={`absolute h-0.5 w-8 ${isPast ? 'bg-green-300' : 'bg-gray-200'}`} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Heartbeat */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className={`w-4 h-4 rounded-full ${vaultState.status === "active" ? "bg-green-500" : vaultState.status === "grace_period" ? "bg-yellow-500" : "bg-red-500"}`} />
                {vaultState.status === "active" && <div className="absolute inset-0 w-4 h-4 rounded-full bg-green-400 animate-ping opacity-75" />}
              </div>
              <span className="font-bold text-[15px] text-gray-900">Heartbeat</span>
            </div>
            <button onClick={handleCheckIn} className="px-5 py-2.5 identity-gradient text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 active:scale-[0.95] transition-all duration-200">
              ❤️ Check In
            </button>
          </div>
          {timeRemaining && !timeRemaining.expired && (
            <div>
              <div className="flex justify-between text-sm mb-2.5">
                <span className="text-gray-400 font-medium">Time remaining</span>
                <span className={`font-bold text-[15px] ${timeRemaining.inGrace ? "text-yellow-600" : "text-gray-800"}`}>
                  {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.inGrace ? "(grace period!)" : ""}
                </span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${timeRemaining.inGrace ? "bg-gradient-to-r from-yellow-400 to-orange-400" : "bg-gradient-to-r from-green-400 to-emerald-400"}`}
                  style={{ width: `${Math.max(5, (timeRemaining.days / vaultState.timeoutDays) * 100)}%` }} />
              </div>
            </div>
          )}
          {timeRemaining?.expired && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center">
              <p className="text-sm font-semibold text-red-600">Deadline passed — beneficiaries can claim</p>
            </div>
          )}
          <p className="text-xs text-gray-400 mt-3">Check in every {vaultState.timeoutDays} days to keep vault active</p>
        </div>

        {/* Deposits */}
        {vaultState.deposits.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-500 mb-3">Deposited Assets</h2>
            <div className="space-y-2">
              {vaultState.deposits.map((d, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className={`w-9 h-9 ${d.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}>{d.abbr}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{d.amount} {d.symbol}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Beneficiaries */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[15px] font-bold text-gray-900">Beneficiaries</h2>
              <p className="text-[11px] text-gray-400 mt-0.5">{vaultState.beneficiaries.length} beneficiary(ies) • {vaultState.beneficiaries.reduce((s, b) => s + b.sharePercent, 0)}% allocated</p>
            </div>
            <button onClick={() => setView("add")} className="text-purple-500 text-sm font-bold flex items-center gap-1 bg-purple-50 px-3 py-1.5 rounded-full"><Plus className="w-4 h-4" />Add</button>
          </div>
          {vaultState.beneficiaries.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 text-center">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-7 h-7 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">No beneficiaries yet</p>
              <p className="text-xs text-gray-400 mb-4">Add people who should receive your assets</p>
              <button onClick={() => setView("add")} className="text-purple-500 text-sm font-bold">+ Add first beneficiary</button>
            </div>
          ) : (
            <div className="space-y-3">
              {vaultState.beneficiaries.map((b) => (
                <div key={b.address} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {b.name[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[14px] text-gray-900">{b.name}</span>
                        <span className="text-[15px] font-extrabold text-purple-600">{b.sharePercent}%</span>
                      </div>
                      <p className="text-[11px] text-gray-400 font-mono mt-0.5">{b.address.slice(0, 10)}...{b.address.slice(-6)}</p>
                    </div>
                  </div>
                  {/* Share bar */}
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all" style={{ width: `${b.sharePercent}%` }} />
                  </div>
                </div>
              ))}
              <p className="text-xs text-gray-400 text-right">{allocatedShares}% allocated | {100 - allocatedShares}% unallocated</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setView("deposit")} className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100/50 text-left active:scale-[0.98] transition-transform">
            <ArrowLeftRight className="w-5 h-5 text-blue-500 mb-2" />
            <p className="font-semibold text-gray-900 text-sm">Deposit</p>
            <p className="text-xs text-gray-400 mt-0.5">Lock assets in vault</p>
          </button>
          <button onClick={() => setView("claim")} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100/50 text-left active:scale-[0.98] transition-transform">
            <Shield className="w-5 h-5 text-green-500 mb-2" />
            <p className="font-semibold text-gray-900 text-sm">Claim</p>
            <p className="text-xs text-gray-400 mt-0.5">Beneficiary claim</p>
          </button>
          <button onClick={() => setView("settings")} className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-4 border border-gray-100/50 text-left active:scale-[0.98] transition-transform col-span-2">
            <Clock className="w-5 h-5 text-gray-500 mb-2" />
            <p className="font-semibold text-gray-900 text-sm">Settings</p>
            <p className="text-xs text-gray-400 mt-0.5">Timeout: {vaultState.timeoutDays} days | Grace: {vaultState.gracePeriodDays} days</p>
          </button>
        </div>

        {/* Info */}
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-gray-900 text-sm">How it works</p>
              <p className="text-xs text-gray-500 mt-1">Check in regularly to prove you still control this wallet. If you miss {vaultState.timeoutDays} days of check-ins, your beneficiaries can claim the deposited assets. A {vaultState.gracePeriodDays}-day grace period gives you a last chance to cancel.</p>
            </div>
          </div>
        </div>
      </div>
      {toast && <div className="fixed bottom-4 left-4 right-4 bg-gray-900 text-white py-3 px-5 rounded-2xl text-sm font-medium text-center animate-fade-in-up z-50">{toast}</div>}
    </div>
  );
}
