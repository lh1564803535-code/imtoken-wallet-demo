# Technical Design Document — Bitrefill Integration

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         page.tsx (State Hub)                      │
│  wallet: WalletData | null    activeTab    giftCards[]            │
├─────────────────────────────────────────────────────────────────┤
│  AIIntent (extended)  │  Tabs: Create│Import│Sign│Security│Shop  │
├───────────────────────┼─────────────────────────────────────────┤
│  parseIntent()        │              ShopTab                     │
│  + parsePurchaseIntent│   ┌──────────────────────────────┐      │
│                       │   │ BalanceDashboard              │      │
│                       │   │ GiftCardShop (catalog+filter) │      │
│                       │   │ GiftCardVault (my cards)      │      │
│                       │   └──────────────────────────────┘      │
├───────────────────────┴─────────────────────────────────────────┤
│                        Shared Services                           │
│  bitrefill-api.ts (mock)  │  gift-card-crypto.ts  │  tcx.ts     │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Catalog Browsing**: ShopTab → `bitrefill-api.ts` (mock data) → ProductCard[] → user clicks → ProductDetail
2. **AI Purchase**: AIIntent → `parsePurchaseIntent()` → search mock catalog → show results → PaymentConfirm modal → `signTransaction()` → simulate success → store in vault
3. **Vault**: `useGiftCardVault` hook → localStorage (AES encrypted) → GiftCardVault component
4. **Balance**: BalanceDashboard reads wallet addresses + vault totals

## 2. File Structure

```
src/
├── components/
│   ├── bitrefill/
│   │   ├── ShopTab.tsx              # Main shop container (catalog + vault toggle)
│   │   ├── GiftCardShop.tsx         # Product grid with filters
│   │   ├── ProductCard.tsx          # Single product card
│   │   ├── ProductDetail.tsx        # Product detail + buy button
│   │   ├── PaymentConfirm.tsx       # Modal: confirm payment details
│   │   ├── PaymentResult.tsx        # Success state with gift card code
│   │   ├── GiftCardVault.tsx        # My purchased cards list
│   │   ├── BalanceDashboard.tsx     # Crypto + gift card balance overview
│   │   └── BitrefillIntent.tsx      # Purchase intent parsing (imported by ai-intent)
│   └── ...existing components unchanged
├── lib/
│   ├── bitrefill-api.ts             # API client (mock mode for demo)
│   ├── bitrefill-mock-data.ts       # Static mock product catalog
│   ├── gift-card-crypto.ts          # AES encrypt/decrypt for vault
│   └── ...existing libs unchanged
├── hooks/
│   ├── useBitrefill.ts              # React hook wrapping API client
│   └── useGiftCardVault.ts          # React hook for vault CRUD
└── types/
    └── bitrefill.ts                 # All Bitrefill type definitions
```

## 3. Type Definitions (`src/types/bitrefill.ts`)

```typescript
// Product from Bitrefill catalog
export interface BitrefillProduct {
  id: string;
  name: string;
  description: string;
  country: string;
  category: BitrefillCategory;
  currency: string;              // e.g. "USD", "CNY"
  denominations: number[];       // fixed amounts, e.g. [10, 25, 50, 100]
  range?: { min: number; max: number; step: number }; // flexible range
  supportedCrypto: string[];     // e.g. ["ETH", "BTC", "USDT"]
  discount?: number;             // e.g. 0.03 = 3% off
  imageUrl?: string;
  inStock: boolean;
}

export type BitrefillCategory =
  | "food"
  | "e-commerce"
  | "gaming"
  | "phone-topup"
  | "entertainment"
  | "travel"
  | "other";

// Invoice created for payment
export interface BitrefillInvoice {
  id: string;
  productId: string;
  productName: string;
  denomination: number;
  currency: string;
  payment: {
    address: string;             // crypto address to pay
    amount: string;              // crypto amount (e.g. "0.015")
    chain: string;               // "ETHEREUM" | "BITCOIN" | "TRON"
    symbol: string;              // "ETH" | "BTC" | "TRX"
  };
  status: "pending" | "paid" | "complete" | "failed";
  createdAt: string;
}

// Stored gift card in vault
export interface StoredGiftCard {
  id: string;
  productName: string;
  denomination: number;
  currency: string;
  code: string;                  // the gift card redemption code
  pin?: string;
  chain: string;                 // which chain was used to pay
  txSignature: string;           // the signed tx (proof of payment intent)
  purchasedAt: string;           // ISO timestamp
}

// Purchase intent parsed from natural language
export interface PurchaseIntent {
  productType: string;           // e.g. "amazon", "steam", "phone"
  denomination?: number;         // e.g. 50
  currency?: string;             // e.g. "USD", "CNY"
  raw: string;                   // original user input
}

// API client response wrapper
export interface BitrefillResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    type: "network" | "timeout" | "api" | "config";
    status?: number;
    message: string;
  };
}

// Filter state for catalog
export interface CatalogFilters {
  country: string;
  category: BitrefillCategory | "all";
  search: string;
}
```

## 4. Bitrefill API Client (`src/lib/bitrefill-api.ts`)

### Design Decision: Mock-First for Demo

Since this is a hackathon demo and Bitrefill API requires a real API key + has CORS restrictions for browser-direct calls, the API client will operate in **mock mode** by default. It uses realistic static data that mirrors the real API response structure.

```typescript
// Strategy:
// 1. Check for NEXT_PUBLIC_BITREFILL_API_KEY env var
// 2. If present → attempt real API calls (via Next.js API route proxy if needed)
// 3. If absent → use mock data from bitrefill-mock-data.ts
// 4. All functions return BitrefillResponse<T> for consistent error handling

const API_KEY = process.env.NEXT_PUBLIC_BITREFILL_API_KEY;
const USE_MOCK = !API_KEY;
const TIMEOUT_MS = 15_000;

export async function getProducts(filters: CatalogFilters): Promise<BitrefillResponse<BitrefillProduct[]>>
export async function getProductById(id: string): Promise<BitrefillResponse<BitrefillProduct>>
export async function createInvoice(productId: string, denomination: number, chain: string): Promise<BitrefillResponse<BitrefillInvoice>>
export async function getInvoiceStatus(invoiceId: string): Promise<BitrefillResponse<BitrefillInvoice>>
```

### Mock Data (`src/lib/bitrefill-mock-data.ts`)

Contains ~20 realistic products across categories:
- China: 京东 (JD), 美团 (Meituan), 网易云音乐, 中国移动话费, Steam CN
- Global: Amazon US, Steam US, Uber, Netflix, Spotify, Google Play
- Each with realistic denominations, crypto support, and discount info

### Invoice Simulation

When `createInvoice` is called in mock mode:
1. Generate a random invoice ID
2. Generate a realistic-looking payment address (based on selected chain)
3. Calculate crypto amount using a hardcoded exchange rate (e.g., 1 ETH = $3,500)
4. Return invoice with status "pending"

## 5. AI Intent Extension

### Approach

Extend the existing `parseIntent()` function in `ai-intent.tsx` to detect purchase intents. The purchase intent parser is extracted to a separate file for maintainability.

### `src/components/bitrefill/BitrefillIntent.ts`

```typescript
// Pattern matching for purchase intents
const PURCHASE_PATTERNS = [
  /(?:buy|purchase|get|want)\s+(?:a\s+)?(?:\$?(\d+))\s*(?:dollar|usd|美元|元|rmb|cny)?\s*(.+?)(?:\s+card|\s+gift\s*card)?$/i,
  /(?:充值|买|购买)\s*(\d+)\s*(?:元|美元|块)?\s*(.+?)(?:卡|充值卡|礼品卡)?$/i,
  /(?:帮我|我想|我要)\s*(?:买|购买|充值)\s*(?:\$?(\d+))?\s*(?:元|美元|块)?\s*(.+)/i,
];

export function parsePurchaseIntent(input: string): PurchaseIntent | null
export function searchProducts(intent: PurchaseIntent, catalog: BitrefillProduct[]): BitrefillProduct[]
```

### Integration with existing `ai-intent.tsx`

```typescript
// In parseIntent(), add before the fallback:
const purchaseIntent = parsePurchaseIntent(lower);
if (purchaseIntent) {
  return {
    type: "navigate",
    message: `Found a purchase intent: ${purchaseIntent.productType} $${purchaseIntent.denomination}`,
    action: "purchase",
    payload: JSON.stringify(purchaseIntent),
  };
}
```

The `onAction("purchase", payload)` callback in page.tsx will:
1. Switch to Shop tab
2. Pass the intent to ShopTab which triggers the purchase flow

## 6. Payment Flow Engine

### Sequence

```
User confirms purchase
    │
    ▼
PaymentConfirm.tsx (modal)
    │ shows: product, amount, chain, address
    │
    ▼ [User clicks "Confirm & Sign"]
    │
    ▼
signTransaction(keystoreJson, password, {
  to: invoice.payment.address,
  amount: invoice.payment.amount,
  gasLimit: "21000",
  chainId: 1
})
    │
    ▼ [Returns signed raw tx]
    │
    ▼
Simulate 2s delay (mock webhook)
    │
    ▼
Generate mock gift card code
    │
    ▼
Store in GiftCardVault
    │
    ▼
Show PaymentResult with code + copy button
```

### Key Design Decisions

- **Chain selection**: Default to Ethereum (chainId 1). User can switch to other chains in the confirmation modal. For BTC/TRON, we show the signed tx but note that the signing format differs.
- **No broadcast**: The signed transaction is displayed but never sent to any network.
- **Mock webhook**: After signing, wait 2 seconds, then transition to "complete" status with a generated gift card code.
- **Gift card code generation**: Random alphanumeric string formatted like real codes (e.g., `XXXX-XXXX-XXXX-XXXX`).

## 7. Gift Card Vault (`src/hooks/useGiftCardVault.ts`)

### Encryption Design

```typescript
// Uses Web Crypto API (SubtleCrypto) for AES-GCM encryption
// Key derivation: PBKDF2 from wallet password (same password used for keystore)
// Storage key: "imtoken_gift_cards_v1"

interface VaultHook {
  cards: StoredGiftCard[];
  loading: boolean;
  error: string;
  addCard(card: Omit<StoredGiftCard, "id">): void;
  removeCard(id: string): void;
  exportCards(): void;  // triggers JSON download
}
```

### Storage Format in localStorage

```json
{
  "iv": "<base64 IV>",
  "data": "<base64 AES-GCM encrypted JSON array>"
}
```

### Key Derivation

- Input: wallet password (from `wallet.password`)
- Salt: fixed app-specific salt `"imtoken-vault-v1"`
- Algorithm: PBKDF2, 100k iterations, SHA-256
- Output: 256-bit AES-GCM key

### Fallback

If Web Crypto is unavailable (unlikely in modern browsers), fall back to base64 encoding with a console warning. This is acceptable for a demo.

## 8. Balance Dashboard (`src/components/bitrefill/BalanceDashboard.tsx`)

### Design

Since this is a demo without real blockchain RPC connections, the balance dashboard shows:

1. **Crypto section**: Lists all derived chain addresses with placeholder balances (e.g., "0.00 ETH", "0.00 BTC"). In a real app, these would come from RPC calls.
2. **Gift card section**: Sum of all vault card denominations, grouped by currency.

```
┌─────────────────────────────────────────┐
│  💰 Your Spending Power                 │
├─────────────────────────────────────────┤
│  Crypto Assets          Gift Cards      │
│  ⟠ 0.00 ETH            $150 USD        │
│  ₿ 0.00 BTC            ¥200 CNY        │
│  ◎ 0.00 TRX                            │
│                                         │
│  Total: ~$0.00          Total: $350     │
└─────────────────────────────────────────┘
```

For the demo, we show "Demo Mode — connect to mainnet for real balances" for the crypto section.

## 9. Shop Tab Integration

### page.tsx Changes

```typescript
// Add 5th tab
<TabsList className="grid w-full grid-cols-5 mb-6 shadow-sm rounded-full">
  {/* ...existing 4 tabs... */}
  <TabsTrigger value="shop" className="gap-1.5 rounded-full">
    <ShoppingBag className="h-4 w-4" />
    <span className="hidden sm:inline">Shop</span>
  </TabsTrigger>
</TabsList>

// Add tab content
<TabsContent value="shop">
  <ShopTab wallet={wallet} />
</TabsContent>
```

### ShopTab Internal Structure

```typescript
// ShopTab.tsx manages sub-views:
type ShopView = "catalog" | "vault" | "detail" | "payment" | "result";

function ShopTab({ wallet }: { wallet: WalletData | null }) {
  const [view, setView] = useState<ShopView>("catalog");
  const [selectedProduct, setSelectedProduct] = useState<BitrefillProduct | null>(null);
  const [invoice, setInvoice] = useState<BitrefillInvoice | null>(null);
  // ...
}
```

Sub-view navigation:
- `catalog` → GiftCardShop (grid + filters) + BalanceDashboard at top
- `vault` → GiftCardVault (my cards)
- `detail` → ProductDetail (selected product + denomination picker)
- `payment` → PaymentConfirm (modal overlay)
- `result` → PaymentResult (success + code)

Toggle between catalog and vault via a segmented control at the top.

## 10. AI Intent Integration Points

### Extended Suggestions

Add purchase-related suggestions to the AI assistant:
```typescript
const SUGGESTIONS = [
  // ...existing suggestions
  "Buy $50 Amazon gift card",
  "充值 100 元话费",
  "Show my gift cards",
];
```

### New Actions

| Action | Behavior |
|--------|----------|
| `"purchase"` | Switch to Shop tab, trigger purchase flow with parsed intent |
| `"show-vault"` | Switch to Shop tab, show vault view |
| `"show-shop"` | Switch to Shop tab, show catalog |

## 11. Environment Variables

```env
# Optional — if not set, mock mode is used
NEXT_PUBLIC_BITREFILL_API_KEY=your_api_key_here
```

No `.env` file is committed. The demo works without any API key by using mock data.

## 12. Dependencies

**No new dependencies required.** The implementation uses:
- Web Crypto API (built into browsers) for AES encryption
- Existing `ethers` package (already installed) — not needed for this feature
- Existing UI components (shadcn/ui, lucide-react, Tailwind)
- Existing `@consenlabs/tcx-wasm` for signing

## 13. Component Styling Conventions

All new components follow the existing design system:
- Cards: `rounded-xl ring-1 ring-[#111d4a]/10 bg-white p-6` + box-shadow
- Buttons: `rounded-full bg-[#007fff]` with underglow
- Text: `text-[#111d4a]` (primary), `text-[#99a1af]` (secondary)
- Loading: `<Loader2 className="h-4 w-4 animate-spin" />`
- Copy feedback: Check icon for 1.5s then revert
- Animations: `animate-fade-in-up` for new content

## 14. Risks and Mitigations

| Risk | Mitigation |
|------|-----------|
| Bitrefill API CORS blocks browser calls | Mock mode by default; real mode would need Next.js API route proxy |
| Web Crypto API not available | Fallback to base64 encoding with warning |
| Large mock data increases bundle | Lazy-load mock data only when Shop tab is opened |
| Tab bar overflow on mobile with 5 tabs | Use icon-only on mobile (existing pattern), text on sm+ |
| AI intent conflicts with existing commands | Purchase patterns are checked AFTER existing patterns |
