"use client";

import { useState, useEffect, useCallback } from "react";
import type { StoredGiftCard } from "@/types/bitrefill";
import {
  encryptCards,
  decryptCards,
  saveToStorage,
  loadFromStorage,
} from "@/lib/gift-card-crypto";

interface VaultHook {
  cards: StoredGiftCard[];
  loading: boolean;
  error: string;
  addCard: (card: Omit<StoredGiftCard, "id">) => Promise<void>;
  removeCard: (id: string) => Promise<void>;
  exportCards: () => void;
  totalByDenomination: Record<string, number>;
}

export function useGiftCardVault(password: string | undefined): VaultHook {
  const [cards, setCards] = useState<StoredGiftCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load cards on mount
  useEffect(() => {
    if (!password) {
      setCards([]);
      setLoading(false);
      return;
    }
    (async () => {
      setLoading(true);
      setError("");
      try {
        const stored = loadFromStorage();
        if (stored) {
          const decrypted = await decryptCards(stored, password);
          setCards(decrypted.sort((a, b) => 
            new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime()
          ));
        }
      } catch (e: any) {
        setError(e.message || "Failed to load gift cards");
      } finally {
        setLoading(false);
      }
    })();
  }, [password]);

  const persist = useCallback(
    async (updatedCards: StoredGiftCard[]) => {
      if (!password) return;
      try {
        const encrypted = await encryptCards(updatedCards, password);
        saveToStorage(encrypted);
      } catch (e: any) {
        setError(e.message || "Failed to save gift cards");
      }
    },
    [password]
  );

  const addCard = useCallback(
    async (card: Omit<StoredGiftCard, "id">) => {
      const newCard: StoredGiftCard = {
        ...card,
        id: Math.random().toString(36).slice(2) + Date.now().toString(36),
      };
      const updated = [newCard, ...cards];
      setCards(updated);
      await persist(updated);
    },
    [cards, persist]
  );

  const removeCard = useCallback(
    async (id: string) => {
      const updated = cards.filter((c) => c.id !== id);
      setCards(updated);
      await persist(updated);
    },
    [cards, persist]
  );

  const exportCards = useCallback(() => {
    const data = JSON.stringify(cards, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gift-cards-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [cards]);

  const totalByDenomination = cards.reduce<Record<string, number>>((acc, card) => {
    const key = card.currency;
    acc[key] = (acc[key] || 0) + card.denomination;
    return acc;
  }, {});

  return { cards, loading, error, addCard, removeCard, exportCards, totalByDenomination };
}
