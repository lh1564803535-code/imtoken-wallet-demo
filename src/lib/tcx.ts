import init, {
  create_keystore,
  derive_accounts,
  sign_message as tcx_sign_message,
  export_mnemonic,
} from "@consenlabs/tcx-wasm";

export interface Keystore {
  crypto: Record<string, unknown>;
  id: string;
  version: number;
}

export interface WalletData {
  keystore: Keystore;
  address: string;
  mnemonic: string;
  password: string;
}

let initialized = false;

async function ensureInit() {
  if (!initialized) {
    await init();
    initialized = true;
  }
}

export async function createWallet(password: string, strength: 128 | 256 = 128) {
  await ensureInit();
  const result = JSON.parse(
    create_keystore(JSON.stringify({ password, strength }))
  );
  if (result.error) throw new Error(result.error);
  return {
    keystore: result.keystore as Keystore,
    mnemonic: result.mnemonic as string,
  };
}

export async function deriveAddress(keystore: Keystore): Promise<string> {
  await ensureInit();
  const accounts = JSON.parse(
    derive_accounts(JSON.stringify({ keystore, chain: "ETH", index: 0 }))
  );
  if (accounts.error) throw new Error(accounts.error);
  return accounts[0].address as string;
}

export async function signMessage(
  keystore: Keystore,
  password: string,
  address: string,
  message: string
): Promise<string> {
  await ensureInit();
  const result = JSON.parse(
    tcx_sign_message(
      JSON.stringify({ keystore, password, chain: "ETH", address, message })
    )
  );
  if (result.error) throw new Error(result.error);
  return result.signature as string;
}

export async function getMnemonic(keystore: Keystore, password: string): Promise<string> {
  await ensureInit();
  const result = JSON.parse(
    export_mnemonic(JSON.stringify({ keystore, password }))
  );
  if (result.error) throw new Error(result.error);
  return result.mnemonic as string;
}
