# BaiLong AI Wallet — AI Agent 钱包

> 一句话控制你的加密资产。AI 干活，你只点确认。

**Live Demo**: https://imtoken-wallet-demo.vercel.app
**Video**: [Demo Video](链接待补)

---

## 项目概述

BaiLong AI Wallet 是一个 **AI Agent 钱包**，让用户用自然语言控制链上资产。

**核心理念：AI 干活，人类点头。**

你只需要说一句话（"帮我查余额"、"帮我转 100 USDC 给张三"），AI Agent 帮你完成所有技术细节——查余额、估算 gas、检查地址安全、生成交易——你只需要最后点一下"确认"。

---

## 核心功能

### 1. AI Agent 对话控制

- 自然语言指令："帮我查余额"、"帮我转账"、"帮我对比 gas 费"
- AI 自动匹配工具：查余额、提交审批、查交易记录、查审计日志
- 基于 Vercel AI SDK v6 + MiMo 模型

### 2. Cobo Agentic Wallet 集成

- **Pact 授权机制**：AI 提交操作计划 → 用户审批 → AI 执行
- **MPC 安全**：私钥切片存储，没人能单独动钱
- **Policies 约束**：限额、白名单、时间限制

### 3. Bitrefill 电商集成

- 29 款礼品卡（Amazon、Steam、Netflix、Uber、Spotify...）
- 11 款 eSIM 产品（日本、泰国、韩国、欧洲...）
- AI 智能推荐："我要去日本" → 推荐当地 eSIM + 礼品卡
- AES-GCM 加密礼品卡保险箱

### 4. 多链钱包支持

- 基于 `@consenlabs/tcx-wasm`（Token Core）
- 支持 ETH、BTC、TRON 等 5 条链
- 本地签名，零服务器参与
- Base Sepolia 测试网部署

### 5. 安全机制

- **蜜罐检测**：自动识别诈骗代币（honeypot.is API）
- **地址安全检查**：验证交易历史、合约检测
- **Gas 自动估算**：实时计算交易成本
- **反盲签**：交易前显示完整详情，用户必须确认

---

## 技术架构

```
src/
  app/                    # Next.js 16 页面路由
    page.tsx              # 主页（钱包 + AI 聊天）
    api/agent/            # AI Agent API 路由
    api/bitrefill/        # Bitrefill API 代理
    procurement/          # AI 购物工作台
    browse/               # 服务市场
    order/                # 订单管理
  components/
    ai-agent.tsx          # AI Agent 聊天界面
    bailong-chat-panel.tsx # 白龙助手面板
    create-wallet.tsx     # 钱包创建
    sign-message.tsx      # 签名确认
    bitrefill/            # Bitrefill 电商组件
    pages/                # 钱包子页面（发送/接收/交换等）
  lib/
    agent-core.ts         # AI Agent 核心逻辑
    agent-tools.ts        # Tool Calling 工具定义
    cobo.ts               # Cobo CAW SDK 集成
    honeypot.ts           # 蜜罐检测
    address-checker.ts    # 地址安全检查
    gas-estimator.ts      # Gas 自动估算
    tcx.ts                # Token Core WASM 封装
    bitrefill-api.ts      # Bitrefill API
    gift-card-crypto.ts   # AES-GCM 加密
```

---

## 技术栈

| 层级 | 技术 |
|------|------|
| **前端框架** | Next.js 16 + React 19 + TypeScript |
| **样式** | Tailwind CSS 4 + shadcn/ui |
| **AI 引擎** | Vercel AI SDK v6 + MiMo 模型 |
| **钱包** | @consenlabs/tcx-wasm + wagmi + RainbowKit |
| **Web3** | viem + ethers.js（Base Sepolia） |
| **Agent 基础设施** | Cobo Agentic Wallet SDK |
| **电商** | Bitrefill API v2 |
| **加密** | Web Crypto API（AES-GCM） |
| **部署** | Vercel |

---

## 安全模型

- 本地生成密钥（PBKDF2 × 600k rounds）
- 零服务器参与签名
- MPC 多方计算保护私钥
- Pact 授权机制：AI 提议 → 用户审批 → 执行
- AES-GCM 加密存储敏感数据
- 蜜罐/地址/合约安全检查

---

## 如何运行

```bash
# 1. 克隆项目
git clone https://github.com/lh1564803535-code/imtoken-wallet-demo.git
cd imtoken-wallet-demo

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入你的 API Key

# 4. 启动开发服务器
npm run dev

# 5. 打开浏览器
# http://localhost:3000
```

### 环境变量说明

| 变量 | 说明 |
|------|------|
| `OPENAI_API_KEY` | MiMo API Key |
| `OPENAI_BASE_URL` | `https://token-plan-cn.xiaomimimo.com/v1` |
| `OPENAI_MODEL` | `mimo-v2.5` |
| `NEXT_PUBLIC_AGENT_WALLET_API_KEY` | Cobo CAW API Key |
| `NEXT_PUBLIC_AGENT_WALLET_WALLET_ID` | Cobo 钱包 ID |
| `BITREFILL_API_KEY` | Bitrefill API Key |
| `BITREFILL_API_SECRET` | Bitrefill API Secret |

---

## 链上证据

### 测试网部署信息

| 项目 | 信息 |
|------|------|
| **网络** | Base Sepolia Testnet |
| **Chain ID** | 84532 |
| **RPC** | https://sepolia.base.org |
| **USDC 合约** | 0x036CbD53842c5426634e7929541eC2318f3dCF7e |
| **Escrow 合约** | 0x6EdD143062Ae71D836B7584Ba73A99E8c49DBd8C |

### 测试网浏览器验证

- Base Sepolia Explorer: https://sepolia-explorer.base.org
- 输入合约地址可查看部署记录和交易历史

---

## 团队

- **数字生命卡兹克** — 产品设计 + 全栈开发

---

## 致谢

- [Cobo Agentic Wallet](https://www.cobo.com/agentic-wallet) — Agent 钱包基础设施
- [Bitrefill](https://www.bitrefill.com) — 加密货币电商 API
- [Vercel AI SDK](https://ai-sdk.dev) — AI Agent 开发框架
- [Token Core](https://github.com/Consenlabs/token-core) — 多链钱包底层
- [Base](https://base.org) — Coinbase L2 网络

---

## License

MIT
