import React, { useState } from 'react';

const UserProfile = ({ currentUser, handleLogout, handleUpdateProfile }) => {
  const [formData, setFormData] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    childFirstName: currentUser.childFirstName,
    childLastName: currentUser.childLastName,
    childDob: currentUser.childDob,
    password: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [editMode, setEditMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [updatedSuccessfully, setUpdatedSuccessfully] = useState(false);
  const [passwordUpdatedSuccessfully, setPasswordUpdatedSuccessfully] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setUpdatedSuccessfully(false);
    setPasswordUpdatedSuccessfully(false);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const toggleChangePasswordMode = () => {
    setChangePasswordMode(!changePasswordMode);
    setFormData({
      ...formData,
      newPassword: '',
      confirmNewPassword: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isFormEdited =
      formData.firstName !== currentUser.firstName ||
      formData.lastName !== currentUser.lastName ||
      formData.childFirstName !== currentUser.childFirstName ||
      formData.childLastName !== currentUser.childLastName ||
      formData.childDob !== currentUser.childDob;

    if (isFormEdited || (changePasswordMode && formData.newPassword && formData.newPassword === formData.confirmNewPassword)) {
      await handleUpdateProfile(formData);
      setUpdatedSuccessfully(true);
      setEditMode(false);
      setChangePasswordMode(false);
      if (changePasswordMode && formData.newPassword) {
        setPasswordUpdatedSuccessfully(true);
      }
    } else {
      if (changePasswordMode && formData.newPassword !== formData.confirmNewPassword) {
        alert('Passwords do not match.');
      } else {
        alert('No changes made.');
      }
    }
  };

  if (!currentUser) {
    return <p>Loading...</p>;
  }

  return (
    <div className="user-profile card">
      <h2>Welcome to Smile2Steps</h2>
      <div>
        <p><strong>Username:</strong> {currentUser.username}</p>
        <p><strong>Email:</strong> {currentUser.email}</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              First Name: {' '}
              {editMode ? (
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              ) : (
                <span>{formData.firstName}</span>
              )}
            </label>
          </div>
          <div className="form-group">
            <label>
              Last Name: {' '}
              {editMode ? (
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              ) : (
                <span>{formData.lastName}</span>
              )}
            </label>
          </div>
          <div className="form-group">
            <label>
              Child's First Name: {' '}
              {editMode ? (
                <input
                  type="text"
                  name="childFirstName"
                  value={formData.childFirstName}
                  onChange={handleChange}
                />
              ) : (
                <span>{formData.childFirstName}</span>
              )}
            </label>
          </div>
          <div className="form-group">
            <label>
              Child's Last Name: {' '}
              {editMode ? (
                <input
                  type="text"
                  name="childLastName"
                  value={formData.childLastName}
                  onChange={handleChange}
                />
              ) : (
                <span>{formData.childLastName}</span>
              )}
            </label>
          </div>
          <div className="form-group">
            <label>
              Child's Date of Birth: {' '}
              {editMode ? (
                <input
                  type="date"
                  name="childDob"
                  value={formData.childDob}
                  onChange={handleChange}
                />
              ) : (
                <span>{formData.childDob}</span>
              )}
            </label>
          </div>
          {editMode && (
            <>
              <button type="submit">Save Profile Changes</button>
              <button type="button" onClick={toggleEditMode}>Cancel Profile Changes</button>
            </>
          )}
          {!editMode && !changePasswordMode && (
            <button type="button" onClick={toggleEditMode}>Update Profile Details</button>
          )}
        </form>
        {passwordUpdatedSuccessfully && <p>Password updated successfully!</p>}
        {updatedSuccessfully && !passwordUpdatedSuccessfully && <p>Profile updated successfully!</p>}
      </div>
      {!editMode && !changePasswordMode && (
        <div>
          <button type="button" onClick={toggleChangePasswordMode}>Change Password</button>
        </div>
      )}
      {changePasswordMode && (
        <div>
          <div className="form-group">
            <label>
              New Password: {' '}
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              Confirm New Password: {' '}
              <input
                type="password"
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleChange}
              />
            </label>
          </div>
          <button type="submit" onClick={handleSubmit}>Save Password</button>
          <button type="button" onClick={toggleChangePasswordMode}>Cancel Password Change</button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
