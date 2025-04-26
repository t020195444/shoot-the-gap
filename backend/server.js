const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors({ origin: "*" }));

const players = {}; // 線上玩家清單

const generateDeck = () => {
  return [...Array(52).keys()].map((i) => ({
    suit: ["♠", "♥", "♦", "♣"][i % 4],
    value: (i % 13) + 1,
  }));
};

const shuffle = (deck) => {
  return [...deck].sort(() => Math.random() - 0.5);
};

const updateLeaderboard = () => {
  const leaderboard = {};
  for (const player of Object.values(players)) {
    leaderboard[player.name] = {
      name: player.name,
      wins: player.wins || 0, // 確保有 wins
      balance: player.balance,
    };
  }
  io.emit("updateLeaderboard", leaderboard);
};

io.on("connection", (socket) => {
  console.log(`🟢 玩家連接: ${socket.id}`);

  socket.emit("updatePlayers", Object.values(players));
  updateLeaderboard();

  socket.on("joinGame", ({ name }) => {
    if (!players[socket.id]) {
      players[socket.id] = {
        id: socket.id,
        name,
        balance: 1000,
        wins: 0, // 🆕 加 wins
        firstCard: null,
        secondCard: null,
      };
    }
    io.emit("updatePlayers", Object.values(players));
    updateLeaderboard();
  });

  socket.on("requestCards", () => {
    const player = players[socket.id];
    if (!player) return;

    const deck = shuffle(generateDeck());
    const [first, second] = deck.slice(0, 2);

    player.firstCard = first;
    player.secondCard = second;

    socket.emit("dealCards", { first, second });
  });

  socket.on("bet", ({ amount }) => {
    const player = players[socket.id];
    if (!player) return;
    if (player.balance < amount) return;
    if (!player.firstCard || !player.secondCard) return;

    const deck = shuffle(generateDeck());

    const thirdCard = deck.find(
      (c) =>
        !(
          c.value === player.firstCard.value && c.suit === player.firstCard.suit
        ) &&
        !(
          c.value === player.secondCard.value &&
          c.suit === player.secondCard.suit
        )
    );

    let result = "輸了";
    if (
      thirdCard.value >
        Math.min(player.firstCard.value, player.secondCard.value) &&
      thirdCard.value <
        Math.max(player.firstCard.value, player.secondCard.value)
    ) {
      result = "贏了";
      player.balance += amount;
      player.wins = (player.wins || 0) + 1; // 🆙 贏了加勝場
    } else {
      player.balance -= amount;
    }

    io.emit("gameResult", {
      name: player.name,
      thirdCard,
      result,
      balance: player.balance,
    });

    io.emit("updatePlayers", Object.values(players));
    updateLeaderboard(); // 🆙 更新排行榜！

    player.firstCard = null;
    player.secondCard = null;
  });

  socket.on("disconnect", () => {
    console.log(`🔴 玩家離開: ${socket.id}`);
    delete players[socket.id];
    io.emit("updatePlayers", Object.values(players));
    updateLeaderboard();
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`🚀 伺服器運行於 PORT: ${PORT}`));
