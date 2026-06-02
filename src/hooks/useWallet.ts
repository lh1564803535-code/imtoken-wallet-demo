"use client";

import { useState, useCallback } from "react";
import type { WalletData, ChainAddress } from "@/lib/tcx";

interface UseWalletReturn {
  wallet: WalletData | null;
  chainAddresses: ChainAddress[];
  walletName: string;
  shortAddr: string;
  ethAddress: string;
  isLoading: boolean;
  error: string;
  createWallet: (password: string) => Promise<void>;
  importWallet: (mnemonic: string, password: string) => Promise<void>;
  setWalletName: (name: string) => void;
  clearError: () => void;
}

export function useWallet(): UseWalletReturn {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [chainAddresses, setChainAddresses] = useState<ChainAddress[]>([]);
  const [walletName, setWalletName] = useState("My Wallet");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const shortAddr = wallet?.address
    ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`
    : "";

  const ethAddress = chainAddresses.find(a => a.chain === "ETHEREUM")?.address || wallet?.address || "";

  const createWallet = useCallback(async (password: string) => {
    setIsLoading(true);
    setError("");
    try {
      const { createWallet: tcxCreate, deriveAddress, getMnemonic, deriveMultiChainAddresses } = await import("@/lib/tcx");
      const { keystoreJson } = await tcxCreate(password);
      const address = await deriveAddress(keystoreJson, password);
      const mnemonic = await getMnemonic(keystoreJson, password);
      const w: WalletData = { keystoreJson, address, mnemonic, password };
      setWallet(w);
      const addresses = await deriveMultiChainAddresses(keystoreJson, password);
      setChainAddresses(addresses);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create wallet");
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const importWallet = useCallback(async (mnemonic: string, password: string) => {
    setIsLoading(true);
    setError("");
    try {
      const { importWallet: tcxImport, deriveMultiChainAddresses } = await import("@/lib/tcx");
      const { keystoreJson, address } = await tcxImport(mnemonic, password);
      const w: WalletData = { keystoreJson, address, mnemonic: mnemonic.trim(), password };
      setWallet(w);
      setWalletName("Imported Wallet");
      const addresses = await deriveMultiChainAddresses(keystoreJson, password);
      setChainAddresses(addresses);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to import wallet");
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(""), []);

  return {
    wallet, chainAddresses, walletName, shortAddr, ethAddress,
    isLoading, error, createWallet, importWallet, setWalletName, clearError,
  };
}
