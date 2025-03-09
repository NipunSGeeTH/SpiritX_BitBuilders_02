// components/Navbar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();
  
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Cricket Fantasy League</h1>
      </div>
      
      <div className="user-info">
        <span>Welcome, {user?.username}</span>
        <span className="budget-display">Budget:Rs.{user?.budget?.toLocaleString()}</span>
      </div>
      
      <ul className="nav-links">
        <li className={location.pathname === '/dashboard' ? 'active' : ''}>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li className={location.pathname === '/select-team' ? 'active' : ''}>
          <Link to="/select-team">Select Team</Link>
        </li>
        <li className={location.pathname === '/team' ? 'active' : ''}>
          <Link to="/team">My Team</Link>
        </li>
        <li className={location.pathname === '/budget' ? 'active' : ''}>
          <Link to="/budget">Budget</Link>
        </li>
        <li className={location.pathname === '/leaderboard' ? 'active' : ''}>
          <Link to="/leaderboard">Leaderboard</Link>
        </li>
        <li>
          <button onClick={onLogout} className="btn btn-logout">Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;