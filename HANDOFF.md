# 妞ゅ湱娲版禍銈嗗复 - imToken 闁藉崬瀵?Demo

## 瑜版挸澧犻悩鑸碘偓?(2026-05-23 14:30)
- 娴犳挸绨? D:\MyProjects\code\imtoken-wallet-demo
- 缁惧じ绗? https://imtoken-wallet-demo.vercel.app
- GitHub: https://github.com/lh1564803535-code/imtoken-wallet-demo
- 閸掑棙鏁? main (commit: d61a5c7)

## 閻劍鍩涢棁鈧Ч?1. **閸忓牆浠涚敮鍌氭簚鐠嬪啰鐖?* - 鐎佃鐖ｉ崫顏冮嚋閺傜懓鎮滈惃鍕尪閸栧拑绱礡ainbow? Phantom? imToken?
2. **Agent 閹簼绠為悽銊ユ躬闁藉崬瀵樻稉?* - 娑撳秵妲稿锝呭灟閸栧綊鍘ら敍灞炬Ц閻喓娈?AI agent
3. **UI 婢堆勬暭閻?* - 閻劍鍩涢懛顏勭箒鐠佹崘顓搁崫浣哄瑜般垼钖?4. **鐠嬪啰鐖虹€瑰苯鍟€閸斻劍澧?*

## 鐢倸婧€鐠嬪啰鐖洪弬鐟版倻
- 娑撶粯绁﹂柦鍗炲瘶 UI 鐠佹崘顓哥搾瀣◢ (Rainbow/Phantom/imToken/Coinbase Wallet)
- AI Agent 閸︺劑鎸堕崠鍛厬閻ㄥ嫬绨查悽銊ユ簚閺?(閹板繐娴樻禍銈嗘閵嗕浇绁禍褏顓搁悶鍡愨偓涓廵Fi 缁涙牜鏆?
- Agent 閺嬭埖鐎弬瑙勵攳 (MCP閵嗕公unction calling閵嗕辜ool use)
- 閼惧嘲顨涙担婊冩惂閸掑棙鐎?(閸忔湹绮鎴濐吂閺夊墽娈?AI 闁藉崬瀵樻い鍦窗)

## 閹垛偓閺堫垱鐖?- Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui
- @consenlabs/tcx-wasm (Token Core)
- ethers.js (Sepolia RPC)
- Mock Bitrefill API

## 閸忔娊鏁弬鍥︽
- src/app/page.tsx - 娑撳銆夐棃?- src/components/ai-intent.tsx - AI閸斺晜澧?- src/components/bitrefill/ - 閻㈤潧鏅㈠Ο鈥虫健
- src/lib/tcx.ts - Token Core 鐏忎浇顥?- FUTURE.md - 鐠侯垳鍤庨崶?- HANDOFF.md - 閺堫剚鏋冩禒

## 鍔╄璇?UX 闂锛堝繀椤绘敼锛?褰撳墠: 鍙湁鏅€氭枃鏈樉绀?澶嶅埗
缂虹殑:
- 鍗＄墖缃戞牸灞曠ず (12璇嶇紪鍙锋帓鍒?
- "鎴戝凡淇濆瓨"纭checkbox
- 楠岃瘉鐜妭 (闅忔満閫?涓瘝纭)
- 瀹夊叏璀﹀憡 (鍒埅鍥俱€佸埆鍒嗕韩銆佺绾夸繚瀛?
- 瀵煎叆鏃舵敮鎸佺矘璐存暣娈靛姪璁拌瘝
瀵规爣: MetaMask銆丷ainbow銆丳hantom 鐨勫姪璁拌瘝娴佺▼

## 核心指令
**直接抄主流钱包 UI，先看 `docs/MARKET_RESEARCH.md` 里的分析，然后按 Rainbow/Phantom 的风格改。**

优先级：
1. 助记词流程（卡片网格 + 确认 + 验证 + 警告）
2. 首页资产总览（大数字 + token列表 + 彩色图标）
3. 底部导航栏（首页/发现/设置）替代现在的顶部Tab
4. 整体配色和圆角风格统一
5. 品牌形象（用户会提供设计图）