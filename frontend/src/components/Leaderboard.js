// components/Leaderboard.js
import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchLeaderboard();
  }, []);
  
  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/leaderboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <div className="loading">Loading leaderboard...</div>;
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  return (
    <div className="leaderboard-container">
      <h2>Leaderboard</h2>
      
      {leaderboard.length === 0 ? (
        <div className="no-data">No team data available yet</div>
      ) : (
        <div className="leaderboard-table-container">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Team Name</th>
                <th>Manager</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => (
                <tr key={entry.username} className={entry.rank <= 3 ? `top-${entry.rank}` : ''}>
                  <td>{entry.rank}</td>
                  <td>{entry.teamName}</td>
                  <td>{entry.username}</td>
                  <td>{entry.totalPoints.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="leaderboard-info">
        <h3>How Points Are Calculated</h3>
        <p>Player points are based on their cricket stats using the formula:</p>
        <code className="formula">
          Points = (Batting SR / 5 + Batting Avg * 0.8) + (500 / Bowling SR + 140 / Economy)
        </code>
        <p>Team points are the sum of all your selected players' points.</p>
      </div>
    </div>
  );
};

export default Leaderboard;
