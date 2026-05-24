# HeritageVault 智能合约设计

## 核心功能

### 1. 合约接口

`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IHeritageVault {
    // 存款
    function deposit() external payable;
    
    // 添加受益人
    function addBeneficiary(
        address beneficiary,
        uint256 amountPerCycle,
        uint256 cycleDuration,
        uint256 totalCycles
    ) external returns (uint256 beneficiaryId);
    
    // 受益人领取
    function claim(uint256 beneficiaryId) external;
    
    // 紧急提取 (owner only)
    function emergencyWithdraw() external;
    
    // 查询
    function getBeneficiaryInfo(uint256 beneficiaryId) external view returns (
        address beneficiary,
        uint256 amountPerCycle,
        uint256 cycleDuration,
        uint256 totalCycles,
        uint256 lastClaimTime,
        uint256 claimedCycles
    );
    
    function getVaultBalance() external view returns (uint256);
}
`

### 2. 数据结构

`solidity
struct Beneficiary {
    address beneficiary;      // 受益人地址
    uint256 amountPerCycle;   // 每周期金额 (wei)
    uint256 cycleDuration;    // 周期时长 (秒)
    uint256 totalCycles;      // 总周期数
    uint256 lastClaimTime;    // 上次领取时间
    uint256 claimedCycles;    // 已领取周期数
    bool active;              // 是否激活
}

struct Vault {
    address owner;            // 所有者
    uint256 balance;          // 总余额
    uint256 beneficiaryCount; // 受益人数量
    mapping(uint256 => Beneficiary) beneficiaries; // 受益人映射
    bool locked;              // 是否锁定
}
`

### 3. 安全机制

1. **重入保护**: 使用 ReentrancyGuard
2. **时间锁**: 紧急提取需等待24小时
3. **余额检查**: claim前检查合约余额
4. **事件日志**: 所有操作emit事件

### 4. 示例场景

`solidity
// 场景1: 每月给孩子0.1 ETH
addBeneficiary(
    childAddress,
    0.1 ether,      // 每月0.1 ETH
    30 days,        // 30天一个周期
    120             // 120个月 = 10年
);

// 场景2: 每季度给父母0.5 ETH
addBeneficiary(
    parentAddress,
    0.5 ether,
    90 days,
    40              // 40个季度 = 10年
);
`

---

## 前端UI设计 (参考Rainbow/Phantom)

### 首页布局

`
┌─────────────────────────────────┐
│  [,345.67]  ← 总资产大数字    │
│  +0.5% (24h)                   │
├─────────────────────────────────┤
│  ETH  ,345.67  0.5 ETH  ↑    │
│  BTC  ,000.00 0.001 BTC ↑   │
│  TRX  .00   500 TRX   ↓   │
├─────────────────────────────────┤
│  [遗产钱包]  ← 新增tab          │
│  ├── 儿子: 0.1 ETH/月 ⏳        │
│  ├── 父母: 0.5 ETH/季度 ⏳      │
│  └── + 添加受益人               │
├─────────────────────────────────┤
│  [AI 助手]                      │
│  "帮我设置每月给儿子0.1 ETH"    │
├─────────────────────────────────┤
│  🏠 Home  |  🔍 Discover  |  👤 │
└─────────────────────────────────┘
`

### AI Agent 对话流程

`
用户: "帮我设置每月给儿子0.1 ETH"
  ↓
AI: "好的，请确认以下信息：
     受益人: 0x1234...5678
     每月金额: 0.1 ETH
     持续时间: 10年
     是否确认?"
  ↓
用户: [确认]
  ↓
AI: "正在创建遗产计划..."
  ↓
[调用智能合约]
  ↓
AI: "✅ 已创建成功！你的儿子将每月收到0.1 ETH"
`

---

## 技术实现路线

### Phase 1: 智能合约 (1周)

- [ ] HeritageVault.sol 合约开发
- [ ] 单元测试 (Hardhat/Foundry)
- [ ] Sepolia 测试网部署
- [ ] 合约验证 (Etherscan)

### Phase 2: 前端集成 (1周)

- [ ] 遗产钱包UI组件
- [ ] 受益人管理界面
- [ ] 合约交互hooks
- [ ] 交易确认流程

### Phase 3: AI Agent集成 (1周)

- [ ] 小米MiMo LLM集成
- [ ] 遗产管理意图解析
- [ ] 多轮对话支持
- [ ] 确认机制

### Phase 4: 测试与优化 (1周)

- [ ] 端到端测试
- [ ] UI/UX优化
- [ ] 安全审计
- [ ] 部署上线

---

## 需要的资源

1. **智能合约开发**: Solidity 0.8.20+, Hardhat
2. **前端**: React, ethers.js v6, shadcn/ui
3. **AI**: 小米MiMo API
4. **部署**: Sepolia RPC, Vercel

---

*设计完成于 2026-05-23*
