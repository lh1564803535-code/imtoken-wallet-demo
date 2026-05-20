"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PenLine, Copy, Check, Loader2 } from "lucide-react";
import type { WalletData } from "@/lib/tcx";

interface Props {
  wallet: WalletData | null;
}

export function SignMessage({ wallet }: Props) {
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSign = async () => {
    if (!wallet || !message) return;
    setLoading(true);
    setError("");
    try {
      const { signMessage } = await import("@/lib/tcx");
      const sig = await signMessage(
        wallet.keystore,
        wallet.password,
        wallet.address,
        message
      );
      setSignature(sig);
    } catch (e: any) {
      setError(e.message || "Failed to sign");
    } finally {
      setLoading(false);
    }
  };

  const copySignature = () => {
    navigator.clipboard.writeText(signature);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PenLine className="h-5 w-5 text-primary" />
          Sign Message
        </CardTitle>
        <CardDescription>Sign a message with your wallet</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!wallet && (
          <div className="rounded-md bg-muted px-3 py-3 text-sm text-muted-foreground">
            Create a wallet first to sign messages
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Input
            id="message"
            placeholder="Enter message to sign"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!wallet}
            onKeyDown={(e) => e.key === "Enter" && handleSign()}
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button
          onClick={handleSign}
          disabled={!wallet || loading || !message}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing...
            </>
          ) : (
            "Sign Message"
          )}
        </Button>
        {signature && (
          <div className="space-y-1.5 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <Label>Signature</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={copySignature}
                className="h-7 px-2 text-xs"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <code className="block rounded-md bg-muted px-3 py-2 text-xs font-mono break-all">
              {signature}
            </code>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
