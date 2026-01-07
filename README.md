# 霓虹煉金實驗室 (Neon Alchemy Lab)

一個霓虹賽博朋克風格的化學元素合成遊戲，使用 React 打造的互動式煉金實驗室。

## 🎮 線上遊玩

**最簡單的方式：** 直接在瀏覽器中打開 `standalone.html` 文件即可開始遊玩！

或者訪問 GitHub Pages 部署版本：`https://你的用戶名.github.io/霓虹煉金實驗室/standalone.html`

## ✨ 功能特點

- 🎨 霓虹賽博朋克風格介面
- ⚗️ 元素合成系統 - 混合不同元素創造新物質
- 💎 稀有度系統 - 從普通到傳奇的元素收集
- 📦 元素庫存管理
- ⚡ 資源管理系統（能量、洞察力、創造力）
- 🎯 無需安裝、無需構建，開箱即用

## 🎯 遊戲玩法

1. **選擇元素** - 從庫存中點擊元素添加到反應爐（最多 3 個插槽）
2. **啟動反應** - 至少選擇 2 個元素後點擊「啟動反應」
3. **收集新元素** - 成功的反應會產生新的化合物
4. **管理資源** - 每次反應消耗能量，成功則獲得洞察力和創造力

### 基礎配方示例

- **氫 + 氧** = 水 (H₂O)
- **碳 + 氧** = 二氧化碳 (CO₂)
- **氫 + 碳** = 甲烷 (CH₄)
- **碳 + 鐵** = 鋼鐵
- **鐵 + 氧** = 氧化鐵

探索更多組合，發現隱藏的稀有元素！

## 🚀 使用方式

### 方式一：直接運行（推薦）

1. 下載或克隆此倉庫
2. 用瀏覽器打開 `standalone.html`
3. 開始遊玩！

### 方式二：部署到 GitHub Pages

1. 將倉庫推送到 GitHub
2. 在倉庫設定中啟用 GitHub Pages
3. 選擇主分支作為來源
4. 訪問 `https://你的用戶名.github.io/倉庫名/standalone.html`

### 方式三：本地開發（需要 Node.js）

如果你想修改源碼並使用開發工具：

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建置生產版本
npm run build
```

## 📁 檔案說明

- `standalone.html` - 獨立運行版本（推薦用於直接遊玩和 GitHub Pages 部署）
- `index.html` - Vite 開發版本入口
- `App.tsx` - 主應用程式組件
- `components/` - React 組件
- `services/` - 遊戲邏輯服務
- `types.ts` - TypeScript 類型定義
- `constants.tsx` - 遊戲常數和配方數據

## 🛠 技術棧

- React 18/19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (圖標庫)
- ES Modules (透過 CDN)

## 📝 授權

此專案僅供學習和娛樂使用。

## 🎮 開始遊玩吧！

打開 `standalone.html`，開始你的煉金之旅！
