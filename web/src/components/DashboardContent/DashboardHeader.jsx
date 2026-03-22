import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/DashboardHeader.css'; 

const DashboardHeader = ({ userName = "Guest", isGuest = false, onLogout, onUpgrade }) => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    console.log("🔵 Sign In button clicked!");
    
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
    
    // Navigate to auth page (will default to Sign In tab)
    navigate('/auth');
  };

  return (
    <header className="dashboard-header">
      <div className="dashboard-header-content">
        <div className="welcome-section">
          <h1>
            {isGuest ? `Welcome, ${userName}!` : `Welcome back, ${userName}!`}
          </h1>
          <p className="subtitle">
            {isGuest 
              ? 'Browse our collection and discover your perfect outfit.' 
              : 'Manage your bookings and explore new outfits.'
            }
          </p>
        </div>
        
        <div className="header-actions">
          <button 
            className="btn-browse-outfits" 
            onClick={() => {
              const outfitsSection = document.querySelector('.available-outfits-container');
              if (outfitsSection) {
                outfitsSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            Browse Outfits
          </button>
          
          {isGuest ? (
            <button className="btn-signin" onClick={handleSignIn}>
              Sign In
            </button>
          ) : (
            <button className="btn-logout" onClick={onLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;