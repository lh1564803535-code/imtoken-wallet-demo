import init, {
  create_keystore,
  derive_accounts,
  sign_message as tcx_sign_message,
  export_mnemonic,
} from "@consenlabs/tcx-wasm";

export interface WalletData {
  keystoreJson: string;
  address: string;
  mnemonic: string;
  password: string;
}

let initialized = false;

async function ensureInit() {
  if (!initialized) {
    await init("/tcx_wasm_bg.wasm");
    initialized = true;
  }
}

export async function createWallet(password: string) {
  await ensureInit();
  // Password mode: create native HD keystore with random mnemonic
  const keystoreJson = create_keystore(
    JSON.stringify({ password })
  );
  return { keystoreJson };
}

export async function deriveAddress(
  keystoreJson: string,
  password: string
): Promise<string> {
  await ensureInit();
  const resultStr = derive_accounts(
    JSON.stringify({
      keystoreJson,
      key: password,
      derivations: [
        {
          chain: "ETHEREUM",
          derivationPath: "m/44'/60'/0'/0/0",
          network: "MAINNET",
        },
      ],
    })
  );
  const accounts = JSON.parse(resultStr);
  return accounts[0].address as string;
}

export async function signMessage(
  keystoreJson: string,
  password: string,
  message: string
): Promise<string> {
  await ensureInit();
  const resultStr = tcx_sign_message(
    JSON.stringify({
      keystoreJson,
      key: password,
      chain: "ETHEREUM",
      derivationPath: "m/44'/60'/0'/0/0",
      input: {
        message,
        signatureType: "PersonalSign",
      },
    })
  );
  const result = JSON.parse(resultStr);
  return result.signature as string;
}

export async function getMnemonic(
  keystoreJson: string,
  password: string
): Promise<string> {
  await ensureInit();
  const resultStr = export_mnemonic(
    JSON.stringify({
      keystoreJson,
      key: password,
    })
  );
  const result = JSON.parse(resultStr);
  return result.mnemonic as string;
}

export interface ChainAddress {
  chain: string;
  label: string;
  address: string;
}

export async function deriveMultiChainAddresses(
  keystoreJson: string,
  password: string
): Promise<ChainAddress[]> {
  await ensureInit();

  const derivationConfigs = [
    {
      chain: "ETHEREUM",
      label: "ETH",
      derivationPath: "m/44'/60'/0'/0/0",
      network: "MAINNET",
    },
    {
      chain: "BITCOIN",
      label: "BTC Legacy (P2PKH)",
      derivationPath: "m/44'/0'/0'/0/0",
      network: "MAINNET",
      segWit: "NONE",
    },
    {
      chain: "BITCOIN",
      label: "BTC SegWit (P2WPKH)",
      derivationPath: "m/84'/0'/0'/0/0",
      network: "MAINNET",
      segWit: "VERSION_0",
    },
    {
      chain: "BITCOIN",
      label: "BTC Taproot (P2TR)",
      derivationPath: "m/86'/0'/0'/0/0",
      network: "MAINNET",
      segWit: "VERSION_1",
    },
    {
      chain: "TRON",
      label: "TRON",
      derivationPath: "m/44'/195'/0'/0/0",
      network: "MAINNET",
    },
  ];

  const results: ChainAddress[] = [];

  for (const config of derivationConfigs) {
    try {
      const derivation: Record<string, string> = {
        chain: config.chain,
        derivationPath: config.derivationPath,
        network: config.network,
      };
      if (config.segWit) {
        derivation.segWit = config.segWit;
      }

      const resultStr = derive_accounts(
        JSON.stringify({
          keystoreJson,
          key: password,
          derivations: [derivation],
        })
      );
      const accounts = JSON.parse(resultStr);
      if (accounts[0]?.address) {
        results.push({
          chain: config.chain,
          label: config.label,
          address: accounts[0].address,
        });
      }
    } catch {
      // Skip chains that fail silently
    }
  }

  return results;
}

export async function importWallet(
  mnemonic: string,
  password: string
): Promise<{ keystoreJson: string; address: string }> {
  await ensureInit();
  // Token Core's create_keystore accepts { password, mnemonic } to import existing mnemonic
  const keystoreJson = create_keystore(
    JSON.stringify({ password, mnemonic: mnemonic.trim() })
  );
  const address = await deriveAddress(keystoreJson, password);
  return { keystoreJson, address };
}

export async function signOwnershipProof(
  keystoreJson: string,
  password: string,
  addresses: ChainAddress[]
): Promise<{ message: string; signature: string }> {
  await ensureInit();
  const addressList = addresses
    .map((a) => `- ${a.label}: ${a.address}`)
    .join("\n");
  const timestamp = new Date().toISOString();
  const message = `I hereby prove I control all the following addresses derived from a single mnemonic:\n${addressList}\nTimestamp: ${timestamp}`;

  const resultStr = tcx_sign_message(
    JSON.stringify({
      keystoreJson,
      key: password,
      chain: "ETHEREUM",
      derivationPath: "m/44'/60'/0'/0/0",
      input: {
        message,
        signatureType: "PersonalSign",
      },
    })
  );
  const result = JSON.parse(resultStr);
  return { message, signature: result.signature as string };
}
