# Token Core Multi-Chain Browser Wallet

> 浏览器端零服务器多链钱包：一个助记词派生 ETH、BTC、TRON 五条链，全部在本地通过 WASM 完成。

**在线体验**：https://imtoken-wallet-demo.vercel.app

---

## 这是什么

一个完全在浏览器本地运行的多链钱包 Demo，基于 imToken Token Core (tcx-wasm)。

- 零服务器：所有密码学运算在浏览器本地完成
- 零插件：不需要安装任何浏览器扩展
- 零信任：私钥不离开你的设备

## 核心功能

| 功能 | 说明 |
|------|------|
| 多链钱包 | 一套助记词派生 ETH、BTC（Legacy/SegWit/Taproot）、TRON 共 5 种地址 |
| 消息签名 | ETH PersonalSign，证明你控制私钥 |
| 交易签名 | 离线构造 ETH 转账并签名，支持 Mainnet/Sepolia 切换 |
| 跨链证明 | 一条签名证明你拥有所有 5 条链的地址 |
| Keystore | 查看加密参数、暴力破解估算、下载 Keystore 文件 |
| AI 助手 | 自然语言驱动操作（"Show my ETH address"、"Buy $50 Amazon card"） |
| 礼品卡商店 | Bitrefill 集成，浏览 180+ 国家礼品卡，AI 对话式购买 |

## 快速体验（3 分钟）

1. 打开 https://imtoken-wallet-demo.vercel.app
2. **Create** 标签 → 输入密码 → 创建钱包
3. 查看 5 链地址 + 助记词
4. **Sign** 标签 → 签名消息 → 离线交易签名
5. **Shop** 标签 → 浏览礼品卡 → 模拟购买
6. 页面顶部 AI 助手 → 输入 "Show my ETH address"

## 技术栈

- Next.js 16 + React 19 + TypeScript + Tailwind CSS 4
- @consenlabs/tcx-wasm（imToken Token Core WebAssembly 版）
- shadcn/ui + lucide-react
- Web Crypto API（AES-GCM 加密）+ ethers.js（签名验证）
- Vercel 部署

## 安全说明

- 私钥只存在浏览器内存中，刷新即消失
- 所有签名在本地完成，不经过任何服务器
- Keystore 使用 PBKDF2 × 600,000 轮加密
- 礼品卡使用 AES-GCM 加密后存入 localStorage

## 开发

```bash
git clone https://github.com/lh1564803535-code/imtoken-wallet-demo.git
cd imtoken-wallet-demo
npm install
npm run dev
```

## License

MIT

---

*imToken 10th Anniversary Hackathon · Powered by Token Core (tcx-wasm)*
