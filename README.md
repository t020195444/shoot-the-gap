# 🐉 Shoot the Gap - 射龍門小遊戲

一款多人即時 WebSocket 射龍門遊戲，由 Next.js + Node.js + Socket.IO 打造。

🌐 遊戲網址：https://shoot-the-gap.vercel.app/

## 🎮 遊戲玩法

1. 輸入你的暱稱並加入遊戲
2. 發出兩張牌，下注是否會中間出現第三張牌
3. 若第三張在兩張之間 ➜ 贏錢！
4. 贏了會加分，排行榜即時更新 🏆

## ⚙️ 技術棧

- Next.js + TypeScript（前端）
- Express + Socket.IO（後端）
- WebSocket 即時同步
- 部署：Vercel（前端）+ Cloud Run（後端）

## 📦 使用方法（本地）

```bash
git clone https://github.com/你的帳號/shoot-the-gap.git
cd shoot-the-gap
cd frontend
npm install
npm run dev
