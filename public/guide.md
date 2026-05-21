# imToken Wallet Demo — 使用指南

> 一个完全在浏览器本地运行的多链钱包演示，无需安装任何软件。

---

## 🚀 快速开始（3 分钟上手）

### 第一步：创建钱包

1. 打开网站 https://imtoken-wallet-demo.vercel.app
2. 点击顶部的 **Create** 标签
3. 输入一个密码（至少 6 位），点击 **Create Wallet**
4. 等待 2-3 秒，钱包创建完成！

创建成功后你会看到：
- ✅ 一个 12 词的助记词（Secret Recovery Phrase）
- ✅ 5 条链的地址（ETH、BTC Legacy、BTC SegWit、BTC Taproot、TRON）

> ⚠️ **重要**：点击眼睛图标查看助记词，点击复制按钮备份。真实使用时，助记词是你唯一的资产恢复方式。

---

### 第二步：验证跨链所有权

1. 在 Create 页面底部，找到 **Cross-Chain Ownership Proof** 区域
2. 点击 **Generate Cross-Chain Proof**
3. 系统会用你的 ETH 私钥签名一条包含所有 5 链地址的消息
4. 点击 **Verify Signature** 验证签名有效性

这证明了：一个助记词控制所有 5 条链的地址，纯密码学证明，无需第三方。

---

### 第三步：签名消息

1. 点击 **Sign** 标签
2. 在 "Sign Message" 区域输入任意文字，比如 `Hello imToken`
3. 点击 **Sign Message**
4. 得到一个 0x 开头的签名，可以复制分享

---

### 第四步：离线交易签名

1. 在 Sign 页面下方，找到 **Offline Transaction Signing**
2. 选择网络（Ethereum Mainnet 或 Sepolia 测试网）
3. 填写收款地址、金额、Gas Limit
4. 点击 **Sign Transaction**
5. 得到签名后的原始交易数据

> 💡 这只是签名，不会真正发送交易。你可以把签名结果拿到任何以太坊节点广播。

---

### 第五步：导入已有钱包

1. 点击 **Import** 标签
2. 输入你的 12 词助记词（空格分隔）
3. 设置一个加密密码
4. 点击 **Restore Wallet**
5. 系统会恢复你的所有链地址

---

### 第六步：安全信息

1. 点击 **Security** 标签
2. 查看暴力破解估算：PBKDF2 × 600,000 轮，破解需要约 24 亿年
3. 查看 Keystore 加密参数（AES-128-CTR）
4. 点击 **Download Keystore** 下载加密后的钱包文件

---

## 🛒 礼品卡商店（Shop）

### 浏览商品

1. 点击 **Shop** 标签（带 NEW 红色标记）
2. 顶部可以切换国家（中国/美国/全部）
3. 可以按品类筛选（电商、餐饮、游戏、话费、娱乐）
4. 支持关键词搜索

### 购买礼品卡

1. 点击任意商品卡片进入详情
2. 选择面值（如 ¥100、$50）
3. 选择支付链（ETH / BTC / TRX）
4. 点击 **Buy** 按钮
5. 弹出确认窗口，显示：商品名、金额、crypto 价格、收款地址
6. 点击 **Confirm & Sign** — 系统调用 Token Core 签名交易
7. 等待 2 秒模拟支付成功
8. 🎉 获得礼品卡券码！

> 💡 Demo 模式下交易不会真正广播，券码是模拟生成的。

### 管理已购礼品卡

1. 在 Shop 页面点击 **My Cards** 按钮
2. 查看所有已购礼品卡（按时间倒序）
3. 点击复制按钮一键复制券码
4. 支持删除和导出（JSON 格式）

---

## 🤖 AI 助手

点击页面顶部的 **AI Wallet Assistant** 展开对话框。

### 支持的指令

| 你说的话 | AI 做什么 |
|---------|----------|
| "Show my ETH address" | 跳转到 Create 页显示地址 |
| "Prove I own all chains" | 生成跨链所有权证明 |
| "Sign a message" | 跳转到 Sign 页 |
| "Export my keystore" | 跳转到 Security 页 |
| "Buy $50 Amazon gift card" | 跳转到 Shop 搜索匹配商品 |
| "充值 100 元话费" | 跳转到 Shop 搜索话费产品 |
| "Show my gift cards" | 显示已购礼品卡 |

也可以点击下方的快捷建议按钮。

---

## 🔐 安全说明

| 特性 | 说明 |
|------|------|
| 密钥生成 | 浏览器本地 WebAssembly 生成，不经过任何服务器 |
| 加密算法 | PBKDF2 × 600,000 轮 + AES-128-CTR |
| 助记词 | 只存在你的浏览器内存中，刷新即消失 |
| 签名 | 本地 Token Core (tcx-wasm) 完成，私钥不离开浏览器 |
| 礼品卡存储 | AES-GCM 加密后存入 localStorage |
| 网络请求 | 零。所有操作纯本地完成 |

---

## ❓ 常见问题

**Q: 刷新页面后钱包还在吗？**
A: 不在。钱包数据只存在内存中，刷新即消失。请务必备份助记词。已购礼品卡存在 localStorage 中会保留。

**Q: 可以用真实资产吗？**
A: 这是演示项目，建议只用于学习和测试。签名的交易不会自动广播。

**Q: 支持哪些链？**
A: ETH（Mainnet/Sepolia）、BTC（Legacy/SegWit/Taproot）、TRON。

**Q: 礼品卡是真的吗？**
A: Demo 模式下是模拟数据。如果配置了 Bitrefill API Key，可以连接真实服务。

---

## 🏗️ 技术栈

- **前端**：Next.js 16 + React 19 + TypeScript + Tailwind CSS 4
- **钱包内核**：@consenlabs/tcx-wasm（imToken Token Core WebAssembly 版）
- **UI 组件**：shadcn/ui + lucide-react
- **部署**：Vercel（自动部署）
- **加密**：Web Crypto API（AES-GCM）+ ethers.js（签名验证）

---

*Powered by Token Core (tcx-wasm) · imToken 10th Anniversary Hackathon*
