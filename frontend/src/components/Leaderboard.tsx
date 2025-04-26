import { useEffect, useState } from "react";
import socket from "@/utils/socket";

interface PlayerStats {
  name: string;
  wins: number;
  balance: number;
}

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<PlayerStats[]>([]);

  useEffect(() => {
    socket.on("updateLeaderboard", (data: Record<string, PlayerStats>) => {
      setLeaderboard(
        Object.entries(data).map(([name, stats]) => ({
          ...stats, // 先展開 stats
          name, // 再放入 name，確保不會被覆蓋
        }))
      );
    });

    return () => {
      socket.off("updateLeaderboard");
    };
  }, []);

  return (
    <div>
      <h2>🏆 排行榜</h2>
      <ul>
        {leaderboard.map((player, index) => (
          <li key={index}>
            <strong>{player.name}</strong> - 勝場: {player.wins} / 💰{" "}
            {player.balance}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
