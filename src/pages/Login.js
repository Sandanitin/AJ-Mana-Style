import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showOTPScreen, setShowOTPScreen] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resetEmail, setResetEmail] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [resetPasswordData, setResetPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();
  
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://seashell-yak-534067.hostingersite.com/backend/api';

  // Timer for resend OTP
  React.useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.charAt(0);
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');
    
    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;
    
    const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setOtp(newOtp);
    
    // Focus last filled input
    const lastIndex = Math.min(pastedData.length, 5);
    document.getElementById(`otp-${lastIndex}`)?.focus();
  };

  const verifyOTP = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth.php?action=verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: otpEmail, otp: otpCode })
      });
      
      const result = await response.json();
      
      if (result.success) {
        localStorage.setItem('user', JSON.stringify(result.user));
        navigate('/');
        window.location.reload();
      } else {
        setError(result.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    if (resendTimer > 0) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth.php?action=resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: otpEmail })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setOtp(['', '', '', '', '', '']);
        setResendTimer(60);
        setError('');
        alert('New OTP sent to your email');
      } else {
        setError(result.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth.php?action=forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setOtpEmail(resetEmail);
        setShowForgotPassword(false);
        setShowResetPassword(true);
        setResendTimer(60);
      } else {
        setError(result.message || 'Failed to send reset code');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setError('Failed to send reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (resetPasswordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth.php?action=reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: otpEmail,
          otp: otpCode,
          newPassword: resetPasswordData.newPassword
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('Password reset successful! Please login with your new password.');
        setShowResetPassword(false);
        setOtp(['', '', '', '', '', '']);
        setResetPasswordData({ newPassword: '', confirmPassword: '' });
        setResetEmail('');
        setIsLogin(true);
      } else {
        setError(result.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth.php?action=google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ credential: credentialResponse.credential })
      });
      
      const result = await response.json();
      
      if (result.success) {
        localStorage.setItem('user', JSON.stringify(result.user));
        navigate('/');
        window.location.reload();
      } else {
        setError(result.message || 'Google login failed');
      }
    } catch (error) {
      console.error('Google login error:', error);
      setError('Failed to login with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google login was cancelled or failed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Check for static admin credentials
    if (isLogin && formData.email === 'admin' && formData.password === 'admin@123') {
      // Static admin login
      const adminUser = {
        id: 'admin',
        name: 'Admin',
        email: 'admin@vastrani.com',
        role: 'admin'
      };
      
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
      localStorage.setItem('adminToken', 'admin-token');
      
      // Redirect to admin panel
      navigate('/admin');
      return;
    }
    
    // Validation
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      const endpoint = isLogin ? 'login' : 'register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password, phone: formData.phone };
      
      const response = await fetch(`${API_BASE_URL}/auth.php?action=${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Store user in localStorage
        localStorage.setItem('user', JSON.stringify(result.user));
        
        // Redirect to homepage
        navigate('/');
        window.location.reload(); // Reload to update header
      } else if (result.requiresOTP) {
        // Show OTP verification screen
        setOtpEmail(result.email);
        setShowOTPScreen(true);
        setResendTimer(60);
        setError('');
      } else {
        setError(result.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background-light to-secondary/5 dark:from-primary/10 dark:via-background-dark dark:to-secondary/10">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <img 
              src="/Logo_Transparent.png" 
              alt="Vastrani Looms" 
              className="h-16 w-16 object-contain"
            />
            <h1 className="text-3xl font-bold font-display text-primary dark:text-secondary">
              Vastrani Looms
            </h1>
          </Link>
          <p className="mt-2 text-sm font-body text-text-light/70 dark:text-text-dark/70">
            {showOTPScreen 
              ? 'Enter the OTP sent to your email' 
              : (isLogin ? 'Welcome back! Sign in to your account' : 'Create your account to get started')
            }
          </p>
        </div>

        {/* OTP Verification Screen */}
        {showOTPScreen ? (
          <div className="decorative-frame bg-background-light dark:bg-background-dark p-8 rounded-lg shadow-xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 dark:bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary dark:text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold font-display text-text-light dark:text-text-dark mb-2">
                Verify Your Email
              </h2>
              <p className="text-sm text-text-light/70 dark:text-text-dark/70">
                We've sent a 6-digit code to
              </p>
              <p className="text-sm font-semibold text-primary dark:text-secondary mt-1">
                {otpEmail}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* OTP Input */}
            <div className="flex gap-2 justify-center mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={index === 0 ? handleOtpPaste : undefined}
                  className="w-12 h-12 text-center text-xl font-bold border-2 border-primary/30 dark:border-secondary/30 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent"
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              onClick={verifyOTP}
              disabled={loading || otp.join('').length !== 6}
              className="w-full py-3 bg-primary text-white dark:bg-secondary dark:text-primary rounded-lg font-semibold font-body hover:bg-primary/90 dark:hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            {/* Resend OTP */}
            <div className="text-center">
              <button
                onClick={resendOTP}
                disabled={resendTimer > 0 || loading}
                className="text-sm font-body text-primary dark:text-secondary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendTimer > 0 
                  ? `Resend OTP in ${resendTimer}s` 
                  : 'Resend OTP'
                }
              </button>
            </div>

            {/* Back Button */}
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setShowOTPScreen(false);
                  setOtp(['', '', '', '', '', '']);
                  setError('');
                }}
                className="text-sm font-body text-text-light/70 dark:text-text-dark/70 hover:text-primary dark:hover:text-secondary"
              >
                ← Back to Login
              </button>
            </div>
          </div>
        ) : showForgotPassword ? (
          /* Forgot Password Screen */
          <div className="decorative-frame bg-background-light dark:bg-background-dark p-8 rounded-lg shadow-xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 dark:bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary dark:text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold font-display text-text-light dark:text-text-dark mb-2">
                Forgot Password?
              </h2>
              <p className="text-sm text-text-light/70 dark:text-text-dark/70">
                Enter your email address and we'll send you a code to reset your password
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium font-body text-text-light dark:text-text-dark mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-primary/30 dark:border-secondary/30 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary text-white dark:bg-secondary dark:text-primary rounded-lg font-semibold font-body hover:bg-primary/90 dark:hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Reset Code'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmail('');
                  setError('');
                }}
                className="text-sm font-body text-text-light/70 dark:text-text-dark/70 hover:text-primary dark:hover:text-secondary"
              >
                ← Back to Login
              </button>
            </div>
          </div>
        ) : showResetPassword ? (
          /* Reset Password Screen */
          <div className="decorative-frame bg-background-light dark:bg-background-dark p-8 rounded-lg shadow-xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 dark:bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary dark:text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold font-display text-text-light dark:text-text-dark mb-2">
                Reset Password
              </h2>
              <p className="text-sm text-text-light/70 dark:text-text-dark/70">
                Enter the code sent to <span className="font-semibold text-primary dark:text-secondary">{otpEmail}</span>
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* OTP Input */}
              <div>
                <label className="block text-sm font-medium font-body text-text-light dark:text-text-dark mb-2">
                  Verification Code
                </label>
                <div className="flex gap-2 justify-center mb-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={index === 0 ? handleOtpPaste : undefined}
                      className="w-10 h-10 text-center text-lg font-bold border-2 border-primary/30 dark:border-secondary/30 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent"
                    />
                  ))}
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium font-body text-text-light dark:text-text-dark mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={resetPasswordData.newPassword}
                  onChange={(e) => setResetPasswordData({ ...resetPasswordData, newPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-primary/30 dark:border-secondary/30 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent"
                  placeholder="Enter new password"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium font-body text-text-light dark:text-text-dark mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={resetPasswordData.confirmPassword}
                  onChange={(e) => setResetPasswordData({ ...resetPasswordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-primary/30 dark:border-secondary/30 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent"
                  placeholder="Confirm new password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary text-white dark:bg-secondary dark:text-primary rounded-lg font-semibold font-body hover:bg-primary/90 dark:hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={resendOTP}
                  disabled={resendTimer > 0 || loading}
                  className="text-sm font-body text-primary dark:text-secondary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendTimer > 0 
                    ? `Resend code in ${resendTimer}s` 
                    : 'Resend code'
                  }
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setShowResetPassword(false);
                  setOtp(['', '', '', '', '', '']);
                  setResetPasswordData({ newPassword: '', confirmPassword: '' });
                  setError('');
                }}
                className="text-sm font-body text-text-light/70 dark:text-text-dark/70 hover:text-primary dark:hover:text-secondary"
              >
                ← Back to Login
              </button>
            </div>
          </div>
        ) : (
          /* Login/Register Form */
          <>
        {/* Form Card */}
        <div className="decorative-frame bg-background-light dark:bg-background-dark p-8 rounded-lg shadow-xl">
          {/* Toggle Buttons */}
          <div className="flex gap-2 mb-6 bg-primary/5 dark:bg-secondary/5 p-1 rounded-lg">
            <button
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
              className={`flex-1 py-2 px-4 rounded-md font-semibold font-body transition-all ${
                isLogin
                  ? 'bg-primary text-white dark:bg-secondary dark:text-primary shadow-md'
                  : 'text-text-light dark:text-text-dark hover:bg-primary/10 dark:hover:bg-secondary/10'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError('');
              }}
              className={`flex-1 py-2 px-4 rounded-md font-semibold font-body transition-all ${
                !isLogin
                  ? 'bg-primary text-white dark:bg-secondary dark:text-primary shadow-md'
                  : 'text-text-light dark:text-text-dark hover:bg-primary/10 dark:hover:bg-secondary/10'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium font-body text-text-light dark:text-text-dark mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-primary/30 dark:border-secondary/30 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium font-body text-text-light dark:text-text-dark mb-2">
                {isLogin ? 'Email or Username *' : 'Email Address *'}
              </label>
              <input
                type={isLogin ? "text" : "email"}
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-primary/30 dark:border-secondary/30 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent"
                placeholder={isLogin ? "Enter your email or username" : "Enter your email"}
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium font-body text-text-light dark:text-text-dark mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-primary/30 dark:border-secondary/30 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium font-body text-text-light dark:text-text-dark mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-primary/30 dark:border-secondary/30 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium font-body text-text-light dark:text-text-dark mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-primary/30 dark:border-secondary/30 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent"
                  placeholder="Confirm your password"
                />
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="font-body text-text-light dark:text-text-dark">Remember me</span>
                </label>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowForgotPassword(true);
                    setError('');
                  }}
                  className="font-body text-primary dark:text-secondary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white dark:bg-secondary dark:text-primary rounded-lg font-semibold font-body hover:bg-primary/90 dark:hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-primary/20 dark:border-secondary/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background-light dark:bg-background-dark font-body text-text-light/70 dark:text-text-dark/70">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-4">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                size="large"
                width="100%"
                text={isLogin ? "signin_with" : "signup_with"}
              />
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <p className="mt-6 text-center text-sm font-body text-text-light/70 dark:text-text-dark/70">
          <Link to="/" className="text-primary dark:text-secondary hover:underline">
            ← Back to Home
          </Link>
        </p>
        </>
        )}
      </div>
    </div>
  );
};

export default Login;
