"use client";

import { useState, type ReactNode } from "react";
import { AlertTriangle, Shield } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
  children?: ReactNode;
}

export function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmLabel = "Confirm", cancelLabel = "Cancel", variant = "default", children }: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
        <div className="px-6 pt-6 pb-4 text-center">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${variant === "danger" ? "bg-red-50" : "bg-blue-50"}`}>
            {variant === "danger" ? <AlertTriangle className="w-7 h-7 text-red-500" /> : <Shield className="w-7 h-7 text-blue-500" />}
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        {children && <div className="px-6 pb-4">{children}</div>}
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 py-3.5 rounded-2xl font-semibold active:scale-[0.98] transition-transform">{cancelLabel}</button>
          <button onClick={onConfirm} className={`flex-1 py-3.5 rounded-2xl font-semibold active:scale-[0.98] transition-transform shadow-lg ${
            variant === "danger" ? "bg-red-500 text-white" : "identity-gradient text-white"
          }`}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

interface PasswordConfirmProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
}

export function PasswordConfirmDialog({ open, onClose, onConfirm, title = "Confirm Action" }: PasswordConfirmProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    if (!password) { setError("Please enter your password"); return; }
    // Simulate password verification
    await new Promise(r => setTimeout(r, 500));
    setPassword("");
    setError("");
    onConfirm();
  };

  if (!open) return null;

  return (
    <ConfirmDialog open={open} onClose={() => { onClose(); setPassword(""); setError(""); }} onConfirm={handleConfirm}
      title={title} description="Enter your wallet password to confirm this action.">
      <div>
        <input type="password" placeholder="Wallet password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
          className="w-full bg-gray-50 rounded-2xl p-4 border border-gray-100 text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        {error && <p className="text-xs text-red-500 mt-2 text-center">{error}</p>}
      </div>
    </ConfirmDialog>
  );
}

export function useConfirmDialog() {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<Partial<ConfirmDialogProps>>({});

  const confirm = (props: Partial<ConfirmDialogProps>): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfig({
        ...props,
        onConfirm: () => { setOpen(false); resolve(true); },
        onClose: () => { setOpen(false); resolve(false); },
      });
      setOpen(true);
    });
  };

  return { open, config, confirm };
}
