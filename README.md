# imToken 10th Anniversary 鈥?AI Crypto Spending Wallet

> One mnemonic, five chains, AI-powered gift card shopping 鈥?with Bitrefill e-commerce integration and local signing.

馃弮 **Live Demo**: https://imtoken-wallet-demo.vercel.app  
馃幀 **Video**: Coming soon

---

## 馃弳 Hackathon Info

- **Event**: imToken 10th Anniversary AI Co-Creation Hackathon
- **Track**: Bitrefill Special (Make your wallet an e-commerce assistant)
- **Awards targeted**: Best AI Wallet + Bitrefill Special Award + Best User Control
- **Core narrative**: From "holding" to "spending" 鈥?AI intent drives crypto commerce

---

## 鉁?Key Features

### 1. Bitrefill E-Commerce Integration
- 29 gift card products (Amazon, Steam, Netflix, Uber, Spotify, PlayStation, Xbox...)
- 11 eSIM products for travel (Japan, Thailand, Korea, Europe, USA, Singapore, Global...)
- AI-powered product search and recommendations
- Encrypted gift card vault with PIN protection

### 2. AI Wallet Assistant (E-Commerce Focus)
- Natural language intent: "Buy $50 Amazon gift card" 鈫?search 鈫?preview 鈫?purchase
- Travel intent: "I'm going to Japan" 鈫?recommend local eSIM + gift cards
- Smart fallback: contextual suggestions instead of "I don't understand"
- Loading animation for better UX

### 3. Real Token Core Integration
Not mock 鈥?real `@consenlabs/tcx-wasm` calls:
- Create wallet, derive 5-chain addresses (ETH, BTC, TRON, etc.)
- Sign messages (PersonalSign)
- Sign transactions with network selection
- Cross-chain ownership proof with ecrecover verification

### 4. Anti-Blind-Sign Security
- Payment confirmation with risk warning
- User must check "I understand this transaction" before signing
- Full transaction details displayed before confirmation
- Pure frontend 鈥?no server involved in signing

### 5. Complete Purchase Flow
Browse Bitrefill catalog 鈫?AI product selection 鈫?sign payment 鈫?get gift card code 鈫?AES-encrypted vault storage 鈫?balance dashboard

---

## 馃搨 Tech Stack

- **Framework**: Next.js 16 + React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Wallet**: @consenlabs/tcx-wasm (Token Core)
- **Crypto**: ethers.js for Sepolia RPC
- **E-Commerce**: Bitrefill API v2 (mock mode for demo stability)
- **Security**: Web Crypto API (AES-GCM) for gift card encryption
- **Deployment**: Vercel (static, zero SSR)

---

## 馃摳 Architecture

```
src/
app/
  page.tsx            # Main page (Hero + 5 Tabs + state hub)
  api/bitrefill/      # Edge Function proxy for Bitrefill API
components/
  ai-intent.tsx       # AI Assistant (intent parsing + product search)
  create-wallet.tsx   # Wallet creation + 5-chain derivation
  import-wallet.tsx   # Mnemonic import
  sign-message.tsx    # Message + transaction signing
  wallet-security.tsx # Keystore security panel
  bitrefill/
    ShopTab.tsx       # Shop container (3 views: store/catalog/vault)
    GiftCardShop.tsx  # Product catalog with filters
    PaymentConfirm.tsx # Anti-blind-sign payment confirmation
    PaymentResult.tsx # Success page with confetti
    GiftCardVault.tsx # Encrypted gift card management
    BitrefillIntent.ts # Purchase intent regex parser
lib/
  tcx.ts              # Token Core WASM wrapper
  bitrefill-api.ts    # Bitrefill API (mock mode)
  gift-card-crypto.ts # AES-GCM encryption
  networks.ts         # Network configuration
```

---

## 鉂?Security Model

- 鉁?Keys generated locally via WASM (PBKDF2 脳 600k rounds)
- 鉁?No server involved in signing
- 鉁?Zero-trust architecture (all sensitive ops in browser)
- 鉁?AES-GCM encryption for stored gift card codes
- 鉁?Anti-blind-sign warning before payment
- 鉁?Open source and auditable

---

## 馃搫 Deploy

```bash
npm run build
echo y | npx vercel --prod --yes
git push origin main
```