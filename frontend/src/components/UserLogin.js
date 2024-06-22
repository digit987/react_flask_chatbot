import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const UserLogin = ({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() === '' || password.trim() === '') {
      setError('Username and password are required.');
      return;
    }
    handleLogin({ username, password });
  };

  return (
    <div className="centered">
      <div className="form-container">
        <h1>Welcome to Smile2Steps</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit">Login</button>
        </form>
        <p>If not already a user, please <Link to="/signup">sign up</Link></p>
      </div>
    </div>
  );
};

export default UserLogin;
