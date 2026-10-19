# 班級飲料訂單

依大茗本位製茶堂中部菜單製作的班級點餐網站，含點餐頁與即時訂單狀況頁。

## Google Sheet 與 Apps Script

1. 在 Google 試算表建立新試算表，命名為 `2026手搖飲點餐記錄`。
2. 在試算表選擇「擴充功能」>「Apps Script」，將本專案根目錄的 `Code.gs` 全文貼入編輯器並儲存。
3. 在 Apps Script 選擇「部署」>「新增部署」，類型選「網頁應用程式」；執行身分選「我」，存取權選「所有人」，完成授權及部署。
4. 複製部署產生的 `/exec` 網址，分別貼入 `app.js` 與 `status.js` 開頭的 `APPS_SCRIPT_URL` 常數。
5. 重新部署 Apps Script 新版本，並將更新後的網站檔案推送到 GitHub Pages。

Apps Script 會自動建立 `2026手搖飲點餐記錄` 工作表分頁與標題列。`doPost` 接收訂單，`doGet` 提供訂單狀況頁讀取資料。

## GitHub Pages

網站網址：

https://Jensen-Huang1.github.io/2026teashop/

GitHub Pages 請設定為由 `main` 分支的根目錄發布。`spec/` 已列入 `.gitignore`，不會推送至 repository。

## 本機預覽

可在專案根目錄啟動任一靜態 HTTP server，再開啟 `index.html`。在填入 Apps Script 部署網址前，網站可預覽選單與即時價格；送單及訂單查詢會提示尚未連線。