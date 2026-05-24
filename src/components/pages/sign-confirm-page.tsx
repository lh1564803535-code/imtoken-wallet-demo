"use client";

import { useState } from "react";
import { Shield, AlertTriangle, CheckCircle, X, ExternalLink } from "lucide-react";

interface SignRequest {
  origin: string;
  method: string;
  message: string;
  risk: "low" | "medium" | "high";
}

export function SignConfirmPage({ onBack, request }: { onBack: () => void; request?: SignRequest }) {
  const [step, setStep] = useState<"review" | "signing" | "done">("review");

  const defaultRequest: SignRequest = request || {
    origin: "app.uniswap.org",
    method: "personal_sign",
    message: "Welcome to Uniswap!\n\nClick to sign in and accept the Uniswap Terms of Service.\n\nThis request will not trigger a blockchain transaction or cost any gas fees.\n\nWallet address:\n0x1234567890abcdef1234567890abcdef12345678\n\nNonce:\n0x1234",
    risk: "low",
  };

  const riskColors = {
    low: { bg: "bg-green-50", border: "border-green-100", text: "text-green-700", icon: <CheckCircle className="w-5 h-5 text-green-500" /> },
    medium: { bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-700", icon: <AlertTriangle className="w-5 h-5 text-amber-500" /> },
    high: { bg: "bg-red-50", border: "border-red-100", text: "text-red-700", icon: <AlertTriangle className="w-5 h-5 text-red-500" /> },
  };

  const risk = riskColors[defaultRequest.risk];

  if (step === "signing") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 identity-gradient rounded-full flex items-center justify-center mb-6 animate-pulse"><Shield className="w-8 h-8 text-white" /></div>
        <h2 className="text-xl font-bold mb-2">Signing Message...</h2>
        <p className="text-sm text-gray-400">Please wait while we sign your message</p>
      </div>
    );
  }

  if (step === "done") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6"><CheckCircle className="w-8 h-8 text-green-500" /></div>
        <h2 className="text-xl font-bold mb-2">Message Signed</h2>
        <p className="text-sm text-gray-400 mb-6">Signature sent to {defaultRequest.origin}</p>
        <button onClick={onBack} className="px-6 py-3 identity-gradient text-white rounded-2xl font-semibold shadow-lg active:scale-[0.98]">Done</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-5 py-4 flex items-center border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-gray-50"><X className="w-5 h-5 text-gray-700" /></button>
        <h1 className="flex-1 text-center text-lg font-semibold mr-9">Signature Request</h1>
      </div>
      <div className="flex-1 px-5 py-6">
        {/* Origin */}
        <div className="flex items-center gap-3 mb-6 bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-lg">🌐</div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">{defaultRequest.origin}</p>
            <p className="text-xs text-gray-400">wants you to sign a message</p>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-300" />
        </div>

        {/* Risk Assessment */}
        <div className={`${risk.bg} ${risk.border} border rounded-2xl p-4 flex items-center gap-3 mb-6`}>
          {risk.icon}
          <div>
            <p className={`font-semibold text-sm ${risk.text}`}>
              {defaultRequest.risk === "low" ? "Low Risk" : defaultRequest.risk === "medium" ? "Medium Risk" : "High Risk"}
            </p>
            <p className="text-xs text-gray-500">
              {defaultRequest.risk === "low" ? "This is a simple message signature. No funds will be transferred." :
               defaultRequest.risk === "medium" ? "This request may involve token approvals. Review carefully." :
               "This request involves fund transfers. Verify all details before signing."}
            </p>
          </div>
        </div>

        {/* Message */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-500 mb-2">Message to Sign</p>
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono break-all">{defaultRequest.message}</pre>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onBack} className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-2xl font-semibold active:scale-[0.98] transition-transform">Reject</button>
          <button onClick={() => { setStep("signing"); setTimeout(() => setStep("done"), 1500); }} className="flex-1 identity-gradient text-white py-4 rounded-2xl font-semibold shadow-lg active:scale-[0.98] transition-transform">Sign</button>
        </div>
      </div>
    </div>
  );
}
