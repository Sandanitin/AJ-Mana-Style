import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://seashell-yak-534067.hostingersite.com/backend/api';
      const response = await fetch(`${API_BASE_URL}/auth.php?action=change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setError(data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setError('An error occurred while changing your password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-primary dark:text-secondary hover:opacity-80 transition-opacity mb-4"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="font-body">Back</span>
          </button>
          <h1 className="text-3xl font-bold font-display text-text-light dark:text-text-dark mb-2">Settings</h1>
          <p className="text-text-light/60 dark:text-text-dark/60 font-body">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Change Password Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold font-display text-primary dark:text-secondary mb-2">Change Password</h2>
            <p className="text-sm text-text-light/60 dark:text-text-dark/60 font-body">
              Update your password to keep your account secure
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-300 font-body">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-300 font-body">{success}</p>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-semibold text-text-light dark:text-text-dark mb-2 font-body">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent font-body"
                placeholder="Enter current password"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-text-light dark:text-text-dark mb-2 font-body">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent font-body"
                placeholder="Enter new password (min. 6 characters)"
              />
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-sm font-semibold text-text-light dark:text-text-dark mb-2 font-body">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent font-body"
                placeholder="Confirm new password"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary dark:bg-secondary text-white dark:text-primary px-6 py-3 rounded-lg font-semibold font-body hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Changing Password...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>

        {/* Account Info */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold font-display text-primary dark:text-secondary mb-4">Account Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-text-light/60 dark:text-text-dark/60 font-body">Email</p>
              <p className="text-text-light dark:text-text-dark font-body font-semibold">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-text-light/60 dark:text-text-dark/60 font-body">Name</p>
              <p className="text-text-light dark:text-text-dark font-body font-semibold">{user.name || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-text-light/60 dark:text-text-dark/60 font-body">Phone</p>
              <p className="text-text-light dark:text-text-dark font-body font-semibold">{user.phone || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
