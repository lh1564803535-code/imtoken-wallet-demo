"use client";

import { useState } from "react";
import { ArrowLeft, Copy } from "lucide-react";
import { QRCodeDisplay } from "@/components/qr-code";

export function ReceivePage({ onBack, address: addr }: { onBack: () => void; address?: string }) {
  const [copied, setCopied] = useState(false);
  const address = addr || "0x1234567890abcdef1234567890abcdef12345678";

  const handleCopy = () => {
    navigator.clipboard.writeText(address).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-5 py-4 flex items-center border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold mr-9">Receive</h1>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="bg-gray-50 rounded-3xl p-8 mb-6 border border-gray-100">
          <div className="w-52 h-52 bg-white rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm overflow-hidden">
            <QRCodeDisplay value={address} size={192} />
          </div>
        </div>
        <p className="text-xs text-gray-400 mb-4 text-center">Scan QR code to get address</p>
        <div className="w-full max-w-sm bg-gray-50 rounded-2xl p-4 flex items-center gap-3 border border-gray-100">
          <p className="flex-1 text-sm font-mono text-gray-600 break-all">{address}</p>
          <button onClick={handleCopy} className="p-2 rounded-xl bg-white border border-gray-100 hover:bg-gray-50 active:bg-gray-100 transition-colors shadow-sm">
            {copied ? <span className="text-green-500 text-xs font-medium">Copied</span> : <Copy className="w-4 h-4 text-gray-500" />}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-4">Supports ETH, ERC-20 tokens</p>
      </div>
    </div>
  );
}
