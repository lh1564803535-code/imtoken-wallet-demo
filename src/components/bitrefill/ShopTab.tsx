"use client";

import { useState, useCallback } from "react";
import { ShoppingBag, CreditCard } from "lucide-react";
import { GiftCardShop } from "./GiftCardShop";
import { ProductDetail } from "./ProductDetail";
import { PaymentConfirm } from "./PaymentConfirm";
import { PaymentResult } from "./PaymentResult";
import { GiftCardVault } from "./GiftCardVault";
import { BalanceDashboard } from "./BalanceDashboard";
import { useBitrefill } from "@/hooks/useBitrefill";
import { useGiftCardVault } from "@/hooks/useGiftCardVault";
import type { WalletData, ChainAddress } from "@/lib/tcx";
import type { BitrefillProduct, BitrefillInvoice, CatalogFilters } from "@/types/bitrefill";

type ShopView = "catalog" | "vault" | "detail" | "result";

interface Props {
  wallet: WalletData | null;
  addresses: ChainAddress[];
}

export function ShopTab({ wallet, addresses }: Props) {
  const [view, setView] = useState<ShopView>("catalog");
  const [selectedProduct, setSelectedProduct] = useState<BitrefillProduct | null>(null);
  const [invoice, setInvoice] = useState<BitrefillInvoice | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [signing, setSigning] = useState(false);
  const [signError, setSignError] = useState("");
  const [resultData, setResultData] = useState<{
    productName: string;
    denomination: number;
    currency: string;
    code: string;
    txSignature: string;
  } | null>(null);

  const { products, loading, error, fetchProducts, makeInvoice, completePayment } = useBitrefill();
  const vault = useGiftCardVault(wallet?.password);

  const handleFetch = useCallback((filters: CatalogFilters) => {
    fetchProducts(filters);
  }, [fetchProducts]);

  const handleSelectProduct = (product: BitrefillProduct) => {
    setSelectedProduct(product);
    setView("detail");
  };

  const handleBuy = async (denomination: number, chain: string) => {
    if (!wallet || !selectedProduct) return;
    setSignError("");
    try {
      const inv = await makeInvoice(selectedProduct.id, denomination, chain);
      if (inv) {
        setInvoice(inv);
        setShowPaymentModal(true);
      }
    } catch (e: any) {
      setSignError(e.message || "Failed to create invoice");
    }
  };

  const handleConfirmPayment = async () => {
    if (!wallet || !invoice) return;
    setSigning(true);
    setSignError("");
    try {
      const { signTransaction } = await import("@/lib/tcx");
      const txSig = await signTransaction(wallet.keystoreJson, wallet.password, {
        to: invoice.payment.address,
        amount: invoice.payment.amount,
        gasLimit: "21000",
        chainId: 1,
      });

      // Simulate payment success
      const { code } = await completePayment(invoice);

      // Store in vault
      await vault.addCard({
        productName: invoice.productName,
        denomination: invoice.denomination,
        currency: invoice.currency,
        code,
        chain: invoice.payment.chain,
        txSignature: txSig,
        purchasedAt: new Date().toISOString(),
      });

      setResultData({
        productName: invoice.productName,
        denomination: invoice.denomination,
        currency: invoice.currency,
        code,
        txSignature: txSig,
      });

      setShowPaymentModal(false);
      setView("result");
    } catch (e: any) {
      setSignError(e.message || "Transaction signing failed");
    } finally {
      setSigning(false);
    }
  };

  const handleCancelPayment = () => {
    setShowPaymentModal(false);
    setInvoice(null);
    setSignError("");
  };

  const handleResultDone = () => {
    setResultData(null);
    setView("vault");
  };

  return (
    <div className="space-y-4">
      {/* Balance Dashboard */}
      <BalanceDashboard addresses={addresses} giftCardTotals={vault.totalByDenomination} />

      {/* View toggle */}
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => { setView("catalog"); setSelectedProduct(null); }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all ${
            view === "catalog" || view === "detail"
              ? "bg-[#007fff] text-white"
              : "bg-[#f8f9fa] text-[#111d4a] ring-1 ring-[#111d4a]/10 hover:ring-[#007fff]/30"
          }`}
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          Catalog
        </button>
        <button
          onClick={() => setView("vault")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all ${
            view === "vault"
              ? "bg-[#007fff] text-white"
              : "bg-[#f8f9fa] text-[#111d4a] ring-1 ring-[#111d4a]/10 hover:ring-[#007fff]/30"
          }`}
        >
          <CreditCard className="h-3.5 w-3.5" />
          My Cards ({vault.cards.length})
        </button>
      </div>

      {/* Views */}
      {view === "catalog" && (
        <GiftCardShop
          products={products}
          loading={loading}
          error={error}
          onFetch={handleFetch}
          onSelectProduct={handleSelectProduct}
        />
      )}

      {view === "detail" && selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onBack={() => setView("catalog")}
          onBuy={handleBuy}
          disabled={!wallet}
        />
      )}

      {view === "vault" && (
        <GiftCardVault
          cards={vault.cards}
          totalByDenomination={vault.totalByDenomination}
          onDelete={vault.removeCard}
          onExport={vault.exportCards}
        />
      )}

      {view === "result" && resultData && (
        <PaymentResult
          productName={resultData.productName}
          denomination={resultData.denomination}
          currency={resultData.currency}
          code={resultData.code}
          txSignature={resultData.txSignature}
          onDone={handleResultDone}
        />
      )}

      {/* Payment Confirmation Modal */}
      {showPaymentModal && invoice && (
        <PaymentConfirm
          invoice={invoice}
          onConfirm={handleConfirmPayment}
          onCancel={handleCancelPayment}
          signing={signing}
          error={signError}
        />
      )}

      {/* No wallet prompt */}
      {!wallet && view !== "vault" && (
        <div className="rounded-xl bg-[#f0f7ff] ring-1 ring-[#007fff]/10 p-4 text-center">
          <p className="text-xs text-[#007fff]">
            Create or import a wallet first to purchase gift cards
          </p>
        </div>
      )}
    </div>
  );
}
