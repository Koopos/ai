# Solana Pet Game - 加密宠物养成游戏

一个基于 Solana 的 NFT 宠物养成游戏。

## 功能

- 🐾 铸造随机宠物 NFT (不同稀有度和属性)
- 🍖 喂食宠物提升属性
- 💕 繁殖宠物产生后代
- ⚔️ 宠物战斗系统
- 🏪 宠物市场交易

## 技术栈

- **Solana**: 使用 Anchor 框架开发智能合约
- **Next.js**: 前端框架
- **@solana/web3.js**: Solana JavaScript SDK
- **@solana/wallet-adapter**: 钱包连接

## 快速开始

### 安装依赖

```bash
# 安装 Anchor CLI (如果未安装)
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest

# 构建 Solana 程序
cd programs/pet-nft
anchor build

# 安装前端依赖
cd ../../app
npm install
```

### 本地开发

```bash
# 启动本地 Solana 验证器
solana-test-validator

# 部署程序
anchor deploy

# 启动前端
cd app
npm run dev
```

## 游戏玩法

1. 连接 Solana 钱包 (Phantom/Solflare)
2. 铸造一只随机宠物
3. 喂食、训练提升属性
4. 繁殖获得新宠物
5. 与其他玩家宠物战斗
