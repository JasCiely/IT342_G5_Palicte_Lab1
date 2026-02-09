import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../components/css/Auth.css';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  AlertCircle
} from 'lucide-react';
import logo from '../assets/logo.png';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  // Create axios instance
  const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field if user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleGuestContinue = () => {
    localStorage.setItem("isAuthenticated", "false");
    localStorage.setItem("userRole", "GUEST");
    localStorage.setItem("userEmail", "guest@example.com");
    navigate('/home'); 
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Registration-specific validations
    if (!isLogin) {
      // First name validation
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName)) {
        newErrors.firstName = 'Only letters and spaces allowed';
      } else if (formData.firstName.trim().length < 2) {
        newErrors.firstName = 'First name must be at least 2 characters';
      }
      
      // Last name validation
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName)) {
        newErrors.lastName = 'Only letters and spaces allowed';
      } else if (formData.lastName.trim().length < 2) {
        newErrors.lastName = 'Last name must be at least 2 characters';
      }
      
      // Confirm password validation
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        // LOGIN REQUEST
        const response = await api.post('/auth/login', {
          email: formData.email,
          password: formData.password
        });
        
        if (response.data && response.data.startsWith("Login Success")) {
          const parts = response.data.split(":");
          const role = parts[1]?.trim() || "USER";
          
          // Store authentication info
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("userRole", role);
          localStorage.setItem("userEmail", formData.email);
          
          // Call the onLogin callback
          if (onLogin) {
            onLogin();
          }
          
          alert(`Login successful! Welcome ${formData.email}`);
          navigate('/dashboard');
        } else {
          alert(response.data || "Login failed. Please check your credentials.");
        }
      } else {
        // REGISTER REQUEST
        const response = await api.post('/auth/register', {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        });
        
        if (response.data === "Account securely created.") {
          alert("🎉 Account created successfully! You can now login.");
          
          // Switch to login view with email pre-filled
          setIsLogin(true);
          setFormData({
            firstName: '',
            lastName: '',
            email: formData.email,
            password: '',
            confirmPassword: ''
          });
          
          // Clear errors
          setErrors({});
        } else {
          alert(response.data || "Registration failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("API Error:", error);
      
      // Enhanced error handling
      if (error.response) {
        const status = error.response.status;
        const errorMessage = error.response.data || "Request failed";
        
        switch (status) {
          case 400:
            alert(`Error: ${errorMessage}`);
            break;
          case 401:
            alert("Invalid email or password. Please try again.");
            break;
          case 409:
            alert("Email already registered. Please login or use a different email.");
            break;
          case 500:
            alert("Server error. Please try again later.");
            break;
          default:
            alert(`Error ${status}: ${errorMessage}`);
        }
      } else if (error.request) {
        alert("Cannot connect to server. Please make sure the backend is running on http://localhost:8080");
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert("Password reset feature coming soon!");
  };

  const clearForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <button 
          className="back-btn" 
          onClick={() => navigate('/')}
          disabled={isLoading}
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>

        <div className="auth-header">
          <div className="auth-logo-container">
            <img src={logo} alt="EventWear Logo" className="auth-brand-logo" />
          </div>
          <h1 className="auth-title">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="auth-subtitle">
            {isLogin 
              ? 'Sign in to manage your bookings and rentals' 
              : 'Join EventWear to get started with premium rentals'
            }
          </p>
        </div>

        <div className="auth-toggle">
          <button 
            type="button"
            className={`toggle-btn ${isLogin ? 'active' : ''}`} 
            onClick={() => { 
              setIsLogin(true); 
              setErrors({}); 
            }}
            disabled={isLoading}
          >
            Sign In
          </button>
          <button 
            type="button"
            className={`toggle-btn ${!isLogin ? 'active' : ''}`} 
            onClick={() => { 
              setIsLogin(false); 
              setErrors({}); 
            }}
            disabled={isLoading}
          >
            Create Account
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {!isLogin && (
            <div className="name-row">
              <div className={`input-group ${errors.firstName ? 'has-error' : ''}`}>
                <label>First Name</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={18} />
                  <input 
                    type="text" 
                    name="firstName" 
                    placeholder="Juan" 
                    value={formData.firstName} 
                    onChange={handleChange} 
                    className={errors.firstName ? 'error-input' : ''}
                    disabled={isLoading}
                    maxLength={50}
                  />
                </div>
                {errors.firstName && (
                  <div className="error-message">
                    <AlertCircle size={12}/>
                    {errors.firstName}
                  </div>
                )}
              </div>
              <div className={`input-group ${errors.lastName ? 'has-error' : ''}`}>
                <label>Last Name</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={18} />
                  <input 
                    type="text" 
                    name="lastName" 
                    placeholder="Dela Cruz" 
                    value={formData.lastName} 
                    onChange={handleChange} 
                    className={errors.lastName ? 'error-input' : ''}
                    disabled={isLoading}
                    maxLength={50}
                  />
                </div>
                {errors.lastName && (
                  <div className="error-message">
                    <AlertCircle size={12}/>
                    {errors.lastName}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className={`input-group ${errors.email ? 'has-error' : ''}`}>
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input 
                type="email" 
                name="email" 
                placeholder="you@example.com" 
                value={formData.email} 
                onChange={handleChange} 
                className={errors.email ? 'error-input' : ''}
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <div className="error-message">
                <AlertCircle size={12}/>
                {errors.email}
              </div>
            )}
          </div>

          <div className={`input-group ${errors.password ? 'has-error' : ''}`}>
            <label>Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                placeholder="••••••••" 
                value={formData.password} 
                onChange={handleChange} 
                className={errors.password ? 'error-input' : ''}
                disabled={isLoading}
                autoComplete={isLogin ? "current-password" : "new-password"}
                minLength={6}
              />
              <button 
                type="button" 
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <div className="error-message">
                <AlertCircle size={12}/>
                {errors.password}
              </div>
            )}
            {!isLogin && (
              <div className="password-hint">
                Must be at least 6 characters long
              </div>
            )}
          </div>

          {isLogin && (
            <div className="forgot-pass">
              <a href="#" onClick={handleForgotPassword}>
                Forgot password?
              </a>
            </div>
          )}

          {!isLogin && (
            <div className={`input-group ${errors.confirmPassword ? 'has-error' : ''}`}>
              <label>Confirm Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  name="confirmPassword" 
                  placeholder="••••••••" 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  className={errors.confirmPassword ? 'error-input' : ''}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button 
                  type="button" 
                  className="eye-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex="-1"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="error-message">
                  <AlertCircle size={12}/>
                  {errors.confirmPassword}
                </div>
              )}
            </div>
          )}

          <button 
            type="submit" 
            className="submit-btn" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                <span>Processing...</span>
              </>
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Create Account'} 
                <ArrowRight size={18} />
              </>
            )}
          </button>
          
          <button 
            type="button" 
            className="clear-btn"
            onClick={clearForm}
            disabled={isLoading}
          >
            Clear Form
          </button>
        </form>

        <div className="auth-footer">
          <p className="switch-text">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              type="button" 
              className="switch-btn"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
              }}
              disabled={isLoading}
            >
              {isLogin ? ' Sign up here' : ' Sign in here'}
            </button>
          </p>
          
          <div className="separator">
            <span>or</span>
          </div>
          
          <p className="guest-text">Just browsing?</p>
          <button 
            type="button" 
            className="guest-btn" 
            onClick={handleGuestContinue}
            disabled={isLoading}
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;