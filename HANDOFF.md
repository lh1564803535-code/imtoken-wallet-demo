# 椤圭洰浜ゆ帴 - imToken 閽卞寘 Demo

## 褰撳墠鐘舵€?(2026-05-23 14:30)
- 浠撳簱: D:\MyProjects\code\imtoken-wallet-demo
- 绾夸笂: https://imtoken-wallet-demo.vercel.app
- GitHub: https://github.com/lh1564803535-code/imtoken-wallet-demo
- 鍒嗘敮: main (commit: d61a5c7)

## 鐢ㄦ埛闇€姹?1. **鍏堝仛甯傚満璋冪爺** - 瀵规爣鍝釜鏂瑰悜鐨勯挶鍖咃紵Rainbow? Phantom? imToken?
2. **Agent 鎬庝箞鐢ㄥ湪閽卞寘涓?* - 涓嶆槸姝ｅ垯鍖归厤锛屾槸鐪熺殑 AI agent
3. **UI 澶ф敼鐗?* - 鐢ㄦ埛鑷繁璁捐鍝佺墝褰㈣薄
4. **璋冪爺瀹屽啀鍔ㄦ墜**

## 甯傚満璋冪爺鏂瑰悜
- 涓绘祦閽卞寘 UI 璁捐瓒嬪娍 (Rainbow/Phantom/imToken/Coinbase Wallet)
- AI Agent 鍦ㄩ挶鍖呬腑鐨勫簲鐢ㄥ満鏅?(鎰忓浘浜ゆ槗銆佽祫浜х鐞嗐€丏eFi 绛栫暐)
- Agent 鏋舵瀯鏂规 (MCP銆乫unction calling銆乼ool use)
- 鑾峰浣滃搧鍒嗘瀽 (鍏朵粬榛戝鏉剧殑 AI 閽卞寘椤圭洰)

## 鎶€鏈爤
- Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui
- @consenlabs/tcx-wasm (Token Core)
- ethers.js (Sepolia RPC)
- Mock Bitrefill API

## 鍏抽敭鏂囦欢
- src/app/page.tsx - 涓婚〉闈?- src/components/ai-intent.tsx - AI鍔╂墜
- src/components/bitrefill/ - 鐢靛晢妯″潡
- src/lib/tcx.ts - Token Core 灏佽
- FUTURE.md - 璺嚎鍥?- HANDOFF.md - 鏈枃浠

## 助记词 UX 问题（必须改）
当前: 只有普通文本显示+复制
缺的:
- 卡片网格展示 (12词编号排列)
- "我已保存"确认checkbox
- 验证环节 (随机选3个词确认)
- 安全警告 (别截图、别分享、离线保存)
- 导入时支持粘贴整段助记词
对标: MetaMask、Rainbow、Phantom 的助记词流程