"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

interface BitrefillWidgetProps {
  paymentMethod?: string;
  theme?: "light" | "dark";
  onInvoiceCreated?: (data: any) => void;
  onInvoiceComplete?: (data: any) => void;
}

export function BitrefillWidget({
  paymentMethod = "ethereum",
  theme = "light",
  onInvoiceCreated,
  onInvoiceComplete,
}: BitrefillWidgetProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [status, setStatus] = useState<string>("loading");
  const [error, setError] = useState(false);

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.origin !== "https://embed.bitrefill.com") return;

      const data = e.data;
      if (data.event === "invoice_created") {
        setStatus("invoice_created");
        onInvoiceCreated?.(data);
      } else if (data.event === "invoice_complete") {
        setStatus("invoice_complete");
        onInvoiceComplete?.(data);
      } else if (data.event === "invoice_update") {
        setStatus(data.status || "updating");
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onInvoiceCreated, onInvoiceComplete]);

  // Timeout: if iframe doesn't load in 10s, show error
  useEffect(() => {
    if (status === "loading") {
      const timer = setTimeout(() => {
        if (status === "loading") setError(true);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const src = `https://embed.bitrefill.com/?showPaymentInfo=true&theme=${theme}&paymentMethod=${paymentMethod}&hl=en`;

  if (error) {
    return (
      <div className="rounded-xl ring-1 ring-[#111d4a]/10 bg-white p-6 text-center space-y-3">
        <p className="text-sm text-[#99a1af]">Unable to load Bitrefill Store</p>
        <a
          href="https://www.bitrefill.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[#007fff] hover:text-[#006cd9] underline"
        >
          Open Bitrefill.com →
        </a>
        <p className="text-xs text-[#99a1af] mt-2">
          Or use our demo catalog below
        </p>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden ring-1 ring-[#111d4a]/10">
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-10 rounded-xl">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-[#007fff]" />
            <span className="text-sm text-[#99a1af]">Loading Bitrefill Store...</span>
          </div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={src}
        width="100%"
        height="600"
        sandbox="allow-same-origin allow-popups allow-scripts allow-forms"
        className="w-full rounded-xl"
        onLoad={() => setStatus("ready")}
        onError={() => setError(true)}
        title="Bitrefill Store"
      />
    </div>
  );
}
