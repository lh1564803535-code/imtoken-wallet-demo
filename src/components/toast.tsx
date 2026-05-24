"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { Check, X, AlertTriangle, Info } from "lucide-react";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

interface ToastContextType {
  toast: (message: string, type?: Toast["type"]) => void;
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const icons = {
    success: <Check className="w-4 h-4" />,
    error: <X className="w-4 h-4" />,
    warning: <AlertTriangle className="w-4 h-4" />,
    info: <Info className="w-4 h-4" />,
  };

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-amber-500",
    info: "bg-blue-500",
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed top-4 right-4 left-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`${colors[t.type]} text-white px-4 py-3 rounded-2xl shadow-lg flex items-center gap-3 animate-fade-in-up pointer-events-auto cursor-pointer`}
            onClick={() => removeToast(t.id)}
          >
            {icons[t.type]}
            <span className="text-sm font-medium flex-1">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
