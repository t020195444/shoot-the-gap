"use client";

import { useEffect, useState } from "react";
import socket from "@/utils/socket";
import Card from "@/components/Card";
import Leaderboard from "@/components/Leaderboard";
import styles from "./game.module.css";
import PlayerList from "./PlayerList";

interface Player {
  id: string;
  name: string;
  balance: number;
}
export interface CardProps {
  value: string;
  suit: string;
  flipped: boolean;
}

export default function Game() {
  const [playerName, setPlayerName] = useState("");
  const [result, setResult] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [betAmount, setBetAmount] = useState(100);

  const [firstCard, setFirstCard] = useState<Omit<CardProps, "flipped"> | null>(
    null
  );
  const [secondCard, setSecondCard] = useState<Omit<
    CardProps,
    "flipped"
  > | null>(null);
  const [thirdCard, setThirdCard] = useState<Omit<CardProps, "flipped"> | null>(
    null
  );
  const [canBet, setCanBet] = useState(false);

  useEffect(() => {
    socket.on("updatePlayers", (onlinePlayers) => {
      console.log("📦 收到玩家更新：", onlinePlayers);
      setPlayers(onlinePlayers);
    });

    socket.on("dealCards", ({ first, second }) => {
      setFirstCard(first);
      setSecondCard(second);
      setCanBet(true);
    });

    socket.on("gameResult", ({ thirdCard, result, balance }) => {
      setResult(result);
      setThirdCard(thirdCard);
      setPlayers((prev) =>
        prev.map((p) => (p.name === playerName ? { ...p, balance } : p))
      );
    });

    return () => {
      socket.off("updatePlayers");
      socket.off("dealCards");
      socket.off("gameResult");
    };
  }, []);

  const joinGame = () => {
    if (!playerName.trim()) {
      alert("請輸入名字！");
      return;
    }
    socket.emit("joinGame", { name: playerName });

    // 要求兩張牌
    socket.emit("requestCards");
  };
  const placeBet = () => {
    if (!canBet) return;
    socket.emit("bet", { amount: betAmount });
    setCanBet(false);
  };

  return (
    <div className={styles.gameContainer}>
      <h1>射龍門 🎲</h1>
      <input
        type="text"
        placeholder="輸入名稱"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <button onClick={joinGame}>加入遊戲</button>

      <PlayerList players={players} />

      <div className={styles.cardContainer}>
        <Card
          value={firstCard?.value ?? ""}
          suit={firstCard?.suit ?? ""}
          flipped={!!firstCard}
        />
        <Card
          value={thirdCard?.value ?? ""}
          suit={thirdCard?.suit ?? ""}
          flipped={!!thirdCard}
        />
        <Card
          value={secondCard?.value ?? ""}
          suit={secondCard?.suit ?? ""}
          flipped={!!secondCard}
        />
      </div>

      <div>{result}</div>

      <input
        type="number"
        value={betAmount}
        onChange={(e) => setBetAmount(Number(e.target.value))}
      />
      <button onClick={placeBet} disabled={!canBet}>
        下注
      </button>
      <button
        onClick={() => {
          socket.emit("requestCards");
          setThirdCard(null); // 重新洗牌後清掉舊的第三張
        }}
      >
        重新發牌
      </button>
      <Leaderboard />
    </div>
  );
}
