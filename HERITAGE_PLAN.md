# Heritage Wallet 可行性计划书

## 一、问题定义

**核心问题**: 如果钱包持有者失联（意外/死亡/密钥丢失），其加密资产将永久锁死，无法被继承人获取。

**统计数据**: 约 20% 的 BTC（约 $200B+）被认为因密钥丢失而永久锁死。

---

## 二、行业现有方案调研

| 方案 | 机制 | 评分 | 成本 | 缺陷 |
|------|------|------|------|------|
| **律师/纸质** | 助记词写纸上给律师 | F- | $1000+ | 律师可被收买、文件可丢失 |
| **Casa** | 3/5 多签 | B+ | $250/年 | 需KYC、半托管、依赖公司存活 |
| **Sarcophagus** | Arweave加密存储+考古学家节点 | C | Gas+SARCO代币 | 复杂度过高、代币经济依赖 |
| **Inheriti** | 专利硬件分片 | C+ | 付费 | 闭源、不可审计 |
| **Deadhand** | Shamir分片+心跳检测 | B | 免费 | 需服务器(非完全去中心化) |
| **Dead-Man-Switch-Contracts** | Solidity checkIn/triggerSwitch | B | Gas费 | 仅支持单链 |

---

## 三、技术方案选择

### 推荐方案：链上 Dead Man's Switch + UI层

**理由**:
1. **纯链上** — 不依赖服务器存活，不依赖代币经济
2. **简单可靠** — 只有3个核心函数：deposit / checkIn / triggerSwitch
3. **已有参考** — Dead-Man-Switch-Contracts 的 Solidity 实现可直接参考
4. **与现有架构兼容** — 项目已有 tcx-wasm 钱包签名能力

### 核心智能合约设计

```
HeritageWallet.sol
├── deposit() — 存入ETH/ERC-20
├── addBeneficiary(address, share%) — 添加受益人及分配比例
├── checkIn() — 心跳确认（重置计时器）
├── triggerSwitch() — 受益人调用，超时后领取资产
├── updateTimeout(uint256) — 更新超时时间
├── getBalance() — 查询托管余额
└── Events: Deposited, BeneficiaryAdded, CheckedIn, Triggered
```

### 关键参数
- **默认超时**: 90天（可配置 30天-365天）
- **宽限期**: 超时后7天内 owner 仍可 checkIn 取消
- **支持资产**: ETH + 任意 ERC-20
- **多受益人**: 支持按百分比分配

---

## 四、Demo层实现（前端）

**无需部署真实合约的 Demo 方案**:

由于这是钱包 demo（非生产环境），我们可以：

1. **UI 完整实现** — 所有页面交互真实可操作
2. **合约逻辑用 TypeScript 模拟** — 在本地模拟 deposit/checkIn/triggerSwitch 状态机
3. **预留合约接口** — 代码结构设计为可直接对接真实合约

### 需要新增的页面/组件

```
src/components/heritage/
├── HeritageDashboard.tsx     — 遗产钱包主页(总览+状态)
├── AddBeneficiary.tsx        — 添加受益人表单
├── DepositToHeritage.tsx     — 存入资产
├── HeritageSettings.tsx      — 超时设置、宽限期
├── BeneficiaryClaim.tsx      — 受益人领取页面
└── HeartbeatIndicator.tsx    — 心跳状态指示器
```

### 需要新增的逻辑

```
src/lib/heritage.ts           — 遗产钱包状态管理(模拟合约)
src/hooks/useHeritage.ts      — React hook for heritage state
```

---

## 五、可执行性评估

| 维度 | 评估 | 说明 |
|------|------|------|
| **技术可行性** | ✅ 完全可行 | Solidity 合约成熟、前端无难点 |
| **Demo可行性** | ✅ 完全可行 | TypeScript 模拟合约状态即可 |
| **真实部署可行性** | ✅ 可行 | 需 Hardhat/Foundry + 测试网部署 |
| **安全性** | ⚠️ 需审计 | 合约涉及资产托管，生产需审计 |
| **时间成本** | Demo 2-3小时 | 完整合约+测试 1-2天 |
| **依赖** | 无新增依赖 | 利用现有 ethers.js + tcx-wasm |

---

## 六、执行计划

### Phase 1: 遗产钱包核心功能（当前）
1. 创建 heritage.ts 状态管理（模拟合约逻辑）
2. 实现 HeritageDashboard 主页
3. 实现 AddBeneficiary + DepositToHeritage
4. 实现 HeartbeatIndicator（checkIn UI）
5. 实现 BeneficiaryClaim（triggerSwitch UI）
6. 集成到现有 app 路由

### Phase 2: 智能合约（后续）
1. 编写 HeritageWallet.sol
2. Hardhat 测试
3. 测试网部署
4. 前端对接真实合约

---

## 七、结论

**完全可执行**。方案成熟度高，技术栈与现有项目完全兼容，Demo 层无需新依赖。建议直接开始 Phase 1。
