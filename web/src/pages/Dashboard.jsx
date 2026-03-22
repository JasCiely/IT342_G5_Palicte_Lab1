import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/DashboardContent/DashboardHeader';
import DashboardNav from '../components/DashboardContent/DashboardNav';
import StatsGrid from '../components/DashboardContent/StatsGrid';
import RecentBookings from '../components/DashboardContent/RecentBookings';
import AvailableOutfits from '../components/DashboardContent/AvailableOutfits';
import { ArrowLeft } from 'lucide-react';
import '../components/css/Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Check authentication status from multiple sources
    const authStatus = localStorage.getItem("isAuthenticated");
    const userRole = localStorage.getItem("userRole");
    const userData = localStorage.getItem("userData");

    console.log("🔍 Dashboard checking auth:", { 
      authStatus, 
      userRole, 
      hasUserProp: !!user,
      hasLocalStorage: !!(authStatus || userData)
    });

    // Priority 1: Use user prop from App (most reliable for fresh sessions)
    if (user) {
      console.log("✅ Using user from App props");
      setIsGuest(user.isGuest || user.role === 'GUEST');
      setCurrentUser(user);
      return;
    }

    // Priority 2: Check localStorage
    if (authStatus === "guest" || userRole === "GUEST") {
      // Guest user
      console.log("✅ Guest user detected in localStorage");
      setIsGuest(true);
      const guestData = userData ? JSON.parse(userData) : {
        firstName: 'Guest',
        lastName: 'User',
        email: 'guest@eventwear.com',
        role: 'GUEST',
        isGuest: true
      };
      setCurrentUser(guestData);
    } else if (authStatus === "true" && userData) {
      // Authenticated user from localStorage
      console.log("✅ Authenticated user detected in localStorage");
      try {
        const parsedUser = JSON.parse(userData);
        setIsGuest(parsedUser.isGuest || false);
        setCurrentUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse user data:", e);
        console.log("❌ Redirecting to /auth due to parse error");
        navigate('/auth', { replace: true });
      }
    } else {
      // No valid authentication found
      console.log("❌ No valid auth - redirecting to /auth");
      navigate('/auth', { replace: true });
    }
  }, [user, navigate]);

  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userData");
    
    // Call parent logout handler
    if (onLogout) {
      onLogout();
    }
    
    // Navigate to home
    navigate('/');
  };

  const handleUpgradePrompt = () => {
    console.log("🟢 Create Account button clicked!");
    
    // Clear guest session
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userData");
    
    console.log("✅ Guest session cleared");
    
    // Clear App.js state by calling onLogout
    if (onLogout) {
      onLogout();
    }
    
    console.log("🚀 Navigating to /auth with signup tab...");
    
    // Navigate to auth page with 'signup' state to show Create Account tab
    navigate('/auth', { state: { tab: 'signup' } });
  };

  const handleBackToAuth = () => {
    console.log("🔙 Back to Sign In clicked!");
    
    // Clear guest session
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userData");
    
    console.log("✅ Guest session cleared");
    
    // Clear App.js state by calling onLogout
    if (onLogout) {
      onLogout();
    }
    
    console.log("🚀 Navigating to /auth...");
    
    // Navigate to auth page without state (will default to Sign In)
    navigate('/auth');
  };

  if (!currentUser) {
    // Don't show loading - just return null and let useEffect handle redirect
    return null;
  }

  return (
    <div className="dashboard-container">
      {/* Back Button - Only show for guest users */}
      {isGuest && (
        <button 
          className="dashboard-back-btn" 
          onClick={handleBackToAuth}
        >
          <ArrowLeft size={16} />
        </button>
      )}

      <DashboardHeader 
        userName={currentUser.firstName}
        isGuest={isGuest}
        onLogout={handleLogout}
        onUpgrade={handleUpgradePrompt}
      />
      
      <DashboardNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        isGuest={isGuest}
      />
      
      <main className="dashboard-main">
        {isGuest && (
          <div className="guest-banner">
            <div className="guest-banner-content">
              <div className="guest-banner-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div className="guest-banner-text">
                <h3>You're Browsing as a Guest</h3>
                <p>Create an account to unlock bookings, save favorites, and get exclusive rental deals!</p>
              </div>
              <button className="guest-banner-btn" onClick={handleUpgradePrompt}>
                Create Account
              </button>
            </div>
          </div>
        )}

        {activeTab === 'Overview' && (
          <>
            <StatsGrid isGuest={isGuest} />
            <RecentBookings isGuest={isGuest} onUpgrade={handleUpgradePrompt} />
            <AvailableOutfits isGuest={isGuest} onUpgrade={handleUpgradePrompt} />
          </>
        )}
        
        {activeTab === 'My Bookings' && (
          <div className="tab-content">
            {isGuest ? (
              <div className="guest-restricted-content">
                <div className="restricted-icon">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </div>
                <h2>Sign In to View Bookings</h2>
                <p>Create an account or log in to manage your rental history and active bookings.</p>
                <button className="upgrade-btn" onClick={handleUpgradePrompt}>
                  Create Account
                </button>
              </div>
            ) : (
              <RecentBookings isGuest={false} fullView={true} />
            )}
          </div>
        )}
        
        {activeTab === 'Notifications' && (
          <div className="tab-content">
            {isGuest ? (
              <div className="guest-restricted-content">
                <div className="restricted-icon">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                </div>
                <h2>Sign In for Notifications</h2>
                <p>Stay updated on your bookings, exclusive offers, and important reminders.</p>
                <button className="upgrade-btn" onClick={handleUpgradePrompt}>
                  Create Account
                </button>
              </div>
            ) : (
              <div className="notifications-content">
                <h2>Notifications</h2>
                <div className="notification-item">
                  <div className="notification-icon">🎉</div>
                  <div className="notification-text">
                    <h4>Welcome to EventWear!</h4>
                    <p>Your account has been successfully created.</p>
                    <span className="notification-time">Just now</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'Profile' && (
          <div className="tab-content">
            {isGuest ? (
              <div className="guest-restricted-content">
                <div className="restricted-icon">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <h2>Sign In to Manage Profile</h2>
                <p>Create an account to save your preferences, addresses, and payment methods.</p>
                <button className="upgrade-btn" onClick={handleUpgradePrompt}>
                  Create Account
                </button>
              </div>
            ) : (
              <div className="profile-content">
                <h2>Profile Settings</h2>
                <div className="profile-section">
                  <h3>Personal Information</h3>
                  <div className="profile-field">
                    <label>Name</label>
                    <p>{currentUser.firstName} {currentUser.lastName}</p>
                  </div>
                  <div className="profile-field">
                    <label>Email</label>
                    <p>{currentUser.email}</p>
                  </div>
                  <div className="profile-field">
                    <label>Role</label>
                    <p>{currentUser.role}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;