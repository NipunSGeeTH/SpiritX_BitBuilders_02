// components/Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = ({ user }) => {
  return (
    <div className="dashboard">
      <h2>Welcome to Cricket Fantasy League</h2>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Team Size</h3>
          <p className="stat-value">{user?.players?.length || 0} / 11</p>
          <Link to="/select-team" className="btn btn-primary">
            {user?.players?.length === 0 ? 'Build Your Team' : 'Manage Team'}
          </Link>
        </div>
        
        <div className="stat-card">
          <h3>Team Budget</h3>
          <p className="stat-value">Rs.{user?.budget?.toLocaleString()}</p>
          <Link to="/budget" className="btn btn-primary">Budget Details</Link>
        </div>
        
        <div className="stat-card">
          <h3>Team Points</h3>
          <p className="stat-value">{user?.totalPoints?.toFixed(2) || 0}</p>
          <Link to="/leaderboard" className="btn btn-primary">View Leaderboard</Link>
        </div>
      </div>
      
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-container">
          <Link to="/select-team" className="action-card">
            <h4>Select Players</h4>
            <p>Browse and select players for your team</p>
          </Link>
          
          <Link to="/team" className="action-card">
            <h4>View Team</h4>
            <p>Check your current team composition</p>
          </Link>
          
          <Link to="/leaderboard" className="action-card">
            <h4>Leaderboard</h4>
            <p>See how your team ranks against others</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;