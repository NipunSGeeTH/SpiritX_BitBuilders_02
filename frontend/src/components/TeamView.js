// components/TeamView.js
import React, { useState } from 'react';

const TeamView = ({ user, setUser }) => {
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [teamName, setTeamName] = useState(user.teamName);
  const [isEditing, setIsEditing] = useState(false);
  
  const handleRemovePlayer = async (playerId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/removePlayer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ playerId })
      });
      
      const data = await response.json();
      
      if (data.status === "ok") {
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
  
  const handleUpdateTeamName = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/updateTeamName', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ teamName })
      });
      
      const data = await response.json();
      
      if (data.status === "ok") {
        setSuccessMessage('Team name updated successfully');
        setIsEditing(false);
        
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
  
  // Group players by their roles
  const playersByRole = {
    'Batsman': user.players.filter(player => player.role === 'Batsman'),
    'Bowler': user.players.filter(player => player.role === 'Bowler'),
    'All-rounder': user.players.filter(player => player.role === 'All-rounder'),
    'Wicket-keeper': user.players.filter(player => player.role === 'Wicket-keeper')
  };
  
  return (
    <div className="team-view-container">
      <div className="team-header">
        {isEditing ? (
          <div className="team-name-edit">
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter team name"
            />
            <button onClick={handleUpdateTeamName} className="btn btn-primary">Save</button>
            <button onClick={() => {
              setTeamName(user.teamName);
              setIsEditing(false);
            }} className="btn btn-secondary">Cancel</button>
          </div>
        ) : (
          <div className="team-name-display">
            <h2>{user.teamName}</h2>
            <button onClick={() => setIsEditing(true)} className="btn btn-edit">Edit</button>
          </div>
        )}
        
        <div className="team-stats">
          <div className="team-stat">
            <span>Players:</span>
            <span>{user.players.length}/11</span>
          </div>
          <div className="team-stat">
            <span>Total Points:</span>
            <span>{user.totalPoints.toFixed(1)}</span>
          </div>
          <div className="team-stat">
            <span>Remaining Budget:</span>
            <span>Rs.{user.budget.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      {(error || successMessage) && (
        <div className={`message ${error ? 'error' : 'success'}`}>
          {error || successMessage}
        </div>
      )}
      
      {user.players.length === 0 ? (
        <div className="empty-team">
          <p>You haven't selected any players yet.</p>
          <a href="/select-team" className="btn btn-primary">Select Players</a>
        </div>
      ) : (
        <div className="team-composition">
          {Object.entries(playersByRole).map(([role, players]) => (
            <div key={role} className="role-section">
              <h3>{role}s ({players.length})</h3>
              <div className="role-players">
                {players.map(player => (
                  <div key={player._id} className="player-card">
                    <div className="player-image">
                      <img src={`/player-images/${player.image}`} alt={player.name} />
                      <span className="player-role">{player.role}</span>
                    </div>
                    
                    <div className="player-info">
                        
                      <h3>  {player.name}</h3>
                      <p className="player-team">{player.team}</p>
                      <div className="player-stats">
                        <div className="stat">
                          <span>Bat SR:</span>
                          <span>{player.battingStrikeRate.toFixed(1)}</span>
                        </div>
                        <div className="stat">
                          <span>Bat Avg:</span>
                          <span>{player.battingAverage.toFixed(1)}</span>
                        </div>
                        <div className="stat">
                          <span>Bowl SR:</span>
                          <span>{player.bowlingStrikeRate.toFixed(1)}</span>
                        </div>
                        <div className="stat">
                          <span>Economy:</span>
                          <span>{player.economyRate.toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="player-value">
                        <span>Value:</span>
                        <span>Rs.{player.playerValue.toLocaleString()}</span>
                      </div>
                      <div className="player-points">
                        <span>Points:</span>
                        <span>{player.playerPoints.toFixed(1)}</span>
                      </div>
                    </div>
                    
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemovePlayer(player._id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                
                {players.length === 0 && (
                  <div className="no-players">No {role.toLowerCase()}s selected</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamView;