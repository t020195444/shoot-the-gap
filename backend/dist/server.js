"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = require("cors");
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, { cors: { origin: "*" } });
app.use((0, cors_1.default)({ origin: "*" }));
io.on("connection", (socket) => {
    console.log(`🟢 玩家連接: ${socket.id}`);
    socket.on("setName", (name) => {
        console.log(`玩家 ${socket.id} 設定名稱為 ${name}`);
        io.emit("updatePlayers", { id: socket.id, name });
    });
    socket.on("disconnect", () => {
        console.log(`🔴 玩家離開: ${socket.id}`);
        io.emit("removePlayer", { id: socket.id });
    });
});
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`🚀 WebSocket 伺服器運行中，PORT: ${PORT}`);
});
