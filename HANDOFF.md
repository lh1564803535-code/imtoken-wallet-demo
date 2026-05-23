# 项目交接 - imToken 钱包 Demo

## 当前状态 (2026-05-23 14:30)
- 仓库: D:\MyProjects\code\imtoken-wallet-demo
- 线上: https://imtoken-wallet-demo.vercel.app
- GitHub: https://github.com/lh1564803535-code/imtoken-wallet-demo
- 分支: main (commit: d61a5c7)

## 用户需求
1. **先做市场调研** - 对标哪个方向的钱包？Rainbow? Phantom? imToken?
2. **Agent 怎么用在钱包上** - 不是正则匹配，是真的 AI agent
3. **UI 大改版** - 用户自己设计品牌形象
4. **调研完再动手**

## 市场调研方向
- 主流钱包 UI 设计趋势 (Rainbow/Phantom/imToken/Coinbase Wallet)
- AI Agent 在钱包中的应用场景 (意图交易、资产管理、DeFi 策略)
- Agent 架构方案 (MCP、function calling、tool use)
- 获奖作品分析 (其他黑客松的 AI 钱包项目)

## 技术栈
- Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui
- @consenlabs/tcx-wasm (Token Core)
- ethers.js (Sepolia RPC)
- Mock Bitrefill API

## 关键文件
- src/app/page.tsx - 主页面
- src/components/ai-intent.tsx - AI助手
- src/components/bitrefill/ - 电商模块
- src/lib/tcx.ts - Token Core 封装
- FUTURE.md - 路线图
- HANDOFF.md - 本文件