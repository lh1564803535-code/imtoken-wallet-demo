# imToken 钱包 - 技术架构方案

> 2026-05-23 | 从 Demo 到真实可部署钱包

---

## 一、整体架构

`
┌─────────────────────────────────────────────┐
│                  前端 (Next.js)               │
│  ┌─────────┐ ┌──────────┐ ┌──────────────┐  │
│  │ 首页    │ │ AI Chat  │ │ Activity     │  │
│  │ 资产    │ │ (Agent)  │ │ 交易历史     │  │
│  │ 总览    │ │          │ │              │  │
│  └────┬────┘ └────┬─────┘ └──────┬───────┘  │
│       │           │              │           │
│  ┌────▼───────────▼──────────────▼───────┐  │
│  │           核心层 (tcx-wasm)            │  │
│  │  创建钱包 | 签名 | 地址派生 | 导出     │  │
│  └────────────────┬──────────────────────┘  │
│                   │                          │
│  ┌────────────────▼──────────────────────┐  │
│  │          链交互层 (ethers.js)           │  │
│  │  余额查询 | 发送交易 | Gas估算 | 历史   │  │
│  └────────────────┬──────────────────────┘  │
└───────────────────┼──────────────────────────┘
                    │
         ┌──────────┼──────────┐
         ▼          ▼          ▼
   ┌──────────┐ ┌────────┐ ┌──────────┐
   │ RPC节点  │ │ AI API │ │ Bitrefill│
   │ Alchemy  │ │ OpenAI │ │ API      │
   └──────────┘ └────────┘ └──────────┘
`

---

## 二、文件结构改造

### 当前结构问题
- 没有统一的 layout（各页面独立）
- 组件太多平铺，没有按功能分组
- 缺少 hooks 层（数据获取散落在组件里）

### 目标结构
`
src/
├── app/
│   ├── layout.tsx          # Root layout (providers, 深色主题)
│   ├── page.tsx            # 首页 = 资产总览
│   ├── globals.css         # 全局样式
│   └── api/
│       └── agent/
│           └── route.ts    # AI Agent API (OpenAI function calling)
│
├── components/
│   ├── layout/
│   │   ├── BottomNav.tsx   # 底部导航栏
│   │   ├── Header.tsx      # 顶部栏 (logo + 网络切换)
│   │   └── PageShell.tsx   # 页面容器
│   │
│   ├── wallet/
│   │   ├── CreateWallet.tsx
│   │   ├── ImportWallet.tsx
│   │   ├── AssetList.tsx   # 资产列表 (ETH, ERC20, NFT)
│   │   ├── BalanceCard.tsx # 大数字余额卡片
│   │   ├── SendModal.tsx   # 发送弹窗
│   │   ├── ReceiveModal.tsx# 接收弹窗 (二维码)
│   │   └── TxHistory.tsx   # 交易历史
│   │
│   ├── agent/
│   │   ├── ChatPanel.tsx   # AI 聊天面板
│   │   ├── MessageBubble.tsx
│   │   ├── ToolCard.tsx    # 工具调用卡片 (swap, send, etc.)
│   │   └── ConfirmDialog.tsx # 操作确认弹窗
│   │
│   ├── bitrefill/
│   │   └── (保持现有)
│   │
│   └── ui/
│       └── (shadcn components)
│
├── hooks/
│   ├── useWallet.ts        # 钱包状态管理
│   ├── useBalance.ts       # 余额查询 (swr)
│   ├── useTxHistory.ts     # 交易历史
│   ├── useAgent.ts         # AI Agent 调用
│   └── useGas.ts           # Gas 估算
│
├── lib/
│   ├── tcx.ts              # Token Core 封装 (保持)
│   ├── rpc.ts              # RPC 交互层 (新增)
│   ├── agent-tools.ts      # Agent tool 定义 (新增)
│   ├── storage.ts           # 本地存储 (IndexedDB)
│   └── bitrefill-api.ts    # Bitrefill (保持)
│
└── types/
    └── (保持现有 + 新增)
`

---

## 三、AI Agent V2 架构

### 核心设计: OpenAI Function Calling

`
用户: "帮我给 vitalik.eth 转 0.1 ETH"
         │
         ▼
/api/agent (POST)
{
  messages: [...history, { role: "user", content: "..." }],
  tools: [
    { name: "resolve_ens", ... },
    { name: "get_balance", ... },
    { name: "estimate_gas", ... },
    { name: "send_transaction", ... },
  ]
}
         │
         ▼
LLM 返回: { tool_call: "send_transaction", args: { to: "0xd8dA...", amount: "0.1" } }
         │
         ▼
前端: 显示确认卡片 → 用户点确认 → tcx-wasm 签名 → 发送
         │
         ▼
LLM 返回: "已发送 0.1 ETH 到 vitalik.eth, tx: 0xabc..."
`

### Tool 定义 (agent-tools.ts)

`	ypescript
export const walletTools = [
  {
    name: "get_balance",
    description: "查询地址在指定链上的原生代币余额",
    parameters: {
      address: "钱包地址",
      chain: "ethereum|bitcoin|tron"
    }
  },
  {
    name: "get_tokens",
    description: "查询地址持有的 ERC20 代币列表",
    parameters: { address, chain }
  },
  {
    name: "send_transaction",
    description: "发送原生代币到指定地址",
    parameters: { to, amount, chain }
  },
  {
    name: "swap_tokens",
    description: "在 DEX 上交换代币",
    parameters: { fromToken, toToken, amount, slippage }
  },
  {
    name: "estimate_gas",
    description: "估算交易的 gas 费用",
    parameters: { to, amount, chain }
  },
  {
    name: "get_tx_history",
    description: "查询交易历史",
    parameters: { address, chain, limit }
  },
  {
    name: "search_product",
    description: "搜索 Bitrefill 商品",
    parameters: { query, category }
  },
  {
    name: "purchase_product",
    description: "购买 Bitrefill 商品",
    parameters: { productId, amount }
  },
  {
    name: "resolve_ens",
    description: "解析 ENS 域名到地址",
    parameters: { name }
  },
  {
    name: "get_gas_price",
    description: "获取当前 gas 价格建议",
    parameters: { chain }
  }
];
`

### API Route 设计 (/api/agent/route.ts)

`	ypescript
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { messages, walletAddress, chain } = await req.json();

  const systemMessage = {
    role: "system",
    content: 你是一个加密钱包 AI 助手。用户的钱包地址是 ，当前链是 。
    你可以帮助用户查询余额、发送交易、swap、购买商品等。
    重要操作（发送交易、swap、购买）必须让用户确认后才能执行。
    回复要简洁，用中文。
  };

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [systemMessage, ...messages],
    tools: walletTools,
    tool_choice: "auto"
  });

  return Response.json(response.choices[0].message);
}
`

---

## 四、RPC 交互层 (lib/rpc.ts)

### 核心功能

`	ypescript
import { ethers } from "ethers";

// Alchemy RPC (免费额度足够测试)
const RPC_URLS = {
  ethereum: process.env.NEXT_PUBLIC_ETH_RPC,  // Sepolia or Mainnet
  polygon: process.env.NEXT_PUBLIC_POLYGON_RPC,
  arbitrum: process.env.NEXT_PUBLIC_ARB_RPC,
};

// 1. 余额查询
async function getBalance(address: string, chain: string): Promise<string> {
  const provider = new ethers.JsonRpcProvider(RPC_URLS[chain]);
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
}

// 2. ERC20 余额
async function getTokenBalance(
  tokenAddress: string,
  walletAddress: string,
  chain: string
): Promise<string> {
  const provider = new ethers.JsonRpcProvider(RPC_URLS[chain]);
  const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  const balance = await contract.balanceOf(walletAddress);
  const decimals = await contract.decimals();
  return ethers.formatUnits(balance, decimals);
}

// 3. 发送交易
async function sendTransaction(
  to: string,
  amount: string,
  privateKey: string,
  chain: string
): Promise<string> {
  const provider = new ethers.JsonRpcProvider(RPC_URLS[chain]);
  const wallet = new ethers.Wallet(privateKey, provider);
  const tx = await wallet.sendTransaction({
    to,
    value: ethers.parseEther(amount),
  });
  return tx.hash;
}

// 4. Gas 估算
async function estimateGas(
  to: string,
  amount: string,
  chain: string
): Promise<GasEstimate> {
  const provider = new ethers.JsonRpcProvider(RPC_URLS[chain]);
  const gasPrice = await provider.getFeeData();
  const gasLimit = await provider.estimateGas({
    to,
    value: ethers.parseEther(amount),
  });
  return {
    gasLimit: gasLimit.toString(),
    gasPrice: gasPrice.gasPrice?.toString() ?? "0",
    estimatedCost: ethers.formatEther(gasLimit * (gasPrice.gasPrice ?? 0n)),
  };
}

// 5. 交易历史 (Alchemy API)
async function getTransactionHistory(
  address: string,
  chain: string,
  limit: number = 20
): Promise<Transaction[]> {
  // Alchemy 的 getAssetTransfers API
  const alchemyUrl = RPC_URLS[chain].replace("rpc", "api");
  const response = await fetch(alchemyUrl, {
    method: "POST",
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "alchemy_getAssetTransfers",
      params: [{
        fromAddress: address,
        category: ["external", "erc20", "erc721"],
        maxCount: limit,
        order: "desc"
      }]
    })
  });
  // ... parse response
}
`

---

## 五、状态管理

### 用 React Context + SWR

`	ypescript
// hooks/useWallet.ts
"use client";
import { createContext, useContext, useState, useEffect } from "react";

interface WalletContextType {
  wallet: WalletData | null;
  address: string;
  chain: string;
  isLocked: boolean;
  createWallet: (password: string) => Promise<void>;
  importWallet: (mnemonic: string, password: string) => Promise<void>;
  lock: () => void;
  unlock: (password: string) => Promise<boolean>;
  switchChain: (chain: string) => void;
}

// hooks/useBalance.ts
import useSWR from "swr";

function useBalance(address: string, chain: string) {
  return useSWR(
    address ? ['balance', address, chain] : null,
    () => getBalance(address, chain),
    { refreshInterval: 15000 }  // 每15秒刷新
  );
}
`

---

## 六、UI 设计规格

### 首页 (资产总览)
`
┌──────────────────────────────┐
│  imToken Wallet    [Ethereum ▼]│  ← 顶部: Logo + 网络切换
│                              │
│     总资产                    │
│     ,345.67               │  ← 大数字余额
│                              │
│   [发送]  [接收]  [Swap]     │  ← 操作按钮
│                              │
│  ── 资产 ──────────────────  │
│                              │
│  ◆ ETH          2.5   ,000 │  ← 资产列表
│  ◆ USDC         3,000 ,000 │
│  ◆ UNI          100      │
│  ◆ ...                       │
│                              │
│  ── NFT ───────────────────  │
│  [NFT网格]                    │
│                              │
├──────────────────────────────┤
│  [首页]  [AI]  [活动]  [设置] │  ← 底部导航
└──────────────────────────────┘
`

### AI 页面 (Agent Chat)
`
┌──────────────────────────────┐
│  AI 钱包助手                   │
│                              │
│  ┌──────────────────────────┐│
│  │ 你好! 我可以帮你:         ││
│  │ • 查询余额               ││
│  │ • 发送/接收 crypto       ││
│  │ • Swap 代币              ││
│  │ • 购买商品               ││
│  └──────────────────────────┘│
│                              │
│  ┌──────────────────────────┐│
│  │ 用户: 查一下我有多少钱    ││
│  └──────────────────────────┘│
│                              │
│  ┌──────────────────────────┐│
│  │ AI: 你的钱包有:          ││
│  │ ETH: 2.5 (,000)       ││
│  │ USDC: 3,000              ││
│  │ 总计: ,345            ││
│  └──────────────────────────┘│
│                              │
│  ┌──────────────────────────┐│
│  │ 用户: 给 0xabc...转 0.1  ││
│  └──────────────────────────┘│
│                              │
│  ┌──────────────────────────┐│
│  │ AI: 确认发送?            ││
│  │ ┌──────────────────────┐ ││
│  │ │ 发送: 0.1 ETH       │ ││
│  │ │ 到: 0xabc...def     │ ││
│  │ │ Gas: ~0.001 ETH     │ ││
│  │ │ [确认]  [取消]       │ ││
│  │ └──────────────────────┘ ││
│  └──────────────────────────┘│
│                              │
│  [输入消息...]        [发送] │
├──────────────────────────────┤
│  [首页]  [AI]  [活动]  [设置] │
└──────────────────────────────┘
`

### 活动页面 (交易历史)
`
┌──────────────────────────────┐
│  活动记录                     │
│                              │
│  今天                         │
│  ↑ 发送 0.1 ETH → 0xabc...  │
│    -0.1001 ETH               │
│    12:34 PM                  │
│                              │
│  ↓ 接收 500 USDC ← 0xdef... │
│    +500 USDC                 │
│    10:20 AM                  │
│                              │
│  昨天                         │
│  ↔ Swap 1 ETH → 3200 USDC  │
│    via Uniswap               │
│    3:45 PM                   │
│                              │
│  [加载更多]                   │
├──────────────────────────────┤
│  [首页]  [AI]  [活动]  [设置] │
└──────────────────────────────┘
`

---

## 七、部署流程

### 测试网 (现在)
1. Vercel 部署 (已有)
2. Alchemy 申请 Sepolia RPC
3. OpenAI API Key
4. 环境变量配置

### 主网 (Phase 2)
1. 安全审计
2. 域名绑定
3. 更多 RPC 节点
4. 监控告警

---

## 八、安全注意事项

1. **私钥永远不离开客户端**: tcx-wasm 在浏览器运行
2. **API Key 只在服务端**: OpenAI key 放 .env.local
3. **交易确认**: 重要操作必须用户明确确认
4. **输入验证**: 地址格式、金额范围检查
5. **Rate Limiting**: API route 加 rate limit
6. **CSP**: 配置 Content Security Policy
