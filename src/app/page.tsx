"use client";

import { useState } from "react";
import { CreateWallet } from "@/components/create-wallet";
import { SignMessage } from "@/components/sign-message";
import { WalletInfo } from "@/components/wallet-info";
import type { WalletData } from "@/lib/tcx";

export default function Home() {
  const [wallet, setWallet] = useState<WalletData | null>(null);

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">imToken Wallet Demo</h1>
          <p className="text-muted-foreground">
            Token Core (tcx-wasm) browser wallet
          </p>
        </div>
        <CreateWallet onWalletCreated={setWallet} wallet={wallet} />
        <SignMessage wallet={wallet} />
        <WalletInfo wallet={wallet} />
      </div>
    </main>
  );
}
