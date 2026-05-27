"use client";

import { ArrowLeft, Copy, Check } from "lucide-react";
import { useState } from "react";

const BRAND_PROMPT = `This is the brand system for imToken AI Agent Wallet. There are THREE layers — do NOT mix them:

1. PRIMARY APP ICON
- Dragon head only (not full body)
- Dark blue rounded square background
- White dragon head
- Gold horns
- A few colorful back spines
- NO nostril dots
- NO baby face
- NO starfield background
- Must be recognizable at small sizes

2. EXTENDED / THEMED ICONS
- For themes, events, collectible feel
- Can be more dreamy and playful
- Must be the SAME dragon as the main icon
- Cannot change core silhouette or brand identity

3. MASCOT (Full Body)
- For onboarding, achievements, posters, empty states
- Full body white dragon is allowed
- But it is NOT the main icon

Visual Core:
- White guardian dragon
- Gold deer/dragon antlers
- Soft premium feel
- Subtle blue halo
- Few colorful back spines
- Cute but NOT childish
- Like a mature wallet brand, not children's stickers

STRICTLY FORBIDDEN:
- Nostril black dots
- Baby/toddler smiling face
- Starfield as main icon background
- Stuffing full-body dragon into the main icon
- Too many colorful particles
- Too cartoonish/childish style
- Changing to a different dragon style
- Inventing a new brand system`;

export function BrandPage({ onBack }: { onBack: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(BRAND_PROMPT).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 flex items-center border-b border-gray-100 shrink-0">
        <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold mr-9">Brand Guidelines</h1>
      </div>

      <div className="flex-1 px-5 py-6 space-y-8 overflow-y-auto">

        {/* A. Primary App Icon */}
        <section>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Primary App Icon</p>
          <p className="text-[11px] text-gray-400 mb-4">The official wallet icon. Dragon head only. Do NOT use full body here.</p>
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-40 h-40 rounded-[2rem] overflow-hidden shadow-xl border border-gray-100">
                <img src="/brand/main-icon.png" alt="Primary App Icon" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                FINAL VERSION
              </div>
            </div>
          </div>
          <div className="mt-6 bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <p className="text-xs font-semibold text-gray-900 mb-2">Spec</p>
            <div className="space-y-1.5 text-xs text-gray-600">
              <p>• Dragon head as the focal point (not full body)</p>
              <p>• Dark blue rounded square background</p>
              <p>• White dragon head with gold horns</p>
              <p>• A few colorful back spines as accent</p>
              <p>• Recognizable at 32×32 pixels</p>
            </div>
          </div>
        </section>

        {/* B. Visual Core */}
        <section>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Brand Visual Core</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              "White guardian dragon",
              "Gold deer / dragon antlers",
              "Soft premium feel",
              "Subtle blue halo glow",
              "Few colorful back spines",
              "Cute but NOT childish",
              "Mature wallet brand identity",
              "Not children's stickers",
            ].map((item) => (
              <div key={item} className="bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
                <p className="text-xs text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* C. Three-Layer System */}
        <section>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Three-Layer Icon System</p>
          <div className="space-y-3">
            {[
              {
                layer: "1",
                name: "Primary App Icon",
                use: "Wallet identity, App Icon, favicon",
                rule: "Dragon head only. Deep blue bg. Must work at small size.",
                color: "border-blue-200 bg-blue-50",
              },
              {
                layer: "2",
                name: "Extended / Themed Icons",
                use: "Themes, events, collectible feel",
                rule: "Can be more dreamy. Same dragon. Don't change core silhouette.",
                color: "border-purple-200 bg-purple-50",
              },
              {
                layer: "3",
                name: "Mascot (Full Body)",
                use: "Onboarding, achievements, posters, empty states",
                rule: "Full body white dragon allowed. NOT the main icon.",
                color: "border-amber-200 bg-amber-50",
              },
            ].map((item) => (
              <div key={item.layer} className={`rounded-2xl p-4 border ${item.color}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-gray-900 text-white text-[10px] font-bold flex items-center justify-center">{item.layer}</span>
                  <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                </div>
                <p className="text-xs text-gray-500 mb-1"><span className="font-medium text-gray-700">Use for:</span> {item.use}</p>
                <p className="text-xs text-gray-500"><span className="font-medium text-gray-700">Rule:</span> {item.rule}</p>
              </div>
            ))}
          </div>
        </section>

        {/* D. Extended Icons */}
        <section>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Extended Icon References</p>
          <p className="text-[11px] text-gray-400 mb-4">These show the direction for themed variants. Same dragon, different mood.</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="aspect-square rounded-2xl overflow-hidden shadow-md border border-gray-100 mb-2">
                <img src="/brand/extended-v2.png" alt="Extended v2" className="w-full h-full object-cover" />
              </div>
              <p className="text-xs font-semibold text-gray-900 text-center">v2 — Premium Soft Glow</p>
              <p className="text-[11px] text-gray-400 text-center">High-end soft light aesthetic</p>
            </div>
            <div>
              <div className="aspect-square rounded-2xl overflow-hidden shadow-md border border-gray-100 mb-2">
                <img src="/brand/extended-v5-flat.png" alt="Extended v5 flat" className="w-full h-full object-cover" />
              </div>
              <p className="text-xs font-semibold text-gray-900 text-center">v5 — Reduced Childishness</p>
              <p className="text-[11px] text-gray-400 text-center">Less noise, more mature</p>
            </div>
          </div>
        </section>

        {/* E. Strictly Forbidden */}
        <section>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Strictly Forbidden</p>
          <div className="space-y-2">
            {[
              "Nostril black dots on the dragon",
              "Baby / toddler smiling face",
              "Starfield as main icon background",
              "Stuffing full-body dragon into main icon",
              "Too many colorful particles / fragments",
              "Too cartoonish or childish style",
              "Changing to a different dragon style",
              "Inventing a new brand system from scratch",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5 p-3 bg-red-50 rounded-xl border border-red-100">
                <span className="text-red-500 font-bold text-sm mt-0.5">✗</span>
                <p className="text-xs text-red-700">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* F. Copyable AI Prompt */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">AI Prompt / Brand Spec</p>
              <p className="text-[11px] text-gray-400">Copy this and send to any AI to enforce brand rules</p>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white rounded-xl text-xs font-medium active:scale-95 transition-transform"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 max-h-64 overflow-y-auto">
            <pre className="text-[11px] text-gray-600 whitespace-pre-wrap font-mono leading-relaxed">{BRAND_PROMPT}</pre>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center pb-8">
          <p className="text-[11px] text-gray-300">imToken AI Agent Wallet — Brand Guidelines v1.0</p>
        </div>
      </div>
    </div>
  );
}
