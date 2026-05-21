"use client";

import { useAccount, useDisconnect, useChainId } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Link2, Unlink } from "lucide-react";
import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function WalletProfile() {
  const { address, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const [copied, setCopied] = useState(false);

  const chainName =
    chainId === baseSepolia.id ? "Base Sepolia" : `Chain ${chainId}`;

  const truncateAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  if (!isConnected) {
    return (
      <div className="rounded-xl ring-1 ring-[#111d4a]/10 bg-white p-6" style={{ boxShadow: "0 2px 8px 0 color-mix(in srgb, #111d4a 4%, transparent)" }}>
        <div className="flex items-center gap-2 mb-1">
          <Link2 className="h-5 w-5 text-[#007fff]" />
          <h3 className="text-base font-semibold text-[#111d4a]">
            Connect External Wallet
          </h3>
        </div>
        <p className="text-sm text-[#99a1af] mb-5">
          Connect your external wallet to interact with DApps on Base Sepolia
        </p>
        <div className="rounded-xl bg-[#f8f9fa] ring-1 ring-[#111d4a]/10 px-3 py-3 text-sm text-[#99a1af] mb-4">
          Connect an external wallet to interact with Base Sepolia testnet.
          This demonstrates Token Core alongside Web3 wallet integration.
        </div>
        <div className="flex justify-center">
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl ring-1 ring-[#111d4a]/10 bg-white p-6" style={{ boxShadow: "0 2px 8px 0 color-mix(in srgb, #111d4a 4%, transparent)" }}>
      <div className="flex items-center gap-2 mb-1">
        <Link2 className="h-5 w-5 text-[#007fff]" />
        <h3 className="text-base font-semibold text-[#111d4a]">
          Connected Wallet
        </h3>
      </div>
      <p className="text-sm text-[#99a1af] mb-5">
        External wallet via {connector?.name}
      </p>

      <div className="space-y-4 animate-fade-in-up">
        {/* Connection Status */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-[#f8f9fa] ring-1 ring-[#111d4a]/10">
          <div className="w-10 h-10 rounded-full identity-gradient flex items-center justify-center flex-shrink-0">
            <span className="text-white text-lg">✓</span>
          </div>
          <div>
            <p className="text-sm font-medium text-[#111d4a]">
              Wallet connected
            </p>
            <p className="text-xs text-[#99a1af] mt-0.5">
              Ready to interact with {chainName}
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-[#f8f9fa] ring-1 ring-[#111d4a]/10 p-3">
            <p className="text-xs text-[#99a1af] mb-1">Network</p>
            <Badge variant="secondary" className="font-mono text-xs rounded-full">
              {chainName}
            </Badge>
          </div>
          <div className="rounded-xl bg-[#f8f9fa] ring-1 ring-[#111d4a]/10 p-3">
            <p className="text-xs text-[#99a1af] mb-1">Connector</p>
            <Badge variant="secondary" className="text-xs rounded-full">
              {connector?.name || "Unknown"}
            </Badge>
          </div>
        </div>

        {/* Address */}
        <div className="space-y-1.5">
          <span className="text-sm text-[#99a1af]">Address</span>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded-xl bg-[#f8f9fa] ring-1 ring-[#111d4a]/10 px-3 py-2 text-sm font-mono text-[#111d4a]">
              {truncateAddress(address!)}
            </code>
            <button
              onClick={copyAddress}
              className="p-2 rounded-full hover:bg-[#f0f2f5] transition-colors"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4 text-[#99a1af]" />
              )}
            </button>
          </div>
        </div>

        {/* Disconnect */}
        <button
          onClick={() => disconnect()}
          className="w-full py-2.5 rounded-full ring-1 ring-[#e0e3e8] text-sm font-medium text-[#111d4a] hover:bg-[#f0f2f5] transition-colors flex items-center justify-center gap-2"
        >
          <Unlink className="h-4 w-4" />
          Disconnect
        </button>
      </div>
    </div>
  );
}
