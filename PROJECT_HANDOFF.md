# imToken AI Agent Wallet — 完整项目交接

> 2026-06-02 整理，发给新 Mac 用

## 一、这是什么项目

**一句话**：一个会陪你过日子的 AI 钱包——它碰巧也能管钱。

**完整版**：
普通钱包只告诉你"你有多少币"。我们想做的是：
- 它知道你今天飞到了东京，自动帮你找附近好吃的
- 提醒你该买西瓜卡了
- 记录你每一笔消费的意义
- 在你不在了之后，按你设定的规则把资产交给你指定的人
- 它是一个**AI 伴侣**，有性格、有记忆、能成长

**竞赛背景**：imToken 十周年 AI 共创黑客松，我们冲 Bitrefill 专享赛道 + 最佳 AI 钱包奖

---

## 二、技术栈

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4
- @consenlabs/tcx-wasm（Token Core，真实钱包引擎）
- ethers.js（链上交互）
- Bitrefill API（礼品卡电商）
- 部署：Vercel

---

## 三、当前状态（2026-06-02）

### ✅ 能正常工作的
- 创建钱包（密码 → keystore → 助记词 → 验证 → 命名）
- 导入钱包（助记词恢复）
- 5 链地址派生（ETH/BTC/TRON 等）
- 消息签名 + 交易签名
- 6 套主题切换（Rainbow/Midnight/Ocean/Sunset/Forest/Cyberpunk）
- AI Agent 性格系统（20 条问候 + 7 种情绪）
- 成就系统（14 个成就 + 4 稀有度 + XP）
- Command Palette（⌘K 快捷键）
- Heritage Wallet（遗产钱包 — Dead Man's Switch）
- Bitrefill 礼品卡商店集成
- Brand Guidelines 品牌规范页
- 21 个路由都有完整 UI 和交互
- `npm run build` 通过，localhost:3000 正常运行

### ⚠️ 已知问题
- Token 价格是 Mock 数据（可接 CoinGecko）
- Swap 费率硬编码
- NFT/DApp 数据是 Mock
- 没有 WalletConnect
- 有 23 个文件有未提交改动（自动化 Agent 产生的，需要清理）
- Brand 页面图片需要验证显示效果

### ❌ 未实现的核心愿景
- **AI 伴侣功能**：生活记录、消费建议、个性化推荐
- **AI 购物**：根据天气/时间/地点推荐该做什么、买什么
- **遗产分割**：智能合约托管，用户失联后自动执行
- **自动化 Agent 开发流程**：24 小时自动跑代码

---

## 四、品牌系统

### 白龙品牌三层结构

**1. 主图标 Primary App Icon**
- 龙头为主（不是全身）
- 深蓝圆角方形底
- 白色龙头 + 金色角
- 少量彩色背刺
- 要适合小尺寸识别

**2. 扩展图标 Extended / Themed Icons**
- 用于主题、活动、收藏感展示
- 可以更梦幻、更活泼
- 必须和主图标是同一只龙

**3. Mascot 全身图**
- 用于 onboarding、成就系统、海报
- 可以保留全身白龙
- 但不是主图标

### 禁止项
- 鼻孔黑点
- 宝宝笑脸
- 满天星作为主图标背景
- 把全身龙硬塞进主图标
- 太多彩色碎片
- 太卡通幼儿化
- 改成别的龙风格

### 品牌图片位置
```
D:\MyProjects\code\imtoken-wallet-demo\public\brand\
├── main-icon.png          # 主图标最终版
├── extended-v2.png        # 扩展图标（高级柔光）
└── extended-v5-flat.png   # 扩展图标（减少幼态）

源文件：
C:\Users\lhhaoshuai\Documents\Codex\2026-05-24\imtoken-ai-agent-wallet-imtoken-10\assets\branding\
```

---

## 五、核心愿景：AI 伴侣 + 钱包

这是我们讨论过的方向，也是这个项目的终极目标：

### 它不是一个工具，它是一个陪伴

| 功能 | 说明 |
|------|------|
| **生活记录** | 记录你的消费习惯、旅行轨迹、喜好变化 |
| **智能提醒** | 知道你在哪、什么时间，提醒你该做什么 |
| **消费建议** | "你在东京，今晚推荐这家店""你在巴黎，该买个伴手礼了" |
| **支付能力** | 不只是看余额，能直接帮你买东西（Bitrefill 礼品卡） |
| **遗产分割** | 你不在了之后，按你设定的规则把资产交给指定的人 |
| **连接万物** | 一个入口，管理你所有的数字资产和生活场景 |

### 为什么这很特别
- 市面上所有钱包都是"你有多少币"的工具
- 我们做的是"它知道你需要什么"的伴侣
- 白龙品牌形象让它有记忆点——不是一个蓝色方块，是一个有性格的守护灵

---

## 六、文件结构

```
imtoken-wallet-demo/
├── src/
│   ├── app/
│   │   ├── page.tsx          # 主页面（~580行，Page + MainApp）
│   │   ├── layout.tsx        # 根布局
│   │   └── globals.css       # Rainbow 主题 + 动画
│   ├── components/
│   │   ├── pages/            # 19 个页面组件
│   │   │   ├── welcome-page.tsx
│   │   │   ├── send-page.tsx
│   │   │   ├── receive-page.tsx
│   │   │   ├── swap-page.tsx
│   │   │   ├── heritage-page.tsx    # 遗产钱包
│   │   │   ├── brand-page.tsx       # 品牌规范页
│   │   │   └── ...（其他 13 个）
│   │   ├── ai-agent.tsx      # AI Agent 性格系统
│   │   ├── achievements.tsx  # 成就系统
│   │   ├── themes.tsx        # 6 套主题
│   │   ├── command-palette.tsx # ⌘K 命令面板
│   │   └── bitrefill/        # 礼品卡商店
│   ├── lib/
│   │   ├── tcx.ts            # Token Core WASM
│   │   ├── prices.ts         # 价格服务（Mock）
│   │   └── bitrefill-api.ts  # Bitrefill API
│   └── types/
│       └── bitrefill.ts
├── public/
│   ├── brand/                # 品牌图片
│   └── tcx_wasm_bg.wasm     # Token Core WASM
├── CLAUDE.md                 # AI 项目指令
├── HANDOFF_CURRENT.md        # 当前状态交接
├── IMPROVEMENT_LOG.md        # 改进日志（16 轮）
├── HERITAGE_PLAN.md          # 遗产钱包技术方案
├── FUTURE.md                 # 未来路线图
└── README.md
```

---

## 七、如何在 Mac 上跑起来

```bash
# 1. 克隆仓库
git clone https://github.com/lh1564803535-code/imtoken-wallet-demo.git
cd imtoken-wallet-demo

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 打开浏览器
# http://localhost:3000
```

需要 Node.js 18+ 和 npm。

---

## 八、给队友看的重点

### 产品的核心竞争力
1. **白龙品牌**：市面上唯一有记忆点的钱包品牌
2. **AI 伴侣定位**：不是工具，是陪伴
3. **支付能力**：不只是看余额，能直接花钱
4. **遗产功能**：解决 20% BTC 因密钥丢失永久锁死的问题

### 技术的核心亮点
1. **Token Core WASM**：真实的钱包引擎，不是 Mock
2. **5 链派生**：一个助记词生成 5 条链的地址
3. **Bitrefill 集成**：真正的礼品卡电商，不是 Mock
4. **Heritage Wallet**：链上 Dead Man's Switch

### 我需要的队友
- 能把 AI 伴侣功能落地的技术搭档
- 或者能帮我把品牌体验做到位的设计师
- 或者能帮我把自动化 Agent 开发流程跑通的工程师

---

## 九、下一步做什么

1. **清理代码**：把 23 个未提交文件检查一遍
2. **验证品牌页**：确认三张图片正常显示
3. **明确方向**：AI 伴侣 vs AI 购物 vs 自动化开发，先做哪个
4. **定好计划**：这次要有明确的里程碑，不能改来改去

---

## 附：品牌 AI Prompt（可直接复制发给其他 AI）

```
Brand system for imToken AI Agent Wallet. THREE layers — do NOT mix:

1. PRIMARY APP ICON: Dragon head only, dark blue rounded square bg, white dragon head, gold horns, few colorful back spines. NO nostril dots, NO baby face, NO starfield.

2. EXTENDED / THEMED ICONS: For themes/events. Can be more dreamy. Same dragon. Don't change core silhouette.

3. MASCOT (Full Body): For onboarding/achievements. Full body white dragon allowed. NOT the main icon.

STRICTLY FORBIDDEN: Nostril black dots, baby face, starfield as main icon bg, full body in main icon, too cartoonish, different dragon style, inventing new brand.
```
