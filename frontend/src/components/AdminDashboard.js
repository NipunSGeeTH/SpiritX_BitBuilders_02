// AdminDashboard.js - Main admin dashboard component
import './AdminDashboard.css';
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminPlayersList from './AdminPlayersList';
import AdminAddPlayer from './AdminAddPlayer';
import AdminEditPlayer from './AdminEditPlayer';
import AdminUsers from './AdminUsers';

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get('http://localhost:4000/userData', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.data.status === 'ok') {
          if (res.data.data.accountType !== 'admin') {
            // Redirect non-admin users
            navigate('/dashboard');
          } else {
            setIsAdmin(true);
          }
        } else {
          localStorage.removeItem('token');
          navigate('/login');
        }
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('token');
        navigate('/login');
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!isAdmin) {
    return <div className="loading">Checking admin privileges...</div>;
  }

  return (
    <div className="admin-dashboard">
      <nav className="admin-nav">
        <div className="admin-nav-brand">Cricket Fantasy - Admin Panel</div>
        <ul className="admin-nav-links">
          <li>
            <Link to="/admin">Players</Link>
          </li>
          <li>
            <Link to="/admin/users">Users</Link>
          </li>
          <li>
            <Link to="/admin/add-player">Add Player</Link>
          </li>
          <li>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </li>
        </ul>
      </nav>

      <div className="admin-content">
        <Routes>
          <Route path="/" element={<AdminPlayersList />} />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/add-player" element={<AdminAddPlayer />} />
          <Route path="/edit-player/:id" element={<AdminEditPlayer />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;