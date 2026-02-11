import React from 'react';
import DashboardHeader from '../components/DashboardContent/DashboardHeader';
import DashboardNav from '../components/DashboardContent/DashboardNav'; // Import the new nav

const Dashboard = ({ onLogout }) => {
  // Get user info from localStorage
  const userEmail = localStorage.getItem("userEmail") || "User";
  
  // Try to get firstName from localStorage first
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
    <div className="dashboard" style={{ background: '#fdfdfb', minHeight: '100vh' }}>
      {/* 1. The Top Header */}
      <DashboardHeader 
        userName={firstName} 
        onLogout={handleLogout} 
      />

      {/* 2. The New Navigation Bar */}
      <DashboardNav />

      {/* 3. Dashboard Content Area (Where your school/event info will go) */}
      <main className="dashboard-body" style={{ padding: '0 4rem' }}>
        {/* Content goes here */}
      </main>
    </div>
  );
};

export default Dashboard;