// AdminPlayersList.js - Component to list and manage players
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminPlayersList = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/players', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlayers(response.data);
    } catch (err) {
      setError('Failed to fetch players');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleDeletePlayer = async (id) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:4000/api/admin/deletePlayer/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Refresh player list
        fetchPlayers();
      } catch (err) {
        setError('Failed to delete player');
        console.error(err);
      }
    }
  };

  if (loading) return <div className="loading">Loading players...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-players-list">
      <h2>Manage Players</h2>
      <Link to="/admin/add-player" className="btn btn-primary">
        Add New Player
      </Link>
      
      <div className="table-responsive">
        <table className="players-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Team</th>
              <th>Role</th>
              <th>Value</th>
              <th>Points</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player._id}>
                <td>
                  <img 
                    src={player.image.startsWith('http') ? player.image : `/images/${player.image}`} 
                    alt={player.name} 
                    className="player-thumbnail" 
                  />
                </td>
                <td>{player.name}</td>
                <td>{player.team}</td>
                <td>{player.role}</td>
                <td>Rs.{player.playerValue.toLocaleString()}</td>
                <td>{player.playerPoints.toFixed(2)}</td>
                <td>
                  <Link to={`/admin/edit-player/${player._id}`} className="btn btn-edit">
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDeletePlayer(player._id)} 
                    className="btn btn-delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPlayersList;
