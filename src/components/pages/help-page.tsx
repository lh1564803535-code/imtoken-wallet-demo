"use client";

import { ArrowLeft, MessageCircle, Book, Bug, ExternalLink, ChevronRight } from "lucide-react";

const HELP_ITEMS = [
  {
    icon: Book,
    title: "Getting Started",
    desc: "Learn how to create, backup, and use your wallet",
    items: ["How to create a wallet", "How to backup your seed phrase", "How to send crypto", "How to receive crypto", "How to swap tokens"],
  },
  {
    icon: Bug,
    title: "Troubleshooting",
    desc: "Common issues and how to fix them",
    items: ["Transaction stuck or pending", "Wrong network selected", "Can't see my tokens", "Import not working"],
  },
  {
    icon: MessageCircle,
    title: "Contact Support",
    desc: "Get help from our team",
    items: ["Email: support@aiwallet.app", "Discord: discord.gg/aiwallet", "Twitter: @aiagentwallet"],
  },
];

export function HelpPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-5 py-4 flex items-center border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold mr-9">Help & Support</h1>
      </div>
      <div className="flex-1 px-5 py-6">
        {/* Quick search */}
        <div className="bg-gray-50 rounded-2xl px-4 py-3.5 flex items-center gap-3 border border-gray-100 mb-6">
          <Book className="w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search help articles" className="bg-transparent flex-1 text-sm focus:outline-none placeholder:text-gray-400" />
        </div>

        {/* Help sections */}
        <div className="space-y-5">
          {HELP_ITEMS.map((section) => (
            <div key={section.title}>
              <div className="flex items-center gap-2 mb-3">
                <section.icon className="w-4 h-4 text-gray-500" />
                <h2 className="text-sm font-bold text-gray-900">{section.title}</h2>
              </div>
              <p className="text-xs text-gray-400 mb-3">{section.desc}</p>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <div key={item} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100 active:bg-gray-200 transition-colors">
                    <span className="text-sm text-gray-700">{item}</span>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Version info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">AI Agent Wallet v1.0.0</p>
          <p className="text-xs text-gray-300 mt-1">Powered by Token Core (tcx-wasm)</p>
        </div>
      </div>
    </div>
  );
}
