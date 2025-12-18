# 霓虹煉金實驗室 (Neon Alchemy Lab)

一個使用 React + TypeScript + Vite 開發的互動式煉金實驗室遊戲，整合 Google Gemini AI 提供智能提示。

## 功能特色

- 🧪 互動式元素合成系統
- 🤖 AI 智能提示功能
- 🎨 賽博龐克霓虹風格介面
- 📊 即時狀態追蹤
- 💾 自動保存進度

## 技術棧

- **框架**: React 19.2.1
- **語言**: TypeScript 5.8
- **建置工具**: Vite 6.2
- **AI 整合**: Google Gemini API
- **UI**: Tailwind CSS + Lucide Icons

## 本地運行

### 前置要求

- Node.js (建議 v18 或更高版本)
- npm 或 yarn

### 安裝步驟

1. **克隆專案**
   ```bash
   git clone <your-repo-url>
   cd group7
   ```

2. **安裝依賴**
   ```bash
   npm install
   ```

3. **設定環境變數**

   編輯 `.env.local` 文件，填入你的 Gemini API Key：
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

   獲取 API Key: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

4. **啟動開發伺服器**
   ```bash
   npm run dev
   ```

   應用程式將在 `http://localhost:3000` 運行

## 建置部署

### 建置生產版本

```bash
npm run build
```

建置後的文件會在 `dist` 目錄中。

### 預覽生產版本

```bash
npm run preview
```

## GitHub Pages 部署

1. 確保所有更改已提交到 Git
2. 推送到 GitHub:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

3. 在 GitHub repository 設定中啟用 GitHub Pages
4. 選擇部署來源（建議使用 GitHub Actions）

## 專案結構

```
group7/
├── components/          # React 組件
│   ├── InventoryPanel.tsx
│   ├── KnowledgePanel.tsx
│   ├── ReactorPanel.tsx
│   ├── RulesModal.tsx
│   └── StatusPanel.tsx
├── services/           # 服務層
│   └── geminiService.ts
├── App.tsx            # 主應用組件
├── constants.tsx      # 常數定義
├── types.ts          # TypeScript 類型定義
├── index.tsx         # 應用入口
├── index.html        # HTML 模板
├── vite.config.ts    # Vite 配置
└── package.json      # 專案配置

```

## 開發說明

- 使用 TypeScript 進行類型安全的開發
- 組件採用函數式組件和 React Hooks
- 狀態管理使用 React 內建的 useState 和 useEffect
- AI 功能整合 Google Gemini API

## 注意事項

⚠️ **重要**:
- 不要將 `.env.local` 文件提交到 Git（已在 .gitignore 中排除）
- 確保 API Key 安全，不要公開分享
- 建議在生產環境使用環境變數管理 API Key

## 授權

本專案僅供學習和研究使用。
