import React from 'react';
import DashboardHeader from '../components/DashboardContent/DashboardHeader';

const Dashboard = ({ onLogout }) => {
  // Get user info from localStorage
  const userEmail = localStorage.getItem("userEmail") || "User";
  
  // Try to get firstName from localStorage first (set by backend during login)
  // If not available, fall back to extracting from email
  const firstName = localStorage.getItem("firstName") || 
                    localStorage.getItem("userFirstName") || 
                    userEmail.split('@')[0] || 
                    "User";
  
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="dashboard">
      <DashboardHeader 
        userName={firstName}  // Pass only the first name
        onLogout={handleLogout} 
      />
      <div className="dashboard-content">
        <h2>Welcome to Your Dashboard</h2>
        <p>You are logged in as: {userEmail}</p>
        <p>Your role: {localStorage.getItem("userRole") || "USER"}</p>
        <p>Manage your bookings and explore outfits from here!</p>
      </div>
    </div>
  );
};

export default Dashboard;