// components/SelectTeam.js
import React, { useState, useEffect } from 'react';





const SelectTeam = ({ user, setUser }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [teamFilter, setTeamFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Get list of all available teams from players
  const getTeams = () => {
    const teams = [...new Set(players.map(player => player.team))];
    return ['All', ...teams];
  };
  
  useEffect(() => {
    fetchPlayers();
  }, []);
  
  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/players');
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      setError('Failed to load players');
    } finally {
      setLoading(false);
    }
  };
  function calculatePlayerValue(player) {
    const battingStrikeRate = player.ballsFaced > 0 ? (player.totalRuns / player.ballsFaced) * 100 : 0;
    const battingAverage = player.inningsPlayed > 0 ? player.totalRuns / player.inningsPlayed : 0;
    const bowlingStrikeRate = player.wickets > 0 ? (player.oversBowled * 6) / player.wickets : 0;
    const economyRate = player.oversBowled > 0 ? (player.runsConceded / player.oversBowled) : 0;
  
    let points = 0;
  
    if (bowlingStrikeRate > 0 && economyRate > 0) {
      points = (battingStrikeRate / 5 + battingAverage * 0.8) + (500 / bowlingStrikeRate + 140 / economyRate);
    } else {
      points = (battingStrikeRate / 5 + battingAverage * 0.8);
    }
  
    let value = (9 * points + 100) * 1000;
    return Math.round(value / 50000) * 50000;
  }


  const handleSelectPlayer = async (playerId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/selectPlayer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ playerId })
      });
      
      const data = await response.json();
      
      if (data.status === "ok") {
        // Update







        setSuccessMessage(data.message);
        
        // Fetch updated user data
        const userResponse = await fetch('http://localhost:4000/userData', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const userData = await userResponse.json();
        if (userData.status === "ok") {
          setUser(userData.data);
        }
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        setError(data.message);
        
        // Clear error message after 3 seconds
        setTimeout(() => {
          setError('');
        }, 3000);
      }
    } catch (error) {
      setError('Server error. Please try again.');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };
  
  // Filter players based on role, team, and search query
  const filteredPlayers = players.filter(player => {
    const matchesRole = roleFilter === 'All' || player.role === roleFilter;
    const matchesTeam = teamFilter === 'All' || player.team === teamFilter;
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesTeam && matchesSearch;
  });
  
  // Check if a player is already in the user's team
  const isPlayerInTeam = (playerId) => {
    return user.players.some(p => p._id === playerId);
  };
  
  if (loading) {
    return <div className="loading">Loading players...</div>;
  }
  
  return (
    <div className="select-team-container">
      <h2>Select Players</h2>
      
      <div className="team-status">
        <div className="status-item">
          <span>Players: </span>
          <span className={user.players.length === 11 ? 'status-full' : ''}>
            {user.players.length}/11
          </span>
        </div>
        <div className="status-item">
          <span>Budget: </span>
          <span>Rs.{user.budget.toLocaleString()}</span>
        </div>
      </div>
      
      {(error || successMessage) && (
        <div className={`message ${error ? 'error' : 'success'}`}>
          {error || successMessage}
        </div>
      )}
      
      <div className="filters">
        <div className="filter-group">
          <label>Role:</label>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="All">All Roles</option>
            <option value="Batsman">Batsman</option>
            <option value="Bowler">Bowler</option>
            <option value="All-rounder">All-rounder</option>
            <option value="Wicket-keeper">Wicket-keeper</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Team:</label>
          <select value={teamFilter} onChange={(e) => setTeamFilter(e.target.value)}>
            {getTeams().map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </div>
        
        <div className="search-box">
          <input
            type="text"
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="players-grid">
        {filteredPlayers.length === 0 ? (
          <div className="no-players">No players match your filters</div>
        ) : (
          filteredPlayers.map(player => (
            <div key={player._id} className="player-card">
              <div className="player-image">
                <img src={`/player-images/${player.image}`} alt={player.name} />
                <span className="player-role">{player.role}</span>
              </div>
              
              <div className="player-info">
                <h3>{player.name}</h3>
                <p className="player-team">{player.university}</p>
                <div className="player-stats">
                <div className="stat">
                <span>Bat SR:</span>
                <span>{player.ballsFaced > 0 ? ((player.totalRuns / player.ballsFaced) * 100).toFixed(1) : "0.0"}</span>
                </div>

                 


                  <div className="stat">
  <span>Bat Avg:</span>
  <span>{player.inningsPlayed > 0 ? (player.totalRuns / player.inningsPlayed).toFixed(1) : "0.0"}</span>
</div>
<div className="stat">
  <span>Economy:</span>
  <span>{player.oversBowled > 0 ? ((player.runsConceded / (player.oversBowled * 6)) * 6).toFixed(1) : "0.0"}</span>
</div>
                </div>


                <div className="stat">
  <span>Points:</span>
  <span>{(
    (player.ballsFaced > 0 ? (player.totalRuns / player.ballsFaced) * 100 : 0) / 5 + 
    (player.totalRuns / player.inningsPlayed) * 0.8 + 
    (500 / (player.wickets > 0 ? (player.oversBowled * 6) / player.wickets : 1)) + 
    (140 / (player.oversBowled > 0 ? (player.runsConceded / (player.oversBowled * 6)) * 6 : 1))
  ).toFixed(1)}</span>
</div>



<div className="stat">
  <span>Value:</span>
  <span>Rs.{Math.round((9 * (
    (player.ballsFaced > 0 ? (player.totalRuns / player.ballsFaced) * 100 : 0) / 5 + 
    (player.totalRuns / player.inningsPlayed) * 0.8 + 
    (500 / (player.wickets > 0 ? (player.oversBowled * 6) / player.wickets : 1)) + 
    (140 / (player.oversBowled > 0 ? (player.runsConceded / (player.oversBowled * 6)) * 6 : 1))
  ) + 100) * 1000 / 50000) * 50000}</span>
</div>


              </div>


              
              
              <button
  className={`btn ${
    isPlayerInTeam(player._id)
      ? 'btn-disabled'
      : user.budget < calculatePlayerValue(player)
      ? 'btn-disabled'
      : 'btn-primary'
  }`}
  onClick={() => handleSelectPlayer(player._id)}
  disabled={
    isPlayerInTeam(player._id) ||
    user.budget < calculatePlayerValue(player) ||
    user.players.length >= 11
  }
>
  {isPlayerInTeam(player._id)
    ? 'In Team'
    : user.budget < calculatePlayerValue(player)
    ? 'Too Expensive'
    : `Select (Rs.${calculatePlayerValue(player).toLocaleString()})`}
</button>

              
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SelectTeam;