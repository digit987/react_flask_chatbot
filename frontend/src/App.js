import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import UserLogin from './components/UserLogin';
import UserSignup from './components/UserSignup';
import ChatWindow from './components/ChatWindow';
import UserProfile from './components/UserProfile';
import './App.css';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    try {
      const response = await fetch('http://pyany123.pythonanywhere.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        setCurrentUser(data.user);
        navigate('/chat');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleSignup = async (credentials) => {
    try {
      const response = await fetch('http://pyany123.pythonanywhere.com/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        setCurrentUser(data.user);
        navigate('/chat');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://pyany123.pythonanywhere.com/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (response.ok) {
        setCurrentUser(null);
        navigate('/');
      } else {
        alert('Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Logout failed. Please try again.');
    }
  };

  const handleUpdateProfile = async (formData) => {
    try {
      const response = await fetch('http://pyany123.pythonanywhere.com/api/update_profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        setCurrentUser(data.user);
        alert('Profile updated successfully.');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Profile update failed. Please try again.');
    }
  };  

  return (
    <div>
      <nav className={!currentUser ? 'hidden' : ''}>
        <div className="menu-right">
          {currentUser ? (
            <div className="dropdown">
              <button className="dropbtn">Hi, {currentUser.username}!</button>
              <div className="dropdown-content">
                <Link to="/chat">Chat</Link>
                <Link to="/profile">Profile</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          ) : null}
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<UserLogin handleLogin={handleLogin} />} />
        {currentUser ? (
          <>
            <Route path="/chat" element={<ChatWindow />} />
            <Route
              path="/profile"
              element={
                <UserProfile
                  currentUser={currentUser}
                  handleLogout={handleLogout}
                  handleUpdateProfile={handleUpdateProfile}
                />
              }
            />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
        <Route path="/signup" element={<UserSignup handleSignup={handleSignup} />} />
      </Routes>
    </div>
  );
};

export default App;
