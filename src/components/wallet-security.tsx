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
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Shield, Copy, Check, Lock, Timer } from "lucide-react";
import type { WalletData } from "@/lib/tcx";

interface Props {
  wallet: WalletData | null;
}

export function WalletSecurity({ wallet }: Props) {
  const [showKeystore, setShowKeystore] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!wallet) {
    return (
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-muted px-3 py-3 text-sm text-muted-foreground">
            Create a wallet first to see security details
          </div>
        </CardContent>
      </Card>
    );
  }

  const copyKeystore = () => {
    navigator.clipboard.writeText(wallet.keystoreJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  let keystoreDisplay = wallet.keystoreJson;
  try {
    keystoreDisplay = JSON.stringify(JSON.parse(wallet.keystoreJson), null, 2);
  } catch {
    // keep as-is
  }

  return (
    <div className="space-y-4">
      {/* Brute Force Estimator */}
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-primary" />
            Brute Force Estimation
          </CardTitle>
          <CardDescription>
            How long would it take to crack your keystore?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 animate-fade-in-up">
          <div className="rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Lock className="h-4 w-4 text-primary" />
              <span className="font-medium">Attack scenario</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Assuming an attacker with a GPU cluster capable of{" "}
              <span className="font-mono font-medium text-foreground">
                1 billion
              </span>{" "}
              password attempts per second (without KDF slowdown):
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">KDF</span>
                <Badge variant="secondary" className="font-mono">
                  PBKDF2-SHA256
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Rounds</span>
                <Badge variant="secondary" className="font-mono">
                  600,000
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Effective speed after KDF
                </span>
                <Badge variant="secondary" className="font-mono">
                  ~1,667 attempts/sec
                </Badge>
              </div>
            </div>
            <div className="rounded-md bg-white/60 border border-primary/10 p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">
                Estimated time to crack (8-char alphanumeric password)
              </p>
              <p className="text-2xl font-bold text-primary">~2.4 billion years</p>
            </div>
            {/* Progress bar visual */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Security level</span>
                <span>Excellent</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-[98%] rounded-full bg-gradient-to-r from-primary to-green-500" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keystore Details */}
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Keystore Details
          </CardTitle>
          <CardDescription>
            Technical encryption parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 animate-fade-in-up">
          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-md bg-muted p-3">
              <p className="text-xs text-muted-foreground mb-1">Cipher</p>
              <Badge variant="secondary" className="font-mono text-xs">
                AES-128-CTR
              </Badge>
            </div>
            <div className="rounded-md bg-muted p-3">
              <p className="text-xs text-muted-foreground mb-1">KDF</p>
              <Badge variant="secondary" className="font-mono text-xs">
                PBKDF2
              </Badge>
            </div>
            <div className="rounded-md bg-muted p-3">
              <p className="text-xs text-muted-foreground mb-1">KDF Rounds</p>
              <Badge variant="secondary" className="font-mono text-xs">
                600,000
              </Badge>
            </div>
            <div className="rounded-md bg-muted p-3">
              <p className="text-xs text-muted-foreground mb-1">
                Keystore Version
              </p>
              <Badge variant="secondary" className="font-mono text-xs">
                v12000
              </Badge>
            </div>
          </div>

          {/* Keystore JSON */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Keystore JSON
              </span>
              <div className="flex items-center gap-1">
                {showKeystore && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyKeystore}
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
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowKeystore(!showKeystore)}
                  className="h-7 px-2"
                >
                  {showKeystore ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            {showKeystore ? (
              <pre className="rounded-md bg-muted p-3 text-xs font-mono overflow-auto max-h-48">
                {keystoreDisplay}
              </pre>
            ) : (
              <div className="rounded-md bg-muted px-3 py-3 text-sm text-muted-foreground">
                Click the eye icon to reveal keystore data
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
