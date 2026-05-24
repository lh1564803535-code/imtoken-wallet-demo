"use client";

import { ArrowLeft, ExternalLink, CreditCard, Building2, Smartphone } from "lucide-react";

const PROVIDERS = [
  {
    name: "MoonPay",
    desc: "Buy crypto with credit card, bank transfer, or Apple Pay",
    icon: CreditCard,
    color: "from-purple-50 to-indigo-50",
    border: "border-purple-100/50",
    supported: ["ETH", "BTC", "USDT", "SOL"],
    fees: "~4.5% card, ~1% bank",
  },
  {
    name: "Transak",
    desc: "Global fiat-to-crypto on-ramp in 100+ countries",
    icon: Building2,
    color: "from-blue-50 to-cyan-50",
    border: "border-blue-100/50",
    supported: ["ETH", "BTC", "MATIC", "AVAX"],
    fees: "~5.5% card, ~1.5% bank",
  },
  {
    name: "Ramp Network",
    desc: "Fast purchases with Apple Pay and Google Pay",
    icon: Smartphone,
    color: "from-green-50 to-emerald-50",
    border: "border-green-100/50",
    supported: ["ETH", "USDT", "MATIC"],
    fees: "~2.9% card",
  },
];

export function BuyPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-5 py-4 flex items-center border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold mr-9">Buy Crypto</h1>
      </div>
      <div className="flex-1 px-5 py-6">
        <p className="text-sm text-gray-500 mb-6">Purchase crypto directly with fiat currency through our trusted partners.</p>
        <div className="space-y-3">
          {PROVIDERS.map((provider) => (
            <div key={provider.name} className={`bg-gradient-to-r ${provider.color} rounded-2xl p-5 border ${provider.border} cursor-pointer active:scale-[0.99] transition-transform`}>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                  <provider.icon className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-gray-900">{provider.name}</p>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{provider.desc}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {provider.supported.map((s) => (
                      <span key={s} className="text-[10px] px-2 py-0.5 bg-white/80 rounded-full text-gray-600 font-medium border border-gray-100">{s}</span>
                    ))}
                    <span className="text-[10px] text-gray-400 ml-auto">{provider.fees}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 bg-amber-50 border border-amber-100 rounded-2xl p-4">
          <p className="text-xs text-amber-700">Purchases are processed by third-party providers. Fees and availability vary by region. KYC verification may be required.</p>
        </div>
      </div>
    </div>
  );
}
