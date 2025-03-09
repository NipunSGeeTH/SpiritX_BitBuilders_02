// AdminUsers.js - Component to manage users
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        // You'll need to add a new admin route to get all users
        const response = await axios.get('http://localhost:4000/api/leaderboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-users">
      <h2>User Leaderboard</h2>
      
      <div className="table-responsive">
        <table className="users-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Team Name</th>
              <th>Total Points</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.username}>
                <td>{user.rank}</td>
                <td>{user.username}</td>
                <td>{user.teamName}</td>
                <td>{user.totalPoints.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;