# imToken Wallet Demo — 上下文交接文档

## 项目概述

这是 imToken 十周年 AI 共创黑客松的参赛作品。目标是冲刺「最佳用户掌控奖」（$1,000 专项奖）。

- **目录：** `D:\MyProjects\code\imtoken-wallet-demo\`
- **部署：** https://imtoken-wallet-demo.vercel.app
- **技术栈：** Next.js 16 + React 19 + Tailwind CSS 4 + shadcn/ui + @consenlabs/tcx-wasm + RainbowKit + wagmi
- **核心依赖：** `@consenlabs/tcx-wasm` v0.9.1（imToken Token Core 的 WebAssembly 版本）

## 当前功能（已完成 v1-v6）

1. **创建钱包** — 输入密码 → WASM 本地生成 keystore + 助记词
2. **多链地址派生** — 一个助记词同时派生 ETH / BTC Legacy / BTC SegWit / BTC Taproot / TRON 五个地址
3. **跨链所有权证明** — 用 ETH PersonalSign 签名包含所有地址的消息，密码学证明你控制所有链
4. **签名消息** — ETH PersonalSign
5. **Security Tab** — 暴力破解估算（PBKDF2 600k rounds）+ Keystore 详情 + 下载 Keystore 文件
6. **RainbowKit 连接外部钱包** — MetaMask / WalletConnect，Base Sepolia 测试网
7. **Zero Trust 横幅** — 声明无服务端、本地 WASM、开源可审计

## 关键技术细节

### tcx-wasm API（实际验证过的正确格式）

```typescript
// 创建钱包（password 模式）
create_keystore(JSON.stringify({ password })) → keystoreJson string

// 派生地址
derive_accounts(JSON.stringify({
  keystoreJson, key: password,
  derivations: [{ chain: "ETHEREUM", derivationPath: "m/44'/60'/0'/0/0", network: "MAINNET" }]
})) → JSON array of { address, chain, derivationPath, ... }

// BTC 需要 segWit 参数："NONE" | "VERSION_0" | "VERSION_1"
// TRON 用 chain: "TRON", derivationPath: "m/44'/195'/0'/0/0"

// 签名消息
sign_message(JSON.stringify({
  keystoreJson, key: password, chain: "ETHEREUM",
  derivationPath: "m/44'/60'/0'/0/0",
  input: { message, signatureType: "PersonalSign" }
})) → { signature: "0x..." }

// 导出助记词
export_mnemonic(JSON.stringify({ keystoreJson, key: password })) → { mnemonic: "..." }
```

### WASM 加载

- WASM 文件在 `public/tcx_wasm_bg.wasm`
- `init("/tcx_wasm_bg.wasm")` 显式指定路径（不能用默认的 import.meta.url）
- `scripts/copy-wasm.mjs` 在 build 和 postinstall 时自动从 node_modules 复制
- `.npmrc` 有 `legacy-peer-deps=true`（解决 wagmi 的 peer dep 冲突）

### 设计规范（Token UI）

- 品牌色：`#007fff`（主色）、`#0cc5ff`（辅色/渐变起点）
- 按钮：`rounded-full`（药丸形）+ 蓝色 underglow 阴影
- 卡片：`rounded-xl` + `ring-1 ring-[#111d4a]/10`
- 文字色：`#111d4a`（主）、`#99a1af`（次）
- 字体：Inter + Noto Sans SC

## 文件结构

```
src/
├── app/
│   ├── layout.tsx      — 根布局（Inter 字体、WalletProvider、favicon）
│   ├── page.tsx        — 主页面（Hero + Zero Trust 横幅 + 4 Tabs）
│   └── globals.css     — Token UI 主题 + 动画（identity-gradient, pulse-glow, address-reveal 等）
├── components/
│   ├── create-wallet.tsx   — 创建钱包 + 多链派生 + 跨链所有权证明
│   ├── sign-message.tsx    — ETH 签名消息
│   ├── wallet-security.tsx — 暴力破解估算 + Keystore 详情 + 下载
│   ├── wallet-profile.tsx  — RainbowKit 连接外部钱包
│   ├── wallet-provider.tsx — WagmiProvider + RainbowKitProvider
│   └── ui/                 — shadcn/ui 组件
├── lib/
│   ├── tcx.ts          — Token Core WASM 封装（所有钱包功能）
│   ├── wagmi.ts        — wagmi 配置（Base Sepolia）
│   └── utils.ts        — cn() 工具
public/
├── anniversary-visual.svg  — 官网主视觉 SVG（旋转动画装饰）
├── favicon.svg             — imToken 龙图标
└── tcx_wasm_bg.wasm        — Token Core WASM 二进制
```

## 竞赛信息

- **活动：** imToken 十周年 AI 共创黑客松
- **截止：** 2026 年 5 月 22 日 23:59 UTC+8
- **目标专项奖：** 最佳用户掌控奖（强调用户对资产/权限的自主控制力）
- **核心叙事：** "一个助记词，五条链，全部在浏览器本地完成——你不需要信任任何人，密码学本身就是证明。"

## 评审维度

| 维度 | 权重 | 当前状态 |
|------|------|---------|
| 创意与方向契合度 | 25% | 跨链所有权证明是亮点 |
| 用户价值与实用性 | 25% | 定位为"零信任多链钱包工具" |
| 完成度与可演示性 | 25% | ✅ 已部署，全流程可跑通 |
| 安全性与自托管意识 | 15% | ✅ Zero Trust 声明 + 安全警告 |
| 表达与共创过程 | 10% | 需要整理 Prompt 迭代过程 |

## 下一步可能的改进

- 录制演示视频（20MB 以内）
- 整理创作过程文档（Prompt 迭代记录）
- 考虑加"导入助记词恢复钱包"功能
- 考虑加"多链签名对比"（Token Core vs MetaMask 签同一消息）
