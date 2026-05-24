"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-sm text-gray-500 text-center max-w-xs mb-6">
            An unexpected error occurred. This is likely a temporary issue.
          </p>
          <p className="text-xs text-gray-400 font-mono bg-gray-50 px-4 py-2 rounded-lg mb-6 max-w-sm break-all">
            {this.state.error?.message || "Unknown error"}
          </p>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
            className="flex items-center gap-2 identity-gradient text-white px-6 py-3 rounded-2xl font-semibold shadow-lg active:scale-[0.98] transition-transform"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export function InsufficientBalanceWarning({ balance, amount, symbol }: { balance: number; amount: number; symbol: string }) {
  if (amount <= 0 || amount <= balance) return null;
  const deficit = (amount - balance).toFixed(6);
  return (
    <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-red-700">Insufficient Balance</p>
        <p className="text-xs text-red-600 mt-1">
          You need {deficit} more {symbol}. Your current balance is {balance} {symbol}.
        </p>
      </div>
    </div>
  );
}

export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-7 h-7 text-red-400" />
      </div>
      <p className="font-semibold text-gray-900 mb-1">Network Error</p>
      <p className="text-sm text-gray-500 text-center max-w-xs mb-4">Could not connect to the network. Please check your connection.</p>
      {onRetry && (
        <button onClick={onRetry} className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-200 active:bg-gray-300 transition-colors">
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      )}
    </div>
  );
}
