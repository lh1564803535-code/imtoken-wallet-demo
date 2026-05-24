"use client";

import { useState, useEffect } from "react";
import { Shield, X, ChevronRight } from "lucide-react";

interface BackupReminderProps {
  onBackup: () => void;
  onDismiss: () => void;
}

export function BackupReminder({ onBackup, onDismiss }: BackupReminderProps) {
  return (
    <div className="mx-5 mb-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 animate-fade-in-up">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
          <Shield className="w-5 h-5 text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-amber-900 text-sm mb-0.5">Backup Your Wallet</p>
          <p className="text-xs text-amber-700 mb-3">Your seed phrase is the only way to recover your wallet. Write it down and store it safely.</p>
          <button onClick={onBackup} className="flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-100 px-3 py-1.5 rounded-full hover:bg-amber-200 active:bg-amber-300 transition-colors">
            Backup Now <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <button onClick={onDismiss} className="p-1 rounded-lg hover:bg-amber-100 transition-colors shrink-0">
          <X className="w-4 h-4 text-amber-500" />
        </button>
      </div>
    </div>
  );
}

export function useBackupReminder() {
  const [dismissed, setDismissed] = useState(false);
  const [hasBackedUp, setHasBackedUp] = useState(false);

  useEffect(() => {
    const backed = localStorage.getItem("wallet-backed-up");
    const dismissedBefore = localStorage.getItem("backup-reminder-dismissed");
    if (backed) setHasBackedUp(true);
    if (dismissedBefore) setDismissed(true);
  }, []);

  const dismiss = () => {
    setDismissed(true);
    localStorage.setItem("backup-reminder-dismissed", "true");
  };

  const markBackedUp = () => {
    setHasBackedUp(true);
    localStorage.setItem("wallet-backed-up", "true");
  };

  return {
    showReminder: !hasBackedUp && !dismissed,
    dismiss,
    markBackedUp,
  };
}
