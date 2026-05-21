# 🎂 imToken 10th Anniversary — AI Crypto Spending Wallet

> 一个助记词，五条链，AI 对话式购买礼品卡 — 全部在浏览器本地完成，零服务器。

**🌐 在线体验**：https://imtoken-wallet-demo.vercel.app  
**📖 使用指南**：https://imtoken-wallet-demo.vercel.app/guide.md  
**🎬 演示视频**：[点击观看](#demo-video)

---

## 🏆 参赛信息

- **活动**：imToken 十周年 AI 共创黑客松
- **赛道**：Bitrefill 专享赛道（让钱包成为电商助手）
- **同时冲击**：最佳 AI 钱包专项奖 + 最佳用户掌控奖
- **核心叙事**：用 AI 意图驱动 crypto 消费，从"持有"到"花出去"

---

## ✨ 核心亮点

### 1. AI 对话式购买
输入 "帮我买 50 美元 Amazon 礼品卡" → AI 解析意图 → 搜索商品 → 确认支付 → Token Core 签名 → 获得券码

### 2. 真实 Token Core 集成
不是 mock，是真正调用 `@consenlabs/tcx-wasm`：创建钱包、派生 5 链地址、签名消息、签名交易

### 3. 防盲签安全设计
支付确认前强制风险提示 + 用户确认 checkbox，展示完整交易参数

### 4. 完整消费闭环
浏览商品 → AI 选品 → 签名支付 → 模拟广播 → 礼品卡加密存储 → 余额聚合展示

---

## 📋 功能列表

| 模块 | 功能 | Token Core 使用 |
|------|------|----------------|
| 创建钱包 | 密码 → 助记词 → 5 链地址 | ✅ create_keystore + derive_accounts |
| 导入钱包 | 助记词恢复 | ✅ create_keystore(mnemonic) |
| 消息签名 | ETH PersonalSign | ✅ sign_message |
| 交易签名 | 离线构造 + 网络选择 | ✅ sign_tx |
| 跨链证明 | 一签名证明 5 链所有权 | ✅ sign_message + ethers.verifyMessage |
| 签名验证 | ecrecover 恢复签名者 | ✅ ethers.js |
| 礼品卡商店 | 浏览/筛选/搜索 18+ 产品 | — |
| AI 购买 | 自然语言 → 签名支付 | ✅ sign_tx |
| 防盲签 | 风险提示 + 确认 checkbox | — |
| 模拟广播 | Broadcast to Sepolia | — |
| 礼品卡 Vault | AES-GCM 加密本地存储 | — |
| 余额聚合 | crypto + 礼品卡总览 | — |
| Keystore 安全 | 暴力破解估算 + 下载 | — |

---

## 🛠️ 技术栈

```
前端框架：Next.js 16 + React 19 + TypeScript
样式：Tailwind CSS 4 + shadcn/ui + lucide-react
钱包内核：@consenlabs/tcx-wasm v0.9.1（Token Core WebAssembly）
加密：Web Crypto API (AES-GCM) + ethers.js v6
部署：Vercel（纯静态，零 SSR）
```

---

## 🔐 安全架构

```
┌─────────────────────────────────────────┐
│           浏览器（用户设备）              │
├─────────────────────────────────────────┤
│  tcx-wasm (WASM)                        │
│  ├── 密钥生成（本地随机数）              │
│  ├── 地址派生（BIP44/84/86）            │
│  ├── 消息签名（PersonalSign）           │
│  └── 交易签名（EIP-155）                │
├─────────────────────────────────────────┤
│  Web Crypto API                         │
│  ├── PBKDF2 × 100k → AES-GCM Key       │
│  └── 礼品卡券码加密存储                  │
├─────────────────────────────────────────┤
│  防盲签保护                              │
│  ├── 交易参数完整展示                    │
│  ├── 风险警告（AlertTriangle）           │
│  └── 用户确认 checkbox                   │
└─────────────────────────────────────────┘
         ↕ 零网络请求 ↕
    私钥永远不离开浏览器
```

---

## 🚀 本地开发

```bash
git clone https://github.com/lh1564803535-code/imtoken-wallet-demo.git
cd imtoken-wallet-demo
npm install
npm run dev
```

打开 http://localhost:3000

---

## 📁 项目结构

```
src/
├── app/page.tsx              # 主页面（Hero + Tabs）
├── components/
│   ├── create-wallet.tsx     # 创建钱包 + 5 链派生 + 跨链证明
│   ├── import-wallet.tsx     # 助记词导入
│   ├── sign-message.tsx      # 消息签名 + 交易签名 + 网络选择
│   ├── wallet-security.tsx   # Keystore 安全面板
│   ├── ai-intent.tsx         # AI 意图助手
│   └── bitrefill/            # Bitrefill 集成模块
│       ├── ShopTab.tsx       # 商店主容器
│       ├── GiftCardShop.tsx  # 产品目录 + 筛选
│       ├── ProductDetail.tsx # 产品详情 + 购买
│       ├── PaymentConfirm.tsx# 支付确认（防盲签）
│       ├── PaymentResult.tsx # 支付成功 + 模拟广播
│       ├── GiftCardVault.tsx # 已购礼品卡管理
│       └── BalanceDashboard.tsx # 余额聚合
├── lib/
│   ├── tcx.ts               # Token Core WASM 封装
│   ├── bitrefill-api.ts     # Bitrefill API 客户端（mock）
│   ├── gift-card-crypto.ts  # AES-GCM 加密
│   └── networks.ts          # 网络配置
└── hooks/
    ├── useBitrefill.ts       # 商品搜索 hook
    └── useGiftCardVault.ts   # 礼品卡存储 hook
```

---

## <a name="demo-video"></a>🎬 演示视频

> 视频待上传

---

*Powered by Token Core (tcx-wasm) · imToken 10th Anniversary Hackathon · Bitrefill Track*
