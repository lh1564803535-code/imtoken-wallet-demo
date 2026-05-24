/**
 * Heritage Wallet State Management
 *
 * Simulates on-chain Dead Man's Switch contract logic.
 * In production, this would interact with a deployed HeritageWallet.sol contract.
 *
 * Core flow:
 * 1. Owner deposits ETH/ERC-20 into heritage vault
 * 2. Owner adds beneficiaries with share percentages
 * 3. Owner must "check in" periodically (heartbeat)
 * 4. If owner misses check-in deadline, beneficiaries can claim
 * 5. Grace period allows owner to cancel accidental triggers
 */

export interface Beneficiary {
  address: string;
  name: string;
  sharePercent: number; // 1-100
  addedAt: number; // timestamp
}

export interface HeritageVault {
  ownerAddress: string;
  timeoutDays: number; // 30-365
  gracePeriodDays: number; // default 7
  lastCheckIn: number; // timestamp
  beneficiaries: Beneficiary[];
  deposits: HeritageDeposit[];
  status: "active" | "grace_period" | "triggered" | "claimed";
  triggeredAt?: number;
  triggeredBy?: string;
}

export interface HeritageDeposit {
  token: string;
  symbol: string;
  amount: string;
  timestamp: number;
  color: string;
  abbr: string;
}

// In-memory state with localStorage persistence
let vault: HeritageVault | null = null;

function loadVault(): HeritageVault | null {
  try {
    const saved = localStorage.getItem("heritage-vault");
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return null;
}

function saveVault(v: HeritageVault | null) {
  try {
    if (v) localStorage.setItem("heritage-vault", JSON.stringify(v));
    else localStorage.removeItem("heritage-vault");
  } catch { /* ignore */ }
}

export function getVault(): HeritageVault | null {
  if (!vault) vault = loadVault();
  if (!vault) return null;
  // Simulate time-based status updates
  const now = Date.now();
  const deadline = vault.lastCheckIn + vault.timeoutDays * 24 * 60 * 60 * 1000;
  const graceDeadline = deadline + vault.gracePeriodDays * 24 * 60 * 60 * 1000;

  if (vault.status === "active" && now > deadline) {
    vault.status = "grace_period";
  }
  if (vault.status === "grace_period" && now > graceDeadline) {
    vault.status = "triggered";
  }
  return { ...vault };
}

export function createVault(ownerAddress: string, timeoutDays: number = 90): HeritageVault {
  vault = {
    ownerAddress,
    timeoutDays,
    gracePeriodDays: 7,
    lastCheckIn: Date.now(),
    beneficiaries: [],
    deposits: [],
    status: "active",
  };
  saveVault(vault);
  return { ...vault };
}

export function addBeneficiary(name: string, address: string, sharePercent: number): boolean {
  if (!vault) return false;
  // Validate total shares don't exceed 100
  const totalShares = vault.beneficiaries.reduce((s, b) => s + b.sharePercent, 0) + sharePercent;
  if (totalShares > 100) return false;
  // Check no duplicate address
  if (vault.beneficiaries.some(b => b.address.toLowerCase() === address.toLowerCase())) return false;

  vault.beneficiaries.push({ address, name, sharePercent, addedAt: Date.now() });
  saveVault(vault);
  return true;
}

export function removeBeneficiary(address: string): boolean {
  if (!vault) return false;
  const idx = vault.beneficiaries.findIndex(b => b.address.toLowerCase() === address.toLowerCase());
  if (idx === -1) return false;
  vault.beneficiaries.splice(idx, 1);
  saveVault(vault);
  return true;
}

export function deposit(token: string, symbol: string, amount: string, color: string, abbr: string): boolean {
  if (!vault) return false;
  vault.deposits.push({ token, symbol, amount, timestamp: Date.now(), color, abbr });
  saveVault(vault);
  return true;
}

export function checkIn(): boolean {
  if (!vault) return false;
  vault.lastCheckIn = Date.now();
  if (vault.status === "grace_period") {
    vault.status = "active";
    vault.triggeredAt = undefined;
    vault.triggeredBy = undefined;
  }
  saveVault(vault);
  return true;
}

export function triggerSwitch(beneficiaryAddress: string): boolean {
  if (!vault) return false;
  if (vault.status !== "grace_period" && vault.status !== "triggered") return false;
  const isBeneficiary = vault.beneficiaries.some(
    b => b.address.toLowerCase() === beneficiaryAddress.toLowerCase()
  );
  if (!isBeneficiary) return false;

  vault.status = "triggered";
  vault.triggeredAt = Date.now();
  vault.triggeredBy = beneficiaryAddress;
  saveVault(vault);
  return true;
}

export function claimBeneficiary(beneficiaryAddress: string): HeritageDeposit[] | null {
  if (!vault || vault.status !== "triggered") return null;
  const isBeneficiary = vault.beneficiaries.some(
    b => b.address.toLowerCase() === beneficiaryAddress.toLowerCase()
  );
  if (!isBeneficiary) return null;

  const beneficiary = vault.beneficiaries.find(
    b => b.address.toLowerCase() === beneficiaryAddress.toLowerCase()
  )!;
  // Calculate share
  const claimable = vault.deposits.map(d => ({
    ...d,
    amount: (parseFloat(d.amount) * beneficiary.sharePercent / 100).toFixed(6),
  }));
  vault.status = "claimed";
  saveVault(vault);
  return claimable;
}

export function updateTimeout(days: number): boolean {
  if (!vault) return false;
  if (days < 30 || days > 365) return false;
  vault.timeoutDays = days;
  saveVault(vault);
  return true;
}

export function updateGracePeriod(days: number): boolean {
  if (!vault) return false;
  if (days < 1 || days > 30) return false;
  vault.gracePeriodDays = days;
  saveVault(vault);
  return true;
}

export function getTimeRemaining(): { days: number; hours: number; expired: boolean; inGrace: boolean } | null {
  if (!vault) return null;
  const now = Date.now();
  const deadline = vault.lastCheckIn + vault.timeoutDays * 24 * 60 * 60 * 1000;
  const graceDeadline = deadline + vault.gracePeriodDays * 24 * 60 * 60 * 1000;

  if (vault.status === "grace_period") {
    const remaining = graceDeadline - now;
    return {
      days: Math.floor(remaining / (24 * 60 * 60 * 1000)),
      hours: Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)),
      expired: false,
      inGrace: true,
    };
  }
  if (vault.status === "triggered" || vault.status === "claimed") {
    return { days: 0, hours: 0, expired: true, inGrace: false };
  }
  const remaining = deadline - now;
  if (remaining <= 0) return { days: 0, hours: 0, expired: true, inGrace: false };
  return {
    days: Math.floor(remaining / (24 * 60 * 60 * 1000)),
    hours: Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)),
    expired: false,
    inGrace: false,
  };
}

export function getTotalDeposited(): string {
  if (!vault) return "$0.00";
  // Simplified: sum all deposits in USD
  const prices: Record<string, number> = { ETH: 2691, BTC: 100000, TRX: 0.144, USDT: 1, MATIC: 0.85 };
  let total = 0;
  for (const d of vault.deposits) {
    total += parseFloat(d.amount) * (prices[d.symbol] || 1);
  }
  return `$${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function resetVault() {
  vault = null;
  saveVault(null);
}
