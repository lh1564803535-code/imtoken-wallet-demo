# imToken AI Agent Wallet — 项目现状交接

> 2026-05-25 整理，供新对话接手

## 项目基本信息

- **目录**：`D:\MyProjects\code\imtoken-wallet-demo\`
- **线上**：https://imtoken-wallet-demo.vercel.app
- **GitHub**：https://github.com/lh1564803535-code/imtoken-wallet-demo
- **技术栈**：Next.js 16 + React 19 + TypeScript + Tailwind CSS 4
- **部署**：Vercel
- **最新 commit**：`a1b7433`（feat: add brand guidelines page）

## 当前状态：能跑，但很乱

### ✅ 能正常工作的
- `npm run build` 通过（TypeScript + 编译 + 静态页面生成）
- `npm run dev` 启动正常，localhost:3000 返回 200
- Hydration 错误已修复（mounted 模式）
- Token Detail index bug 已修复（symbol-based）
- Brand Guidelines 页面已加入（Profile → Brand Guidelines）
- 21 个路由都有 UI 和交互

### ⚠️ 有问题的
1. **后台 Agent 改了很多文件未 commit**（23 个文件有未提交改动），这些改动是之前跑自动化 Agent 时产生的，质量未知
2. **Brand 页面图片可能没正确显示**（需要浏览器验证）
3. **Agent 改了代码但没验证**（比如删了 `ThemeProvider` import、改了变量名等）

### ❌ 未实现的
- Token 价格是 Mock 的
- Swap 费率硬编码
- NFT/DApp 数据是 Mock
- 没有 WalletConnect
- AI 购物方向（天气+时间+本地推荐）未开始
- 自动化 Agent 24 小时开发流程未建立

## 已完成的功能清单（18 轮迭代）

| 功能 | 文件 |
|------|------|
| 创建钱包（密码→keystore→助记词→验证→命名） | create-wallet.tsx |
| 导入钱包（助记词） | import-wallet.tsx |
| 钱包持久化（localStorage） | page.tsx |
| Rainbow 风格 UI + 6 套主题 | themes.tsx |
| 4 Tab 主页（Home/Discover/Activity/Profile） | page.tsx |
| Send 5 步确认流程 | send-page.tsx |
| 真实 QR 码 | qrcode 库 |
| Heritage Wallet（Dead Man's Switch） | heritage-page.tsx |
| AI Agent 性格系统（20 条问候 + 7 种情绪） | ai-agent.tsx |
| 成就系统（14 个成就 + 4 稀有度 + XP） | achievements.tsx |
| Command Palette（⌘K） | command-palette.tsx |
| Bitrefill 礼品卡商店 | bitrefill/ShopTab.tsx |
| Brand Guidelines 品牌规范页 | brand-page.tsx（新增） |
| 21 个路由全部有返回按钮 | 各 page 组件 |

## 品牌系统

三层结构，不要混用：
1. **主图标**：龙头为主，深蓝底，白龙头，金角，少量彩色背刺
2. **扩展图标**：主题/活动用，可以更梦幻，但同一只龙
3. **Mascot**：全身白龙，用于 onboarding/成就/海报

图片位置：`public/brand/`（main-icon.png, extended-v2.png, extended-v5-flat.png）
源文件位置：`C:\Users\lhhaoshuai\Documents\Codex\2026-05-24\imtoken-ai-agent-wallet-imtoken-10\assets\branding\`

## 关键文件结构

```
src/
├── app/
│   ├── page.tsx          # 主页面（~580行，Page + MainApp 两个组件）
│   ├── layout.tsx        # ToastProvider + ThemeProvider + ErrorBoundary
│   └── globals.css       # Rainbow 主题 + 动画
├── components/
│   ├── pages/            # 19 个页面组件（含 brand-page.tsx）
│   ├── bitrefill/        # 礼品卡商店相关
│   ├── ai-agent.tsx      # AI Agent 性格
│   ├── achievements.tsx  # 成就系统
│   ├── themes.tsx        # 6 套主题
│   └── ...               # 其他组件
├── lib/
│   ├── tcx.ts            # Token Core WASM
│   ├── prices.ts         # Mock 价格服务
│   └── bitrefill-api.ts  # Bitrefill API
└── types/
    └── bitrefill.ts      # 类型定义
```

## 建议下一步

1. **先清理**：把后台 Agent 改的 23 个未 commit 文件检查一遍，有用的 commit，没用的 revert
2. **明确目标**：这个项目到底要做什么？黑客松参赛？产品 demo？品牌展示？
3. **定好优先级**：品牌展示 vs AI 购物 vs 自动化开发，只能先做一个
4. **用子 Agent 并行**：明确任务后直接做，不反复确认

## 品牌规范 AI Prompt（可直接复制）

```
This is the brand system for imToken AI Agent Wallet. There are THREE layers — do NOT mix them:

1. PRIMARY APP ICON - Dragon head only, dark blue rounded square bg, white dragon head, gold horns, few colorful back spines. NO nostril dots, NO baby face, NO starfield.
2. EXTENDED / THEMED ICONS - For themes/events. Can be more dreamy. Same dragon.
3. MASCOT (Full Body) - For onboarding/achievements. Full body white dragon allowed. NOT the main icon.

STRICTLY FORBIDDEN: Nostril black dots, baby face, starfield as main icon bg, full body in main icon, too cartoonish, different dragon style, inventing new brand.
```
