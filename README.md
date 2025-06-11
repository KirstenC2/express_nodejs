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
### 後端角色table
| 架構元件             | 職責 / 功能                      | 生活化比喻          | 為什麼重要？                 |
| ---------------- | ---------------------------- | -------------- | ---------------------- |
| **Controller**   | 接收請求、回應結果                    | 櫃檯接待人員 / 接單人員  | 負責第一線與客戶互動             |
| **Service**      | 處理商業邏輯、流程協調                  | 老闆 / 經理        | 決策核心，統籌所有流程            |
| **Repository**   | 資料存取邏輯（DB 查詢/更新/刪除）          | 倉管 / 採購員       | 隱藏底層資料操作細節，便於切換資料庫     |
| **Middleware**   | 請求前的處理（認證、日誌、CORS）           | 門口保全 / 安檢站     | 攔截每個請求，做驗證或處理          |
| **DTO**          | 請求與回應的資料格式規範                 | 點菜單 / 訂單表格     | 確保資料結構正確、統一            |
| **Entity/Model** | 定義資料庫中的資料結構                  | 倉庫的貨物標籤 / 建模圖紙 | 用來對應資料庫欄位與邏輯結構         |
| **Guard**        | 保護路由、決定可不可以進入特定功能            | 門禁卡感應器 / 員工識別器 | 控制誰有權進入某些資源或功能         |
| **Interceptor**  | 攔截 request 或 response 做轉換/統一 | 廚房總管：統一出餐樣式    | 可統一 API 回傳格式或加上統計計時等功能 |
| **Pipe**         | 資料驗證與轉換（輸入端）                 | 點餐單格式檢查員       | 確保客人點餐格式沒錯，例如金額為數字等    |
| **Config**       | 環境變數與設定檔                     | 餐廳的手冊 / 作業規範書  | 把敏感與環境相關設定抽出來管理        |


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



### Repository Layer

- A design layer between Controller and Model
- Further separates operations between Controller and Model

#### Analogy: Buying a House

| System Component | Analogy Role         | Description                                 |
|------------------|---------------------|---------------------------------------------|
| Controller       | Customer Manager    | Receives customer request: "I want a house!"|
| Service          | Real Estate Agent   | Analyzes needs: "What's your budget?"       |
| Repository       | Land Office/Clerk   | Handles property lookup, transfer, etc.      |
| Database         | Land Registry       | Where property data is actually stored       |

##### Buying Process (System Logic)
1. You tell the real estate front desk your needs (API request to Controller)
2. The staff records your needs (Controller gets req.body)
3. The agent analyzes your budget and preferences (Service handles logic)
4. The agent asks a clerk to check the land registry (Repository queries DB)
5. The agent recommends a house to you (returns response)

#### Why use a Repository?
You might wonder, why can't the agent (Service) just check the land registry (DB) directly?

1. Violates Single Responsibility Principle
   - Service should focus on business logic, not DB operations. Service only checks if things are reasonable.
   - Repository doesn't handle logic; it just stores what Service gives it.
2. Testing becomes more complex
   - If one person does everything, testing is harder. Separation allows easier, focused testing.
3. Easier to change data sources
   - For example, if the service (shop owner) wants to switch from buying beans at the market (db) to buying online, without a purchasing manager (repository), the owner has to do everything. With a repository, the owner just asks for beans, and the manager handles the rest.

```
beanSource.getFreshBeans()
```
The owner just tells the purchasing manager to get fresh beans, and the manager handles the details.

## 快速開始
1. 複製 `.env` 範例並設定資料庫資訊
2. `docker-compose up` 啟動所有服務
3. 造訪 `http://localhost:8081` 使用 Web UI

## 主要指令
```sh
npm install         # 安裝依賴
npm start           # 啟動 Express 伺服器
```

---

# Express Node.js Kafka & MySQL Fullstack Example

## Introduction
This project is a Node.js application based on Express.js, integrating Kafka message queue and MySQL database, with a simple web UI for Kafka message sending and database CRUD operations.

## Features
- Kafka message producer and consumer
- MySQL user data CRUD (create, read, delete)
- EJS template-based web UI
- Docker Compose for one-command startup

## Project Structure
```
express_nodejs/
├── compose.yaml                # Docker Compose config
├── Dockerfile                  # App Docker build file
├── index.js                    # Express app entry point
├── package.json                # Node.js project descriptor
├── .env                        # Environment variables
├── config/
│   └── config.js               # Centralized config (DB, etc.)
├── controllers/
│   ├── homeController.js       # Home controller
│   ├── kafkaController.js      # Kafka controller
│   └── userController.js       # User controller
├── middleware/
│   ├── logger.js               # log
├── models/
│   ├── homeModel.js            # Home model (example)
│   └── userModel.js            # User model
├── repositories/
│   └── userRepository.js       # User repository
├── routes/
│   ├── index.js                # Main routes
│   └── kafka.js                # Kafka routes
├── service/
│   ├── db.js                   # MySQL connection pool
│   ├── initdb.js               # Auto-create tables on startup
│   ├── kafkaConsumer.js        # Kafka consumer service
│   └── kafkaProducer.js        # Kafka producer service
├── views/
│   ├── home.ejs                # Home EJS template
│   ├── kafkaProducer.ejs       # Kafka UI EJS template
│   └── users.ejs               # User CRUD UI EJS template
├── README.md                   # Project README (bilingual)
└── ... other files
```

## Quick Start
1. Copy and edit `.env` for your DB settings
2. Run `docker-compose up` to start all services
3. Visit `http://localhost:8081` to use the web UI

## Main Commands
```sh
npm install         # Install dependencies
npm start           # Start Express server
```
