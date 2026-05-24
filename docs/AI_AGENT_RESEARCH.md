# AI Agent 钱包 - 市场调研

## 核心问题：AI Agent 钱包是什么？

不是"钱包里加个聊天框"。是**Agent 帮你管钱**：

| 普通钱包 | AI Agent 钱包 |
|---------|-------------|
| 你手动操作每一步 | 你说意图，Agent 执行 |
| 你找 DApp → 连接 → 选参数 → 确认 | "帮我质押收益最高的" → Agent 全搞定 |
| 你看行情自己判断 | "我的仓位合理吗" → Agent 分析建议 |
| 你手动比价 | "帮我换100U的ETH" → Agent 找最优路径 |

## 市面上的 AI Agent 钱包项目

### 1. @bankofai/agent-wallet
- 多链签名 SDK，给 AI Agent 用
- 支持 EVM + TRON
- 本质是 Agent 的签名工具，不是面向用户的

### 2. Franklin Agent
- "AI agent with a wallet"
- 能自主花费 USDC 完成任务
- 按行动付费，无订阅
- 重点：Agent 有自主决策能力

### 3. DeFi LP Agent
- AI 驱动的流动性管理
- 自动调整仓位、复投收益
- 重点：DeFi 策略自动化

### 4. Clawlet
- "Agentic crypto wallet"
- Chat-first 设计
- 帮用户买东西
- 重点：对话式消费

## AI Agent 钱包的核心能力

1. **意图理解** — 自然语言 → 具体操作
2. **工具调用** — Agent 能调 swap/stake/transfer 等
3. **策略执行** — 自动找最优路径、最高收益
4. **资产管理** — 分析持仓、建议调整
5. **跨协议** — 连接多个 DeFi 协议
6. **自主决策** — 在用户授权范围内自主操作

## 技术架构

```
用户对话
  ↓
LLM (理解意图)
  ↓
Tool/Function Calling
  ↓
┌─────────┬─────────┬─────────┬─────────┐
│ Swap    │ Stake   │ Transfer│ 分析    │
│ (DEX)   │ (DeFi)  │ (链上)  │ (数据)  │
└─────────┴─────────┴─────────┴─────────┘
  ↓
Token Core (签名)
  ↓
区块链执行
```

## 我们能复用的
- ✅ Token Core (tcx-wasm) — 签名层已有
- ✅ 助记词/钱包创建 — 基础已有
- ✅ Bitrefill 集成 — 消费场景已有
- ✅ AI 意图解析 — 框架已有（需换 LLM）

## 缺的
- ❌ 真正的 LLM 集成
- ❌ DEX Swap 功能
- ❌ DeFi 协议连接
- ❌ 资产分析能力
- ❌ Agent 自主决策逻辑