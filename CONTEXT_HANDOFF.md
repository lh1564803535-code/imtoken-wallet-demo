# imToken Wallet Demo — 上下文交接文档

## 项目概述

imToken 十周年 AI 共创黑客松参赛作品，冲击 **Bitrefill 专享赛道**（$500 × 2）+ 最佳 AI 钱包专项奖。

- **目录**：`D:\MyProjects\code\imtoken-wallet-demo\`
- **线上**：https://imtoken-wallet-demo.vercel.app
- **GitHub**：https://github.com/lh1564803535-code/imtoken-wallet-demo
- **技术栈**：Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui + @consenlabs/tcx-wasm
- **部署**：Vercel（纯静态，零 SSR）
- **当前 commit**：`a68384e`（main 分支）

## 核心功能（全部已实现）

| 功能 | 文件 | 状态 |
|------|------|------|
| 创建钱包（5链派生） | create-wallet.tsx + tcx.ts | ✅ |
| 助记词导入恢复 | import-wallet.tsx | ✅ |
| 消息签名（PersonalSign） | sign-message.tsx | ✅ |
| 离线交易签名 + 网络选择 | sign-message.tsx + networks.ts | ✅ |
| 跨链所有权证明 + ecrecover 验证 | create-wallet.tsx + tcx.ts (ethers) | ✅ |
| Keystore 安全面板 + 下载 | wallet-security.tsx | ✅ |
| AI 意图助手（自然语言） | ai-intent.tsx + BitrefillIntent.ts | ✅ |
| Bitrefill 真实商店（iframe Widget） | BitrefillWidget.tsx | ✅ |
| Demo 商品目录（mock fallback） | GiftCardShop.tsx + bitrefill-mock-data.ts | ✅ |
| AI 复合指令（自动搜索+选品） | ai-intent.tsx → ShopTab.tsx | ✅ |
| 支付确认 + 防盲签警告 | PaymentConfirm.tsx | ✅ |
| Token Core 签名支付 | ShopTab.tsx → tcx.ts signTransaction | ✅ |
| 模拟广播到 Sepolia | PaymentResult.tsx | ✅ |
| 礼品卡 AES 加密存储 | gift-card-crypto.ts + useGiftCardVault.ts | ✅ |
| 余额聚合（Sepolia 真实查询） | BalanceDashboard.tsx (ethers provider) | ✅ |
| 记住上次支付链 | ShopTab.tsx (localStorage) | ✅ |
| 支付成功 confetti 动画 | PaymentResult.tsx | ✅ |

## 文件结构

```
src/
├── app/
│   ├── page.tsx              # 主页面（Hero + 5 Tabs + state hub）
│   ├── layout.tsx            # 根布局
│   └── globals.css           # 主题 + 动画
├── components/
│   ├── create-wallet.tsx     # 创建钱包 + 5链 + 跨链证明
│   ├── import-wallet.tsx     # 助记词导入
│   ├── sign-message.tsx      # 签名 + 交易签名 + 网络选择
│   ├── wallet-security.tsx   # Keystore 安全
│   ├── ai-intent.tsx         # AI 助手（意图解析 + 动作分发）
│   ├── bitrefill/
│   │   ├── ShopTab.tsx       # 商店主容器（3 views: bitrefill-store/catalog/vault）
│   │   ├── BitrefillWidget.tsx # Bitrefill iframe 嵌入（真实 8000+ 商品）
│   │   ├── GiftCardShop.tsx  # Mock 商品目录 + 筛选
│   │   ├── ProductCard.tsx   # 商品卡片
│   │   ├── ProductDetail.tsx # 商品详情 + 面值/链选择
│   │   ├── PaymentConfirm.tsx# 支付确认（防盲签 + checkbox）
│   │   ├── PaymentResult.tsx # 成功页（券码 + 模拟广播 + confetti）
│   │   ├── GiftCardVault.tsx # 已购礼品卡管理
│   │   ├── BalanceDashboard.tsx # 余额聚合（Sepolia RPC 查询）
│   │   └── BitrefillIntent.ts  # 购买意图正则解析
│   └── ui/                   # shadcn/ui 组件
├── lib/
│   ├── tcx.ts               # Token Core WASM 封装（所有钱包功能）
│   ├── bitrefill-api.ts     # Mock API（Widget 是真实数据源）
│   ├── bitrefill-mock-data.ts # 18 个 mock 产品
│   ├── gift-card-crypto.ts  # AES-GCM 加密（Web Crypto API）
│   ├── networks.ts          # 网络配置（Mainnet + Sepolia）
│   └── utils.ts             # cn() 工具
├── hooks/
│   ├── useBitrefill.ts      # 商品搜索 hook
│   └── useGiftCardVault.ts  # 礼品卡 CRUD hook
└── types/
    └── bitrefill.ts         # 类型定义
```

## 关键技术细节

### tcx-wasm API
```typescript
create_keystore({ password }) → keystoreJson
create_keystore({ password, mnemonic }) → keystoreJson（导入）
derive_accounts({ keystoreJson, key, derivations }) → [{ address }]
sign_message({ keystoreJson, key, chain, derivationPath, input: { message, signatureType } }) → { signature }
sign_tx({ keystoreJson, key, chain, derivationPath, input: { nonce, gasPrice, gasLimit, to, value, data, chainId } }) → { signature }
export_mnemonic({ keystoreJson, key }) → { mnemonic }
```

### signTransaction 的 fallback 机制
`sign_tx` 可能因输入格式问题失败，代码有 fallback：先尝试 `sign_tx`，失败则用 `sign_message` 签名交易参数（PersonalSign）。两种方式都是真实 Token Core 签名。

### Bitrefill 集成方式
- **真实商品**：通过 Bitrefill Embed Widget（iframe）展示，无需 API Key
- **Demo 购买流程**：用 mock 数据走完整签名流程（选品→确认→签名→券码）
- **Widget URL**：`https://embed.bitrefill.com/?showPaymentInfo=true&theme=light&paymentMethod=ethereum&hl=en`
- **事件监听**：postMessage 监听 invoice_created / invoice_complete

### AI 意图解析
- 纯前端正则匹配（不调 LLM）
- 支持中英文："Buy $50 Amazon card" / "买100元京东卡"
- 匹配后通过 `onNavigate("shop")` + `onAction("purchase", payload)` 触发跳转

## 部署命令

```bash
npm run build                    # 本地构建
echo y | npx vercel --prod --yes # 部署到 Vercel
git push origin main             # 推送到 GitHub
```

## 已知限制

1. `sign_tx` 对某些输入格式会失败（已有 fallback）
2. 余额查询连的是 Sepolia 测试网（新钱包余额为 0）
3. 广播是模拟的（假 txHash），不是真正发到链上
4. Bitrefill Widget 在某些网络环境下可能加载慢（有 10s 超时 + fallback）
5. AI 是关键词匹配，不是 LLM

## 竞赛信息

- **截止**：今晚（2026-05-23）
- **已提交**：是
- **视频**：已录制
- **赛道**：Bitrefill 专享（暂无竞争者）
- **同时冲击**：最佳 AI 钱包 + 最佳用户掌控 + 阳光奖
