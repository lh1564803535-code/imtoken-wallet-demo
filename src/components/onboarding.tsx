"use client";

import { useState, useEffect } from "react";
import { Send, ArrowLeftRight, Gift, Compass, X, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";

interface OnboardingStep {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: string;
}

const STEPS: OnboardingStep[] = [
  {
    icon: <Send className="w-6 h-6 text-blue-500" />,
    title: "Send & Receive",
    description: "Send crypto to anyone by address, or receive by sharing your QR code. Tap the Send or Receive buttons on the home screen.",
    highlight: "home-actions",
  },
  {
    icon: <ArrowLeftRight className="w-6 h-6 text-green-500" />,
    title: "Swap Tokens",
    description: "Exchange one token for another instantly. Best rates aggregated from multiple DEXs.",
    highlight: "home-swap",
  },
  {
    icon: <Gift className="w-6 h-6 text-purple-500" />,
    title: "Heritage Wallet",
    description: "Protect your crypto with a smart contract inheritance plan. Set up beneficiaries who can claim if you stop checking in.",
  },
  {
    icon: <Compass className="w-6 h-6 text-orange-500" />,
    title: "Discover DApps",
    description: "Browse and connect to decentralized apps. Swap on Uniswap, lend on Aave, collect NFTs on OpenSea, and more.",
  },
  {
    icon: <Sparkles className="w-6 h-6 text-pink-500" />,
    title: "AI Assistant",
    description: "Use natural language to trade, check prices, and manage your wallet. Just tell the AI what you want to do.",
  },
];

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      localStorage.setItem("onboarding-complete", "true");
      onComplete();
    } else {
      setStep(step + 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("onboarding-complete", "true");
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5">
          <div className="flex items-center gap-1.5">
            {STEPS.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all ${i <= step ? 'w-6 bg-blue-500' : 'w-2 bg-gray-200'}`} />
            ))}
          </div>
          <button onClick={handleSkip} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pt-8 pb-6 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            {current.icon}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{current.title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{current.description}</p>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex items-center gap-3">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <button onClick={handleNext} className="flex-1 identity-gradient text-white py-3.5 rounded-2xl font-semibold shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
            {isLast ? "Get Started" : "Next"}
            {!isLast && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem("onboarding-complete");
    if (!completed) {
      // Small delay so the app renders first
      const timer = setTimeout(() => setShowOnboarding(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  return { showOnboarding, completeOnboarding: () => setShowOnboarding(false) };
}
