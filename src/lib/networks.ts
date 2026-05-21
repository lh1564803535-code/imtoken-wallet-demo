export interface NetworkConfig {
  name: string;
  chainId: number;
  symbol: string;
  rpc: string;
}

export const NETWORKS: NetworkConfig[] = [
  {
    name: "Ethereum Mainnet",
    chainId: 1,
    symbol: "ETH",
    rpc: "https://eth.llamarpc.com",
  },
  {
    name: "Ethereum Sepolia",
    chainId: 11155111,
    symbol: "ETH",
    rpc: "https://rpc.sepolia.org",
  },
];

export function getNetwork(chainId: number): NetworkConfig | undefined {
  return NETWORKS.find((n) => n.chainId === chainId);
}
