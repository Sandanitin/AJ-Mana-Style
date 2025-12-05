import React, { useState } from 'react';

const ProfileModal = ({ user, isOpen, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || ''
  });

  // Update form data when user prop changes
  React.useEffect(() => {
    if (user) {
      console.log('User data in ProfileModal:', user); // Debug log
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || ''
      });
    }
  }, [user]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    // Update user profile via API
    try {
      const response = await fetch('https://vastranilooms.com/backend/api/auth.php?action=update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          phone: formData.phone
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update localStorage with server response
        const updatedUser = {
          ...JSON.parse(localStorage.getItem('user') || '{}'),
          ...data.user
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Trigger event to notify other components
        window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }));
        
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating your profile');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 animate-fadeIn"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-background-light dark:bg-background-dark rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-br from-primary/10 to-transparent dark:from-secondary/10 dark:to-transparent border-b border-primary/20 dark:border-secondary/20 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary/80 dark:from-secondary dark:to-secondary/80 text-white dark:text-primary font-bold text-2xl shadow-lg">
                  {getInitials(user?.name)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-display text-text-light dark:text-text-dark">My Profile</h2>
                  <p className="text-sm text-text-light/60 dark:text-text-dark/60">Manage your account information</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 dark:bg-secondary/10 hover:bg-primary/20 dark:hover:bg-secondary/20 transition-colors"
              >
                <span className="material-symbols-outlined text-2xl text-text-light dark:text-text-dark">close</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Account Information */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold font-display text-primary dark:text-secondary">Account Information</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-secondary/10 hover:bg-primary/20 dark:hover:bg-secondary/20 text-primary dark:text-secondary rounded-lg transition-colors text-sm font-semibold"
                  >
                    <span className="material-symbols-outlined text-lg">edit</span>
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user?.name || '',
                          email: user?.email || '',
                          phone: user?.phone || '',
                          address: user?.address || '',
                          city: user?.city || '',
                          state: user?.state || '',
                          pincode: user?.pincode || ''
                        });
                      }}
                      className="px-4 py-2 border border-primary/30 dark:border-secondary/30 text-text-light dark:text-text-dark rounded-lg hover:bg-primary/5 dark:hover:bg-secondary/5 transition-colors text-sm font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-primary dark:bg-secondary text-white dark:text-primary rounded-lg hover:opacity-90 transition-opacity text-sm font-semibold"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-text-light dark:text-text-dark mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-primary/30 dark:border-secondary/30 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-primary/5 dark:bg-secondary/5 rounded-lg text-text-light dark:text-text-dark">
                      {user?.name || 'Not provided'}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-text-light dark:text-text-dark mb-2">
                    Email Address
                  </label>
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 dark:bg-secondary/5 rounded-lg text-text-light dark:text-text-dark">
                    <span>{user?.email || 'Not provided'}</span>
                    <span className="material-symbols-outlined text-green-600 text-sm" title="Email Verified">verified</span>
                  </div>
                  <p className="text-xs text-text-light/60 dark:text-text-dark/60 mt-1">Email cannot be changed</p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-text-light dark:text-text-dark mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-primary/30 dark:border-secondary/30 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-primary/5 dark:bg-secondary/5 rounded-lg text-text-light dark:text-text-dark">
                      {user?.phone || 'Not provided'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileModal;
