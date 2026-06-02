"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, QrCode, ChevronRight, AlertTriangle, CheckCircle, Loader2, Copy, ExternalLink } from "lucide-react";
import type { WalletData } from "@/lib/tcx";

type SendStep = "input" | "confirm" | "sending" | "success" | "error";

export function SendPage({ onBack, wallet }: { onBack: () => void; wallet: WalletData | null }) {
  const [step, setStep] = useState<SendStep>("input");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [addressValid, setAddressValid] = useState<boolean | null>(null);
  const [gasEstimate] = useState("0.0012");
  const [txHash, setTxHash] = useState("");

  // Validate address on change
  useEffect(() => {
    if (!address) { setAddressValid(null); return; }
    const isValid = /^0x[a-fA-F0-9]{40}$/.test(address) || address.endsWith(".eth");
    setAddressValid(isValid);
  }, [address]);

  const usdValue = amount ? (parseFloat(amount) * 2691.34).toFixed(2) : "0.00";
  const totalCost = amount ? (parseFloat(amount) + parseFloat(gasEstimate)).toFixed(6) : "0";
  const totalUsd = (parseFloat(totalCost) * 2691.34).toFixed(2);

  const handleReview = () => {
    if (!addressValid || !amount || parseFloat(amount) <= 0) return;
    setStep("confirm");
  };

  const handleSend = async () => {
    setStep("sending");
    // Simulate sending
    await new Promise(r => setTimeout(r, 2000));
    setTxHash("0x" + Math.random().toString(16).slice(2, 66));
    setStep("success");
  };

  // ─── Step 1: Input ───
  if (step === "input") {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="px-5 py-4 flex items-center border-b border-gray-100">
          <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"><ArrowLeft className="w-5 h-5 text-gray-700" /></button>
          <h1 className="flex-1 text-center text-lg font-semibold mr-9">Send</h1>
        </div>
        <div className="flex-1 px-5 py-6">
          <div className="space-y-5">
            {/* Token */}
            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">Asset</label>
              <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4 border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">ET</div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Ethereum</p>
                  <p className="text-sm text-gray-400">Balance: 0.5 ETH</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </div>
            </div>
            {/* Address */}
            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">To</label>
              <div className="relative">
                <input type="text" placeholder="Enter address or ENS name" value={address} onChange={(e) => setAddress(e.target.value)}
                  className={`w-full bg-gray-50 rounded-2xl p-4 pr-12 border text-sm focus:outline-none transition-all ${
                    addressValid === true ? 'border-green-300 focus:ring-2 focus:ring-green-500/20' :
                    addressValid === false ? 'border-red-300 focus:ring-2 focus:ring-red-500/20' :
                    'border-gray-100 focus:ring-2 focus:ring-blue-500/20'
                  }`} />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-gray-100"><QrCode className="w-5 h-5 text-gray-400" /></button>
              </div>
              {addressValid === false && address.length > 5 && (
                <p className="text-xs text-red-500 mt-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Invalid address format</p>
              )}
              {addressValid === true && (
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Valid address</p>
              )}
            </div>
            {/* Amount */}
            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">Amount</label>
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-center">
                <input type="text" placeholder="0.00" value={amount} onChange={(e) => { const v = e.target.value; if (/^\d*\.?\d*$/.test(v)) setAmount(v); }}
                  className="w-full text-center text-4xl font-bold text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-200" />
                <p className="text-sm text-gray-400 mt-2">≈ ${usdValue} USD</p>
              </div>
              <div className="flex justify-center gap-2 mt-3">
                {[{ label: "25%", value: 0.125 }, { label: "50%", value: 0.25 }, { label: "MAX", value: 0.5 }].map((p) => (
                  <button key={p.label} onClick={() => setAmount(p.value.toString())} className="px-4 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-gray-600 hover:bg-gray-200 active:bg-gray-300 transition-colors">{p.label}</button>
                ))}
              </div>
            </div>
            {/* Gas estimate */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Estimated Gas</span>
                <span className="text-sm font-medium text-gray-700">~{gasEstimate} ETH (${(parseFloat(gasEstimate) * 2691.34).toFixed(2)})</span>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <button onClick={handleReview} disabled={!addressValid || !amount || parseFloat(amount) <= 0}
              className="w-full identity-gradient disabled:opacity-40 disabled:shadow-none text-white py-4 rounded-2xl font-semibold text-lg shadow-lg active:scale-[0.98] transition-all">
              Review Send
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Step 2: Confirm ───
  if (step === "confirm") {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="px-5 py-4 flex items-center border-b border-gray-100">
          <button onClick={() => setStep("input")} className="p-2 -ml-2 rounded-xl hover:bg-gray-50"><ArrowLeft className="w-5 h-5 text-gray-700" /></button>
          <h1 className="flex-1 text-center text-lg font-semibold mr-9">Confirm Send</h1>
        </div>
        <div className="flex-1 px-5 py-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⟠</span>
            </div>
            <p className="text-3xl font-extrabold text-gray-900">{amount} ETH</p>
            <p className="text-sm text-gray-400 mt-1">≈ ${usdValue} USD</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">From</span>
              <span className="text-sm font-mono text-gray-700">{wallet?.address ? `${wallet.address.slice(0, 8)}...${wallet.address.slice(-6)}` : "0x1234...5678"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">To</span>
              <span className="text-sm font-mono text-gray-700">{address.length > 20 ? `${address.slice(0, 8)}...${address.slice(-6)}` : address}</span>
            </div>
            <div className="h-px bg-gray-200" />
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Network</span>
              <span className="text-sm text-gray-700">Ethereum Mainnet</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Gas Fee</span>
              <span className="text-sm text-gray-700">~{gasEstimate} ETH (${(parseFloat(gasEstimate) * 2691.34).toFixed(2)})</span>
            </div>
            <div className="h-px bg-gray-200" />
            <div className="flex justify-between">
              <span className="text-sm font-semibold text-gray-900">Total</span>
              <span className="text-sm font-semibold text-gray-900">{totalCost} ETH (${totalUsd})</span>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6">
            <p className="text-xs text-amber-700 flex items-start gap-2"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> Please double-check the address. Transactions cannot be reversed once confirmed on the blockchain.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep("input")} className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-2xl font-semibold active:scale-[0.98] transition-transform">Cancel</button>
            <button onClick={handleSend} className="flex-1 identity-gradient text-white py-4 rounded-2xl font-semibold shadow-lg active:scale-[0.98] transition-transform">Confirm & Send</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Step 3: Sending ───
  if (step === "sending") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 identity-gradient rounded-full flex items-center justify-center mb-6 shadow-lg animate-pulse"><Loader2 className="w-10 h-10 text-white animate-spin" /></div>
        <h2 className="text-2xl font-bold mb-2">Sending Transaction</h2>
        <p className="text-gray-500 text-sm text-center max-w-xs">Broadcasting to Ethereum network...</p>
        <div className="mt-6 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /><span className="text-sm text-gray-400">Please wait</span></div>
      </div>
    );
  }

  // ─── Step 4: Success ───
  if (step === "success") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"><CheckCircle className="w-10 h-10 text-green-500" /></div>
        <h2 className="text-2xl font-bold mb-2">Sent Successfully!</h2>
        <p className="text-gray-500 text-sm text-center max-w-xs">{amount} ETH has been sent to {address.slice(0, 8)}...</p>
        <div className="w-full max-w-sm mt-6 bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 mb-1">Transaction Hash</p>
          <p className="text-xs font-mono text-gray-600 break-all">{txHash}</p>
        </div>
        <div className="flex gap-3 w-full max-w-sm mt-6">
          <button onClick={() => navigator.clipboard.writeText(txHash)} className="flex-1 bg-gray-100 text-gray-700 py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"><Copy className="w-4 h-4" /> Copy Hash</button>
          <button className="flex-1 bg-gray-100 text-gray-700 py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"><ExternalLink className="w-4 h-4" /> Explorer</button>
        </div>
        <button onClick={onBack} className="mt-8 text-blue-500 font-medium">Back to Wallet</button>
      </div>
    );
  }

  // ─── Step 5: Error ───
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6"><AlertTriangle className="w-10 h-10 text-red-500" /></div>
      <h2 className="text-2xl font-bold mb-2">Transaction Failed</h2>
      <p className="text-gray-500 text-sm text-center max-w-xs">The transaction could not be completed. Please try again.</p>
      <div className="flex gap-3 w-full max-w-sm mt-8">
        <button onClick={onBack} className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-2xl font-semibold active:scale-[0.98] transition-transform">Cancel</button>
        <button onClick={() => setStep("input")} className="flex-1 identity-gradient text-white py-4 rounded-2xl font-semibold shadow-lg active:scale-[0.98] transition-transform">Try Again</button>
      </div>
    </div>
  );
}
