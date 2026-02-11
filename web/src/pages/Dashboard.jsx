// Dashboard.js
import React, { useState } from 'react';
import DashboardHeader from '../components/DashboardContent/DashboardHeader';
import DashboardNav from '../components/DashboardContent/DashboardNav'; 
import StatsGrid from '../components/DashboardContent/StatsGrid';
import RecentBookings from '../components/DashboardContent/RecentBookings';

const Dashboard = ({ onLogout }) => {
  // Get user info from localStorage
  const userEmail = localStorage.getItem("userEmail") || "User";
  
  // Try to get firstName from localStorage first
  const firstName = localStorage.getItem("firstName") || 
                    localStorage.getItem("userFirstName") || 
                    userEmail.split('@')[0] || 
                    "User";
  
  // Track active tab
  const [activeTab, setActiveTab] = useState('Overview');
  
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  // Handle tab changes from DashboardNav
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  // Render content based on active tab
  const renderContent = () => {
    switch(activeTab) {
      case 'Overview':
        return (
          <>
            <StatsGrid />
            <RecentBookings />
          </>
        );
      
      case 'My Bookings':
        return (
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 4rem' }}>
            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '12px',
              border: '1px solid #ededed',
              marginTop: '1.5rem'
            }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#2c2c2c', marginBottom: '1rem' }}>My Bookings</h3>
              <p style={{ fontFamily: 'Inter, sans-serif', color: '#6a6a6a' }}>You have no upcoming bookings.</p>
            </div>
          </div>
        );
      
      case 'Notifications':
        return (
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 4rem' }}>
            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '12px',
              border: '1px solid #ededed',
              marginTop: '1.5rem'
            }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#2c2c2c', marginBottom: '1rem' }}>Notifications</h3>
              <p style={{ fontFamily: 'Inter, sans-serif', color: '#6a6a6a' }}>No new notifications.</p>
            </div>
          </div>
        );
      
      case 'Profile':
        return (
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 4rem' }}>
            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '12px',
              border: '1px solid #ededed',
              marginTop: '1.5rem'
            }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#2c2c2c', marginBottom: '1rem' }}>Profile</h3>
              <p style={{ fontFamily: 'Inter, sans-serif', color: '#6a6a6a' }}>Welcome, {firstName}!</p>
              <p style={{ fontFamily: 'Inter, sans-serif', color: '#6a6a6a', fontSize: '0.875rem' }}>{userEmail}</p>
            </div>
          </div>
        );
      
      default:
        return (
          <>
            <StatsGrid />
            <RecentBookings />
          </>
        );
    }
  };

  return (
    <div className="dashboard" style={{ background: '#f8f7f4', minHeight: '100vh' }}>
      {/* 1. The Top Header */}
      <DashboardHeader 
        userName={firstName} 
        onLogout={handleLogout} 
      />

      {/* 2. The Navigation Bar */}
      <DashboardNav 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />

      {/* 3. Dashboard Content Area */}
      <main className="dashboard-body">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;