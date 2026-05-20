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
import { PenLine, Copy } from "lucide-react";
import type { WalletData } from "@/lib/tcx";

interface Props {
  wallet: WalletData | null;
}

export function SignMessage({ wallet }: Props) {
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PenLine className="h-5 w-5" />
          Sign Message
        </CardTitle>
        <CardDescription>Sign a message with your wallet</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Input
            id="message"
            placeholder="Enter message to sign"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!wallet}
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button
          onClick={handleSign}
          disabled={!wallet || loading || !message}
          className="w-full"
        >
          {loading ? "Signing..." : "Sign Message"}
        </Button>
        {signature && (
          <div className="space-y-1">
            <Label>Signature</Label>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded bg-muted px-2 py-2 text-xs font-mono break-all">
                {signature}
              </code>
              <Button variant="outline" size="icon" onClick={copySignature}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
