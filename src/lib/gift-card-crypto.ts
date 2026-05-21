import type { StoredGiftCard } from "@/types/bitrefill";

const STORAGE_KEY = "imtoken_gift_cards_v1";
const SALT = "imtoken-vault-v1";
const ITERATIONS = 100000;

async function deriveKey(password: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode(SALT),
      iterations: ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptCards(
  cards: StoredGiftCard[],
  password: string
): Promise<string> {
  try {
    const key = await deriveKey(password);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const data = enc.encode(JSON.stringify(cards));
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );
    const result = {
      iv: btoa(String.fromCharCode(...iv)),
      data: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
    };
    return JSON.stringify(result);
  } catch {
    // Fallback: base64 encode (for environments without Web Crypto)
    return btoa(JSON.stringify(cards));
  }
}

export async function decryptCards(
  stored: string,
  password: string
): Promise<StoredGiftCard[]> {
  try {
    const parsed = JSON.parse(stored);
    if (!parsed.iv || !parsed.data) {
      // Fallback: try base64 decode
      return JSON.parse(atob(stored));
    }
    const key = await deriveKey(password);
    const iv = Uint8Array.from(atob(parsed.iv), (c) => c.charCodeAt(0));
    const data = Uint8Array.from(atob(parsed.data), (c) => c.charCodeAt(0));
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );
    const dec = new TextDecoder();
    return JSON.parse(dec.decode(decrypted));
  } catch {
    // If decryption fails, try base64 fallback
    try {
      return JSON.parse(atob(stored));
    } catch {
      return [];
    }
  }
}

export function saveToStorage(encrypted: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, encrypted);
  } catch {
    throw new Error("Storage unavailable or full");
  }
}

export function loadFromStorage(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
