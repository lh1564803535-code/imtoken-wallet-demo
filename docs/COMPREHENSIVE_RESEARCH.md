# 遗产钱包 + AI Agent 全面调研报告

> 调研日期: 2026-05-23
> 调研范围: GitHub开源项目、交易所功能、主流钱包、AI Agent方案

---

## 一、开源项目调研 (GitHub)

### 1.1 遗产/继承类项目

| 项目名 | Stars | 描述 | 技术栈 | 状态 |
|--------|-------|------|--------|------|
| **Sablier** | 800+ | 资金流协议，按时间释放资金 | Solidity, Ethers.js | 活跃，V2已上线 |
| **Sarcophagus** | 200+ | Dead Man's Switch，不活跃时释放密钥 | Solidity, React | 活跃 |
| **Timeseal** | 55 | 时间锁加密保险库 | TypeScript | 停滞 |
| **Inherichain** | 6 | 以太坊继承钱包 | Solidity | 停滞 |
| **EstateVault** | 14 | 代币化保险库 | Solidity | 停滞 |
| **deadman-switch** | 3 | 锁定ETH，定期ping | Solidity | 停滞 |

### 1.2 AI Agent 钱包类项目

| 项目名 | Stars | 描述 | 技术栈 | 状态 |
|--------|-------|------|--------|------|
| **Wayfinder** | 500+ | AI Agent路由协议，DeFi自动化 | LLM + Solidity | 活跃 |
| **GRIFFAIN** | 300+ | Solana AI Agent，对话式DeFi | LLM + Solana | 活跃 |
| **Hey Anon** | 200+ | 多步骤DeFi Agent | LLM + EVM | 活跃 |
| **Clawlet** | 100+ | Agentic消费钱包 | TypeScript | 活跃 |
| **Franklin Agent** | 50+ | AI agent with wallet | Python | 活跃 |
| **bankofai/agent-wallet** | 30+ | 多链签名SDK | TypeScript | 活跃 |

### 1.3 智能合约继承方案

| 项目名 | Stars | 描述 | 链 |
|--------|-------|------|-----|
| **OpenZeppelin Timelock** | 1000+ | 时间锁控制器 | EVM |
| **Gnosis Safe Inheritance** | 500+ | 多签+继承模块 | Ethereum |
| **Sablier V2** | 800+ | 资金流协议 | Multi-chain |

---

## 二、交易所功能调研

### 2.1 主流交易所遗产功能

| 交易所 | 功能 | 实现方式 | 局限 |
|--------|------|----------|------|
| **Coinbase** | 账户继承人设置 | KYC验证+法律文件 | 中心化，需实名 |
| **Binance** | 紧急联系人 | 人工审核 | 中心化，流程复杂 |
| **Kraken** | 遗产计划 | 法律文件+公证 | 仅限美国 |

### 2.2 去中心化方案现状

- **无标准**: 交易所无统一遗产钱包标准
- **法律依赖**: 大多依赖传统法律流程
- **技术空白**: 智能合约继承方案未被广泛采用

---

## 三、开源社区讨论热点

### 3.1 Reddit/Twitter 讨论主题

1. **"如何确保家人能继承我的crypto"** - 最常见问题
2. **Dead Man's Switch** - 技术讨论多，落地少
3. **多签钱包作为继承方案** - Gnosis Safe方案受欢迎
4. **AI管理资产** - 新兴话题，Wayfinder/GRIFFAIN受关注

### 3.2 技术博客/论文

1. **EIP-2917**: 代币继承提案 (未广泛采用)
2. **EIP-4337**: 账户抽象，可实现更灵活的继承逻辑
3. **ERC-6551**: Token Bound Accounts，NFT作为继承载体

---

## 四、我们的差异化优势

### 4.1 现有项目的不足

| 项目 | 问题 | 我们的改进 |
|------|------|-----------|
| Sablier | 仅资金流，无AI | AI Agent主动管理 |
| Sarcophagus | 仅Dead Man's Switch | 定期分配+AI决策 |
| Wayfinder/GRIFFAIN | 无遗产/继承功能 | 遗产+AI二合一 |
| 交易所方案 | 中心化，需KYC | 完全去中心化 |

### 4.2 我们的独特卖点

1. **遗产+AI一体化**: 首个将遗产管理和AI Agent结合的方案
2. **对话式UX**: 用户说"每月给我儿子0.1 ETH"，Agent自动执行
3. **完全去中心化**: 智能合约保证，无需信任第三方
4. **多链支持**: ETH+BTC+TRON，覆盖主流链
5. **消费场景**: Bitrefill集成，可直接消费继承资产

---

## 五、技术实现参考

### 5.1 可复用的开源组件

| 组件 | 来源 | 用途 |
|------|------|------|
| @consenlabs/tcx-wasm | imToken | 钱包签名核心 |
| OpenZeppelin Timelock | OpenZeppelin | 时间锁控制 |
| ethers.js v6 | Ethereum | 链上交互 |
| Sablier V2 Interface | Sablier | 资金流参考实现 |

### 5.2 需要自研的部分

1. **HeritageVault.sol**: 遗产保险库合约
2. **Agent Executor**: AI决策+执行引擎
3. **Beneficiary Manager**: 受益人管理UI
4. **Schedule Engine**: 定时任务调度

---

## 六、竞品对比表

| 维度 | Sablier | Sarcophagus | Wayfinder | 我们 |
|------|---------|-------------|-----------|------|
| 资金流 | ✅ | ❌ | ❌ | ✅ |
| AI Agent | ❌ | ❌ | ✅ | ✅ |
| 遗产继承 | ❌ | ✅ | ❌ | ✅ |
| 对话式UX | ❌ | ❌ | ✅ | ✅ |
| 多链 | ✅ | ❌ | ✅ | ✅ |
| 消费场景 | ❌ | ❌ | ❌ | ✅ |

---

## 七、结论

### 市场空白
- 没有项目同时做到"遗产管理+AI Agent+对话式UX"
- 现有方案要么是纯资金流，要么是纯AI，要么是纯继承

### 我们的机会
- **遗产+AI** 是蓝海赛道
- 对话式UX降低用户门槛
- 智能合约保证去中心化
- Bitrefill消费场景增加实用性

### 建议方向
1. 先做遗产核心功能 (HeritageVault + 受益人管理)
2. 再加AI Agent (对话式管理)
3. 最后加消费场景 (Bitrefill)

---

*调研完成于 2026-05-23*
