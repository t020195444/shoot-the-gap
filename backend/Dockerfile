# 使用 Node.js 官方鏡像
FROM node:18

# 設定工作目錄
WORKDIR /usr/src/app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝依賴
RUN npm install

# 複製所有程式碼
COPY . .

# 指定運行的 Port
EXPOSE 8080

# 啟動應用程式
CMD ["node", "server.js"]
