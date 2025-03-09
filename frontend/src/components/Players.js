import React, { useEffect, useState } from "react";

const Players = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/players")
      .then((res) => res.json())
      .then((data) => setPlayers(data))
      .catch((err) => console.error("Error fetching players:", err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Players List</h2>
      {players.map((player) => (
        <div
          key={player._id}
          className="border rounded-xl p-4 mb-3 shadow-md bg-white"
        >
          <p><strong>Name:</strong> {player.name}</p>
          <p><strong>University:</strong> {player.university}</p>
          <p><strong>Category:</strong> {player.category}</p>
          <p><strong>Total Runs:</strong> {player.totalRuns}</p>
          <p><strong>Balls Faced:</strong> {player.ballsFaced}</p>
          <p><strong>Innings Played:</strong> {player.inningsPlayed}</p>
          <p><strong>Wickets:</strong> {player.wickets}</p>
          <p><strong>Overs Bowled:</strong> {player.oversBowled}</p>
          <p><strong>Runs Conceded:</strong> {player.runsConceded}</p>
        </div>
      ))}
    </div>
  );
};

export default Players;
