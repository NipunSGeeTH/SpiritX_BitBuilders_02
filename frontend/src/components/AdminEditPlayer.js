import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminEditPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    team: '',
    role: '',
    totalRuns: 0,
    totalBallsFaced: 0,
    inningsPlayed: 0,
    totalBallsBowled: 0,
    totalWicketsTaken: 0,
    totalRunsConceded: 0,
    image: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:4000/api/players/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFormData(response.data);
      } catch (err) {
        setError('Failed to fetch player data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'name' || name === 'team' || name === 'role' || name === 'image' 
        ? value 
        : Number(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:4000/api/admin/updatePlayer/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 'ok') {
        navigate('/admin');
      } else {
        setError(response.data.message || 'Failed to update player');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading player data...</div>;

  return (
    <div className="admin-edit-player">
      <h2>Edit Player: {formData.name}</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Player Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="team">Team *</label>
          <input
            type="text"
            id="team"
            name="team"
            value={formData.team}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="role">Role *</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="Batsman">Batsman</option>
            <option value="Bowler">Bowler</option>
            <option value="All-rounder">All-rounder</option>
            <option value="Wicket-keeper">Wicket-keeper</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="image">Image URL</label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
          />
        </div>
        
        <h3>Batting Statistics</h3>
        
        <div className="form-group">
          <label htmlFor="totalRuns">Total Runs</label>
          <input
            type="number"
            id="totalRuns"
            name="totalRuns"
            value={formData.totalRuns}
            onChange={handleChange}
            min="0"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="totalBallsFaced">Total Balls Faced</label>
          <input
            type="number"
            id="totalBallsFaced"
            name="totalBallsFaced"
            value={formData.totalBallsFaced}
            onChange={handleChange}
            min="0"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="inningsPlayed">Innings Played</label>
          <input
            type="number"
            id="inningsPlayed"
            name="inningsPlayed"
            value={formData.inningsPlayed}
            onChange={handleChange}
            min="0"
          />
        </div>
        
        <h3>Bowling Statistics</h3>
        
        <div className="form-group">
          <label htmlFor="totalBallsBowled">Total Balls Bowled</label>
          <input
            type="number"
            id="totalBallsBowled"
            name="totalBallsBowled"
            value={formData.totalBallsBowled}
            onChange={handleChange}
            min="0"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="totalWicketsTaken">Total Wickets Taken</label>
          <input
            type="number"
            id="totalWicketsTaken"
            name="totalWicketsTaken"
            value={formData.totalWicketsTaken}
            onChange={handleChange}
            min="0"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="totalRunsConceded">Total Runs Conceded</label>
          <input
            type="number"
            id="totalRunsConceded"
            name="totalRunsConceded"
            value={formData.totalRunsConceded}
            onChange={handleChange}
            min="0"
          />
        </div>
        
        <div className="form-group">
          <p>
            <strong>Current Calculated Values:</strong>
          </p>
          <p>Batting Strike Rate: {formData.battingStrikeRate?.toFixed(2) || 'N/A'}</p>
          <p>Batting Average: {formData.battingAverage?.toFixed(2) || 'N/A'}</p>
          <p>Bowling Strike Rate: {formData.bowlingStrikeRate?.toFixed(2) || 'N/A'}</p>
          <p>Economy Rate: {formData.economyRate?.toFixed(2) || 'N/A'}</p>
          <p>Player Points: {formData.playerPoints?.toFixed(2) || 'N/A'}</p>
          <p>Player Value: Rs.{formData.playerValue?.toLocaleString() || 'N/A'}</p>
        </div>
        
        <div className="form-buttons">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => navigate('/admin')}
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditPlayer;