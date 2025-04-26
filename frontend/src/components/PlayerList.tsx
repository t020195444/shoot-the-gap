interface Player {
  id: string;
  name: string;
  balance: number;
}

const PlayerList = ({ players }: { players: Player[] }) => {
  console.log("👥 玩家列表渲染中", players);
  return (
    <div>
      <h2>玩家列表</h2>
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            {player.name} - 💰 {player.balance}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerList;
