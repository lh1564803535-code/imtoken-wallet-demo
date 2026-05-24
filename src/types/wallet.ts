/** Shared types for the wallet app */

export type PageState =
  | "welcome"
  | "password"
  | "creating"
  | "mnemonic"
  | "verify"
  | "name"
  | "import"
  | "app";

export type TabId = "home" | "discover" | "activity" | "profile";

export type SubPage =
  | "heritage" | "create" | "import" | "sign" | "security"
  | "shop" | "ai" | "send" | "receive" | "swap" | "activity"
  | "token" | "nfts" | "network" | "txDetail" | "settings"
  | "dapps" | "watch" | null;

export interface TokenData {
  symbol: string;
  name: string;
  balance: string;
  value: string;
  change: string;
  up: boolean;
  color: string;
  abbr: string;
  price?: string;
}

export interface Transaction {
  type: "Send" | "Receive" | "Swap";
  token: string;
  amount: string;
  usd?: string;
  time: string;
  hash?: string;
  color: string;
  iconColor: string;
}

export interface TransactionGroup {
  label: string;
  txs: Transaction[];
}
