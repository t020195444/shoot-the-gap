import { io } from "socket.io-client";

// ✅ 這裡先連接本機測試伺服器，之後部署時再改成 Cloud Run URL
const socket = io("https://shoot-the-gap-1089042134024.asia-east1.run.app", {
  transports: ["websocket"], // 強制使用 WebSocket，避免 fallback
});

// const socket = io("http://localhost:8080", {
//   transports: ["websocket"], // 強制使用 WebSocket，避免 fallback
// });

export default socket;
