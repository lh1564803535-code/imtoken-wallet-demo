# imToken 钱包项目 - 市场调研报告

> 调研日期: 2026-05-23
> 目标: 对标主流钱包 UI + 调研 AI Agent 落地方案 → 为真实可部署钱包制定方向

---

## 一、主流钱包 UI 对标分析

### 1. Rainbow (以太坊生态, 非托管)

**设计哲学**: 极简 + 彩色 + 面向新手

**核心 UI 特点**:
- **首页 = 资产总览**: 一个大大的美元余额数字，下面按 token 分列，每个 token 带彩色图标
- **底部导航栏**: Home / Discover / Profile（三个 tab，极简）
- **发送/接收**: 首页悬浮按钮，一键触达
- **NFT Gallery**: 原生集成，网格展示，点开有详情
- **Discover 页**: 内置 DApp 浏览器 + 热门 token 发现
- **颜色系统**: 每个 token 有自己的 brand color，整体白色背景 + 渐变
- **动画**: 发送时有彩虹粒子效果，很 subtle
- **助记词备份**: 引导式流程，强制用户备份后才能用

**值得借鉴**:
- 首页就是资产，不搞 tab 切换找资产
- 彩色 token 图标让界面活起来
- 发送/接收永远在最显眼的位置
- 极少的 tab 数量（3个）

---

### 2. Phantom (Solana 生态, 多链)

**设计哲学**: 深色主题 + 专业感 + 功能密度高

**核心 UI 特点**:
- **首页**: 顶部大余额 + 资产列表 + 底部 tab
- **底部导航**: Home / Swap / Activity / Settings（4个 tab）
- **Swap 内置**: 一键 swap，不需要跳 DEX
- **Staking 内置**: SOL 直接 stake，不需要第三方
- **NFT 展示**: 网格 + 收藏分组
- **深色主题**: 默认深色，专业感强
- **浏览器扩展**: 同时有移动端和浏览器扩展，体验一致
- **交易历史**: 按时间分组，每笔交易有图标 + 描述

**值得借鉴**:
- Swap 直接内置，不跳外部
- 交易历史的展示方式（时间分组 + 图标 + 可读描述）
- Activity tab 让用户随时看链上动态
- 深色主题在加密圈很受欢迎

---

### 3. imToken (多链, 非托管, 国产)

**设计哲学**: 国际化 + 多链覆盖 + 安全优先

**核心 UI 特点**:
- **首页**: 钱包总览 + 按链分组（ETH / BTC / TRON 各一行）
- **底部导航**: 首页 / 浏览器 / 发现 / 我
- **DApp 浏览器**: 内置 Web3 浏览器，直接访问 DeFi
- **Tokenlon DEX**: 内置 DEX
- **多钱包管理**: 支持创建/导入多个钱包，切换方便
- **安全中心**: 风险提示、钓鱼检测、交易模拟
- **iToken**: 原生 token 经济
- **横幅/活动**: 首页顶部有活动轮播

**值得借鉴**:
- 多钱包管理（创建/导入/切换）
- 安全中心（交易风险提示）
- DApp 浏览器
- 按链分组的资产展示

---

### 4. Coinbase Wallet (美国合规, 多链)

**设计哲学**: 信任感 + 合规 + 渐进式复杂度

**核心 UI 特点**:
- **首页**: 余额 + 资产列表 + NFT tab
- **底部导航**: Home / Trade / Pay / Browser（4个 tab）
- **Pay 功能**: 扫码支付、链接支付
- **内置交易**: 买卖 crypto 直接走 Coinbase
- **WalletConnect**: 原生支持
- **恢复短语**: 云备份选项（加密存 Google Drive/iCloud）
- **白标**: 可以作为 Coinbase 主 app 内嵌，也可以独立

**值得借鉴**:
- Pay tab（支付场景优先）
- 云备份选项（降低新手门槛）
- Trade tab 让交易入口清晰
- 合规感的 UI（实名、限额提示）

---

## 二、钱包 UI 设计趋势总结 (2025-2026)

### 共性
1. **首页 = 余额大数字 + 资产列表**，这个模式所有钱包都一样
2. **底部导航 3-4 个 tab**，多了用户迷路
3. **发送/接收永远在首屏**，不能藏起来
4. **交易历史必须有**，而且要可读（不是 raw hash）
5. **Swap 内置**成为标配
6. **NFT 展示**是基础功能
7. **安全提示**（钓鱼检测、恶意合约警告）

### 差异化方向
- Rainbow: 面向新手，极简，彩色
- Phantom: 面向 power user，功能密度高
- imToken: 多链 + 安全 + DApp 生态
- Coinbase: 合规 + 法币入口

---

## 三、AI Agent 在钱包中的落地调研

### 现状：行业里 AI + 钱包怎么做的

#### 3.1 真正的 AI Agent 项目

**1. Wayfinder (AI Agent 路由协议)**
- 概念: AI Agent 自动在 DeFi 协议间路由资金，找最优收益
- 技术: LLM + on-chain tool use，agent 可以执行 swap/stake/lend
- 状态: 2024年发布，2025年主网上线
- 启示: Agent 可以不只是"聊天"，可以真正操作链上资产

**2. GRIFFAIN (Solana AI Agent)**
- 概念: 对话式 DeFi agent，用户说"把我的 SOL 分一半去 stake"
- 技术: LLM intent parsing + Solana program calls
- 特点: 真正执行交易，不是建议
- 启示: 自然语言 → 链上操作的完整闭环

**3. Hey Anon (DeFi AI Agent)**
- 概念: "帮我把 USDC 从 ETH 桥到 Base 然后存进 Aave"
- 技术: Multi-step planning + execution
- 特点: 复杂多步骤任务的自动执行
- 启示: 用户不需要知道桥和协议的细节

**4. Slate / Furnish (MCP-based wallet agents)**
- 概念: 用 MCP (Model Context Protocol) 把钱包能力暴露为 tool
- 技术: Wallet functions as MCP tools → LLM can call them
- 特点: 标准化接口，可组合
- 启示: MCP 是把钱包能力 agent 化的标准方式

**5. Coinbase AgentKit**
- 概念: 给 AI agent 提供钱包操作的 SDK
- 技术: LangChain/CrewAI + on-chain actions
- 特点: 任何 LLM 都可以操作钱包
- 启示: Agent 不一定要在钱包前端，可以在后端

#### 3.2 假 AI（目前大多数"AI钱包"的做法）

- **正则匹配**: 你说"买 amazon"，正则提取 amazon，查数据库 → 这就是你现在的做法
- **模板回复**: 预设几个意图，匹配后返回固定文案
- **搜索增强**: 用户输入 → 搜索产品库 → 返回结果，AI 只是个搜索引擎
- **总结**: 这些都不是 agent，只是 pattern matching

#### 3.3 真正的 AI Agent 需要什么

一个**真正的钱包 AI Agent** 需要：

`
用户输入 (自然语言)
    ↓
LLM 理解意图 (不是正则!)
    ↓
LLM 选择 tool (function calling)
    ↓
执行链上/链下操作
    ↓
返回结果 + 确认
`

**关键能力**:
1. **意图理解**: LLM 解析自然语言，不是正则
2. **Tool Use**: 把钱包操作封装为 tool（MCP 或 function calling）
3. **Multi-step**: 能执行多步任务（"桥接 + swap + stake"）
4. **Context**: 记住对话上下文（"刚才那个"= 上一笔交易）
5. **确认机制**: 重要操作必须用户确认（签名、发送）
6. **错误恢复**: 失败了能解释为什么，建议替代方案

#### 3.4 钱包 Agent 的 Tool 清单

`
get_balance(address, chain) → 余额
get_tokens(address, chain) → ERC20 列表
get_nfts(address, chain) → NFT 列表
get_transactions(address, chain, limit) → 交易历史
send_transaction(to, amount, token) → 发送交易
swap(tokenA, tokenB, amount) → swap
bridge(fromChain, toChain, token, amount) → 跨链桥
stake(protocol, amount) → 质押
approve(token, spender, amount) → 授权
search_products(query) → 搜索商品（Bitrefill）
purchase_product(productId, amount) → 购买
estimate_gas(tx) → gas 估算
`

---

## 四、真实部署架构方案

### 从 Demo → 真实钱包的技术路线

#### Phase 1: 测试网真实钱包 (2-3 周)
目标: 在 Sepolia 测试网上跑一个真正可交互的钱包

**需要做的事情**:
1. **钱包核心** (已有 tcx-wasm):
   - ✅ 创建钱包 + 助记词
   - ✅ 导入钱包
   - ✅ 签名
   - 需要: 真实余额查询 (Sepolia RPC)
   - 需要: 真实交易发送
   - 需要: Gas 估算
   - 需要: 交易历史 (从链上读)

2. **UI 大改**:
   - 首页 = 资产总览（不是 tab 切换的 demo）
   - 底部导航: Home / AI / Activity / Settings
   - 发送/接收按钮在首屏
   - 交易历史页面
   - 深色/浅色主题切换

3. **AI Agent V2**:
   - 替换 regex → OpenAI function calling
   - 后端 API route: /api/agent
   - 把钱包操作封装为 function
   - 多轮对话支持
   - 确认机制（重要操作要用户点确认）

4. **部署**:
   - Vercel (已有)
   - 环境变量: RPC URL, OpenAI API Key
   - 域名: 绑定自定义域名

#### Phase 2: 主网就绪 (4-6 周)
目标: 能用真实余额交互

1. **安全加固**:
   - 密码加密存储（IndexedDB + AES）
   - 会话超时
   - 交易确认弹窗
   - 钓鱼检测（检查目标地址）
   - 交易模拟（发送前预览结果）

2. **多链支持**:
   - Ethereum Mainnet
   - Polygon / Arbitrum / Base (L2)
   - 余额查询 + 交易

3. **Swap 集成**:
   - 0x API 或 1inch API
   - 内置 swap 界面

4. **Bitrefill 真实 API**:
   - 替换 mock → 真实 API
   - 需要 API key

#### Phase 3: AI Agent 完全体 (6-8 周)
1. **MCP Server**: 把钱包能力暴露为 MCP tools
2. **Multi-step Agent**: "把 ETH 桥到 Base 然后 swap 成 USDC"
3. **Context Memory**: 对话历史 + 用户偏好
4. **Proactive**: 主动提醒（"你的 gas 很低"、"有空投"）

---

## 五、推荐品牌方向

### 命名建议
- **WalletAI** - 简单直接
- **Agent Wallet** - 突出 AI 特色
- **Copilot Wallet** - 借 Copilot 概念
- **链语** (ChainChat) - 中文品牌

### 视觉方向
- **主色**: 深蓝/紫渐变（参考 Phantom 的专业感）
- **辅色**: 每个链有自己的颜色（ETH=蓝, BTC=橙, SOL=紫）
- **风格**: 毛玻璃 + 深色主题 + 微动画
- **图标**: 简约几何，不要复杂插画

---

## 六、技术栈确认

当前:
- Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui
- @consenlabs/tcx-wasm (Token Core) ← hackathon 必须用
- ethers.js
- Mock Bitrefill

需要增加:
- **AI**: OpenAI API (GPT-4o function calling) 或 Anthropic Claude
- **RPC**: Alchemy / Infura (公共 RPC 限速)
- **Bitrefill**: 真实 API key
- **数据库**: 可选，用 IndexedDB 做本地持久化
- **部署**: Vercel (已有)

---

## 七、行动优先级

| 优先级 | 任务 | 预估时间 |
|--------|------|----------|
| P0 | UI 大改（首页资产总览 + 底部导航） | 2-3天 |
| P0 | 真实余额查询 + 交易发送 | 1-2天 |
| P0 | AI Agent V2 (function calling) | 2-3天 |
| P1 | 交易历史页面 | 1天 |
| P1 | Gas 估算显示 | 0.5天 |
| P1 | 发送/接收流程优化 | 1天 |
| P2 | 多链余额 | 1-2天 |
| P2 | Swap 集成 | 2-3天 |
| P2 | 深色主题 | 1天 |
| P3 | NFT 展示 | 2天 |
| P3 | MCP Server | 3天 |

---

## 八、结论

### 你的钱包和竞品比，差距在哪？
- **UI**: 现在是 demo 级别（tab 切换找功能），需要改成资产总览首页
- **AI**: 现在是 regex（假 AI），需要换成 LLM function calling（真 agent）
- **功能**: 现在是 mock 数据，需要接入真实 RPC 和 API
- **安全**: 现在没有交易确认流程，需要加固

### 你的独特优势是什么？
- **tcx-wasm**: imToken 的 Token Core，安全的钱包核心
- **AI 原生**: 从第一天就设计 AI agent，不是后来加的
- **Bitrefill 集成**: 用 crypto 买真实商品，闭环体验
- **多链**: ETH + BTC + TRON，覆盖主流链

### 一句话总结
> 把 demo 变成真实产品：UI 学 Rainbow 的极简，AI 做真正的 agent（不是 regex），先跑测试网再上主网。
