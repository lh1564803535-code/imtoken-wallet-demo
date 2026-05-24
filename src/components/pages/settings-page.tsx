"use client";

import { useState } from "react";
import { ArrowLeft, Shield, Globe, Activity, ChevronRight } from "lucide-react";

export function SettingsPage({ onBack }: { onBack: () => void }) {
  const [currency, setCurrency] = useState("USD");
  const [language, setLanguage] = useState("English");
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-5 py-4 flex items-center border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold mr-9">Settings</h1>
      </div>
      <div className="flex-1 px-5 py-5">
        {/* General */}
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">General</p>
        <div className="space-y-1 mb-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-900">Language</span>
            </div>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-transparent text-sm text-gray-500 focus:outline-none cursor-pointer">
              <option>English</option>
              <option>中文</option>
              <option>日本語</option>
              <option>한국어</option>
            </select>
          </div>
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-3">
              <span className="text-gray-500 font-medium">$</span>
              <span className="font-medium text-gray-900">Currency</span>
            </div>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="bg-transparent text-sm text-gray-500 focus:outline-none cursor-pointer">
              <option>USD</option>
              <option>EUR</option>
              <option>CNY</option>
              <option>JPY</option>
              <option>GBP</option>
            </select>
          </div>
        </div>
        {/* Security */}
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">Security</p>
        <div className="space-y-1 mb-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-900">Biometrics</span>
            </div>
            <button
              onClick={() => setBiometrics(!biometrics)}
              className={`w-12 h-7 rounded-full relative transition-colors ${biometrics ? 'bg-blue-500' : 'bg-gray-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${biometrics ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-900">Auto-Lock</span>
            </div>
            <span className="text-sm text-gray-400">5 minutes</span>
          </div>
        </div>
        {/* Notifications */}
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">Notifications</p>
        <div className="space-y-1 mb-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-900">Push Notifications</span>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-7 rounded-full relative transition-colors ${notifications ? 'bg-blue-500' : 'bg-gray-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${notifications ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
        {/* About */}
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">About</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <span className="font-medium text-gray-900">Version</span>
            <span className="text-sm text-gray-400">1.0.0</span>
          </div>
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
            <span className="font-medium text-gray-900">Terms of Service</span>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </div>
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
            <span className="font-medium text-gray-900">Privacy Policy</span>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
