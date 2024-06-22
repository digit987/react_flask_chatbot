import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const UserSignup = ({ handleSignup }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    if (Object.values(formData).some((field) => field.trim() === '')) {
      setError('All fields are required.');
      return;
    }
    try {
      await handleSignup(formData);
    } catch (error) {
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <div className="card form-container">
        <h1>Sign Up to Smile2Steps</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid-container">
            <div className="grid-item">
              <label>Username</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} />
            </div>
            <div className="grid-item">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="grid-item">
              <label>First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
            </div>
            <div className="grid-item">
              <label>Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
            </div>
            <div className="grid-item">
              <label>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} />
            </div>
            <div className="grid-item">
              <label>Confirm Password</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
            </div>
          </div>
          <button type="submit" className="input-btn">Sign Up</button>
        </form>
        <p>If already a user, please <Link to="/">login</Link></p>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default UserSignup;
