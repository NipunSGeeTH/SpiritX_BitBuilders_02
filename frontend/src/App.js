import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import SelectTeam from './components/SelectTeam';
import TeamView from './components/TeamView';
import BudgetView from './components/BudgetView';
import Leaderboard from './components/Leaderboard';
import Navbar from './components/Navbar';
import AdminDashboard from './components/AdminDashboard';
import Home from './components/Home';  // Import the new Home component
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch('http://localhost:4000/userData', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.status === "ok") {
        setUser(data.data);
        setIsLoggedIn(true);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      localStorage.removeItem('token');
    }
  };

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    if (userData && userData.accountType) {
      localStorage.setItem('accountType', userData.accountType);
    }
    fetchUserData(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('accountType');
    setIsLoggedIn(false);
    setUser(null);
  };

  const isAdmin = () => {
    return user && user.accountType === 'admin';
  };

  return (
    <Router>
      <div className="app">
        {isLoggedIn && <Navbar user={user} onLogout={handleLogout} />}
        <div className="container">
          <Routes>
            {/* Home Page (Default route) */}
            <Route path="/" element={<Home />} />
            
            <Route
              path="/login"
              element={isLoggedIn ? <Navigate to={isAdmin() ? "/admin/dashboard" : "/dashboard"} /> : <Login onLogin={handleLogin} />}
            />
            <Route
              path="/register"
              element={isLoggedIn ? <Navigate to={isAdmin() ? "/admin/dashboard" : "/dashboard"} /> : <Register />}
            />
            <Route
              path="/dashboard"
              element={isLoggedIn ? <Dashboard user={user} /> : <Navigate to="/" />}
            />
            <Route
              path="/select-team"
              element={isLoggedIn ? <SelectTeam user={user} setUser={setUser} /> : <Navigate to="/" />}
            />
            <Route
              path="/team"
              element={isLoggedIn ? <TeamView user={user} setUser={setUser} /> : <Navigate to="/" />}
            />
            <Route
              path="/budget"
              element={isLoggedIn ? <BudgetView user={user} /> : <Navigate to="/" />}
            />
            <Route
              path="/leaderboard"
              element={isLoggedIn ? <Leaderboard /> : <Navigate to="/" />}
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={isLoggedIn && isAdmin() ? <AdminDashboard user={user} /> : <Navigate to="/" />}
            />
            <Route
              path="/admin/*"
              element={isLoggedIn && isAdmin() ? <AdminDashboard user={user} /> : <Navigate to="/" />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
