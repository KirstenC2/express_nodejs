# Express Node.js Kafka & MySQL 全端範例

## 簡介
本專案是一個基於 Express.js 的 Node.js 應用，結合 Kafka 訊息佇列與 MySQL 資料庫，並提供簡易的 Web UI 進行 Kafka 訊息發送與資料庫 CRUD 操作。

## 功能
- Kafka 訊息發送與消費（Producer/Consumer）
- MySQL 使用者資料 CRUD（建立、查詢、刪除）
- EJS 模板渲染 Web UI
- Docker Compose 一鍵啟動所有服務

## 專案結構
```
express_nodejs/
├── compose.yaml                # Docker Compose 配置
├── Dockerfile                  # 應用 Docker 映像建置檔
├── index.js                    # Express 應用進入點
├── package.json                # Node.js 專案描述與依賴
├── .env                        # 環境變數設定
├── config/
│   └── config.js               # 統一設定管理 (含資料庫連線等)
├── controllers/
│   ├── homeController.js       # 首頁控制器
│   ├── kafkaController.js      # Kafka 訊息控制器
│   └── userController.js       # 使用者資料控制器
├── middleware/
│   ├── logger.js               # log
├── models/
│   ├── homeModel.js            # 首頁資料模型（範例）
│   └── userModel.js            # 使用者資料模型
├── repositories/
│   └── userRepository.js       # 使用者資料存取層
├── routes/
│   ├── index.js                # 主路由
│   └── kafka.js                # Kafka 相關路由
├── service/
│   ├── db.js                   # MySQL 資料庫連線池
│   ├── initdb.js               # 啟動時自動建立資料表
│   ├── kafkaConsumer.js        # Kafka 消費者服務
│   └── kafkaProducer.js        # Kafka 生產者服務
├── views/
│   ├── home.ejs                # 首頁 EJS 模板
│   ├── kafkaProducer.ejs       # Kafka UI EJS 模板
│   └── users.ejs               # 使用者 CRUD UI EJS 模板
├── README.md                   # 專案說明（中英）
└── ... 其他檔案
```
| 處理順序 | 架構元件             | 職責 / 功能                       | 生活化比喻          | 為什麼重要？                            |
| ---- | ---------------- | ----------------------------- | -------------- | --------------------------------- |
| 1    | **Middleware**   | 請求前的處理（認證、日誌、CORS）            | 門口保全 / 安檢站     | 攔截每個請求，做預處理（身分驗證、記錄、跨域等）          |
| 2    | **Guard**        | 保護路由，決定是否可進入該功能               | 門禁卡感應器 / 員工識別器 | 控制誰能使用哪些功能，確保安全                   |
| 3    | **Pipe**         | 輸入資料的格式驗證與轉型                  | 點餐單格式檢查員       | 確保 Controller 收到乾淨、正確型別的資料        |
| 4    | **Controller**   | 接收請求、分派任務、回應結果                | 櫃檯接待人員 / 接單人員  | 與使用者互動，負責將請求送給適當的處理者              |
| 5    | **DTO**          | 規範請求與回應資料的結構                  | 點菜單 / 訂單表格     | 保證進出的資料格式一致，提高維護與開發效率             |
| 6    | **Service**      | 處理商業邏輯，協調多模組流程                | 老闆 / 經理        | 核心決策點，串接多模組，保持邏輯集中                |
| 7    | **Repository**   | 封裝資料存取邏輯（查詢、寫入、刪除 DB）         | 倉管 / 採購員       | 將資料操作抽象化，避免 Service 直接依賴 DB，可替換性高 |
| 8    | **Entity/Model** | 對應資料庫結構，定義資料的型別與關聯            | 倉庫的貨物標籤 / 建模圖紙 | 對資料進行建模，與 ORM 框架整合，資料一致性依據        |
| 9    | **Interceptor**  | 攔截 response 做格式轉換、加統計、日誌紀錄等處理 | 廚房總管 / 統一出餐樣式  | 統一 API 回傳格式、記錄執行時間，提升維護與觀測性       |
| -    | **Config**       | 環境變數與設定檔（DB 連線、Port、秘鑰等）      | 餐廳手冊 / 作業規範書   | 管理環境差異與敏感資訊，支援多環境部署、安全集中管理        |


### 後端角色順序建議

1. **Middleware**（中間件）
   - 請求進入應用的第一站，負責驗證、日誌、CORS 等前置處理。
2. **Guard**（守衛）
   - 控制權限、決定誰能進入特定路由。
3. **Pipe**（資料驗證/轉換）
   - 驗證與轉換請求資料格式。
4. **Interceptor**（攔截器）
   - 統一處理回應格式、統計、日誌等。
5. **Controller**（控制器）
   - 接收請求、回應結果，調用 Service 處理業務。
6. **DTO**（資料傳輸物件）
   - 定義請求與回應的資料結構。
7. **Service**（服務）
   - 處理商業邏輯、流程協調。
8. **Repository**（資料存取層）
   - 封裝所有資料庫操作，對 Service 提供資料服務。
9. **Entity/Model**（資料模型）
   - 定義資料庫結構與對應邏輯。
10. **Config**（設定）
    - 管理環境變數與應用設定。

---

### Repository 資料存儲層

- 介於Controller 與 Model 之間的設計層
- 可以更好的分離Controller 與Model之間的操作

#### Analogy： 買房子

| 系統元件         | 比喻角色         | 說明                    |
| ------------ | ------------ | --------------------- |
| Controller   | 客戶經理 / 櫃檯    | 接收顧客需求：「我要買房！」        |
| Service      | 房地產顧問 / 經理人  | 分析顧客需求：「你預算多少？想住哪一區？」 |
| Repository | 地政事務所 / 資料代辦 | 幫你從地政系統查房產資料，辦買賣、過戶   |
| Database     | 房產登記機關       | 真正存放房產資訊的地方           |

##### 買房流程（對應系統邏輯）
1. 你跟房地產貴台人員提需求（API request 到 Controller）
2. 人員記下你的需求（Controller 拿到 req.body）
3. 房地產專業顧問分析你預算與喜好（Service 處理邏輯）
4. 顧問請專人去地政系統查房子資料（Repository 去查 DB）
5. 找到後顧問推薦你房子（回傳 response）

#### 為什麼要有Repository？
你可能會覺得，顧問（Service）明明可以直接查房產登記機關（DB），為什麼還要多一個別的東西來服務。
1. 違反Single Responsible Principle
- 其實Service主要負責的的事業務邏輯，而不是DB操作。Service應該要只確認「合理與否」。
- 而Repository就不負責邏輯，反正Service會確認對不對，從Service過來的東西，就默認合理，只執行儲存。

2. 進行test的時候更複雜
- 就像一個人在工作要兼任很多不同角色的時候，當工作量增加的時候就會變得負荷很重。甚至連檢查也要檢查所有細小部分，都只能由那個兼任所有事情的人來確認是不是對的。
- 分離之後，其實相對來說，兼任的那個人可以讓別人去測他不同的工作，減少工作量。

3. 更換data source來源的可能性
- 比喻：
假設說「service」是咖啡店老闆，他要每天早上從批發市場（db）直接購買咖啡豆（data），當你要買的豆子數量越來越大，老闆想要換成網絡購買，但是因為沒有（repository）採購經理，所以他要自己去每個步驟都要進行，從在網上選豆，購買，取貨，帶回店裡，都要一個人（service老闆）進行。

這個時候其實就能看到Repository採購經理的重要性，
當他出現的時候，service老闆可以專注於他的營運決定，而採購的部分就可以交給repository採購經理去執行。

```
beanSource.getFreshBeans()
```
老闆只需要跟採購經理說，我要新豆子，那採購經理就會自己處理後面的事情，不需要老闆操心。


### Middleware 中間件

Middleware 是在「收到請求（Request）」到「送出回應（Response）」的過程中，可以攔截、修改、驗證、記錄請求的中間處理器。

```
你（Request）→ 安檢站（Middleware）→ 登機口（Controller）→ 出發（Response）
```

## 快速開始
1. 複製 `.env` 範例並設定資料庫資訊
2. `docker-compose up` 啟動所有服務
3. 造訪 `http://localhost:8081` 使用 Web UI

## 主要指令
```sh
npm install         # 安裝依賴
npm start           # 啟動 Express 伺服器
```
