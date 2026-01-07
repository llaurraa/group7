# 霓虹煉金實驗室 (Neon Alchemy Lab)

一個使用 Google Gemini AI 的互動式霓虹風格實驗室應用程式。

## 功能特點

- 🎨 霓虹賽博朋克風格介面
- 🤖 整合 Google Gemini AI API
- ⚛️ 使用 React 19 和 TypeScript
- ⚡ Vite 快速開發環境

## 本地運行

**前置需求:** Node.js (建議 18.x 或更高版本)

1. 安裝依賴：
   ```bash
   npm install
   ```

2. 設定環境變數：
   - 複製 `.env.example` 為 `.env.local`
   - 在 `.env.local` 中設定你的 Gemini API 金鑰
   - 從這裡取得 API 金鑰：https://aistudio.google.com/app/apikey

3. 啟動開發伺服器：
   ```bash
   npm run dev
   ```

4. 在瀏覽器中打開顯示的本地網址（通常是 `http://localhost:5173`）

## 建置部署

建置生產版本：
```bash
npm run build
```

預覽生產版本：
```bash
npm run preview
```

## 技術棧

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Google Gemini AI
- Lucide React (圖標庫)

## 注意事項

- 請勿將 `.env.local` 檔案提交到 Git 倉庫
- API 金鑰應保密，不要分享給他人
