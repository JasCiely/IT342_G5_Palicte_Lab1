import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../components/css/Auth.css';
import { Mail, Lock, User, ArrowRight, ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react';
import logo from '../assets/logo.png';

const Auth = () => {
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
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleGuestContinue = () => {
    localStorage.setItem("isAuthenticated", "false");
    localStorage.setItem("userRole", "GUEST");
    navigate('/home'); 
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Must be at least 6 characters';
    }
    
    if (!isLogin) {
      if (!formData.firstName) {
        newErrors.firstName = 'First name is required';
      } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName)) {
        newErrors.firstName = 'Only letters and spaces allowed';
      }
      
      if (!formData.lastName) {
        newErrors.lastName = 'Last name is required';
      } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName)) {
        newErrors.lastName = 'Only letters and spaces allowed';
      }
      
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
        const response = await api.post('/auth/login', {
          email: formData.email,
          password: formData.password
        });
        
        if (response.data.startsWith("Login Success")) {
          const parts = response.data.split(":");
          const role = parts[1];
          
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("userRole", role);
          localStorage.setItem("userEmail", formData.email);
          
          alert("Login successful!");
          navigate('/dashboard');
        } else {
          alert(response.data);
        }
      } else {
        const response = await api.post('/auth/register', {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        });
        
        alert(response.data);
        
        if (response.data === "Account securely created.") {
          setIsLogin(true);
          setFormData({
            firstName: '',
            lastName: '',
            email: formData.email,
            password: '',
            confirmPassword: ''
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        alert("Error: " + (error.response.data || "Request failed"));
      } else if (error.request) {
        alert("Cannot connect to server. Please check if backend is running.");
      } else {
        alert("An error occurred: " + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <div className="auth-header">
          <div className="auth-logo-container">
            <img src={logo} alt="EventWear Logo" className="auth-brand-logo" />
          </div>
          <p className="auth-subtitle">
            {isLogin ? 'Sign in to manage your bookings' : 'Create an account to get started'}
          </p>
        </div>

        <div className="auth-toggle">
          <button 
            type="button"
            className={`toggle-btn ${isLogin ? 'active' : ''}`} 
            onClick={() => { setIsLogin(true); setErrors({}); }}
          >
            Sign In
          </button>
          <button 
            type="button"
            className={`toggle-btn ${!isLogin ? 'active' : ''}`} 
            onClick={() => { setIsLogin(false); setErrors({}); }}
          >
            Create Account
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
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
                  />
                </div>
                {errors.firstName && <div className="error-message"><AlertCircle size={12}/>{errors.firstName}</div>}
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
                  />
                </div>
                {errors.lastName && <div className="error-message"><AlertCircle size={12}/>{errors.lastName}</div>}
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
              />
            </div>
            {errors.email && <div className="error-message"><AlertCircle size={12}/>{errors.email}</div>}
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
              />
              <button 
                type="button" 
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <div className="error-message"><AlertCircle size={12}/>{errors.password}</div>}
          </div>

          {isLogin && (
             <div className="forgot-pass">
                <a href="#" onClick={(e) => e.preventDefault()}>Forgot password?</a>
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
                />
                <button 
                  type="button" 
                  className="eye-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <div className="error-message"><AlertCircle size={12}/>{errors.confirmPassword}</div>}
            </div>
          )}

          <button 
            type="submit" 
            className="submit-btn" 
            disabled={isLoading}
          >
            {isLoading ? (
              <span>Processing...</span>
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Create Account'} 
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
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