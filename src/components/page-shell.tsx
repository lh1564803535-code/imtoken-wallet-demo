"use client";

import { ArrowLeft } from "lucide-react";

interface PageShellProps {
  title: string;
  onBack?: () => void;
  children: React.ReactNode;
  noPadding?: boolean;
}

export function PageShell({ title, onBack, children, noPadding }: PageShellProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-5 py-4 flex items-center border-b border-gray-100 shrink-0">
        {onBack && (
          <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
        )}
        <h1 className="flex-1 text-center text-lg font-semibold mr-9">{title}</h1>
      </div>
      <div className={`flex-1 ${noPadding ? '' : 'px-5 py-6'}`}>{children}</div>
    </div>
  );
}
