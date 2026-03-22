import React from 'react';
import '../css/StatsGrid.css';

const StatsGrid = ({ isGuest = false }) => {
  const guestStats = [
    {
      title: "Available Outfits",
      value: "500+",
      footer: "Browse our collection",
      trend: "Updated daily",
      trendDirection: "neutral",
      icon: (
        <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" strokeWidth="1.5"/>
          <path d="M3 6h18M16 10a4 4 0 0 1-8 0" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      title: "Categories",
      value: "8",
      footer: "Wedding, Formal, Casual & more",
      trend: "Something for everyone",
      trendDirection: "neutral",
      icon: (
        <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="1.5"/>
          <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="1.5"/>
          <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="1.5"/>
          <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="1.5"/>
        </svg>
      )
    },
    {
      title: "Sign Up Bonus",
      value: "100",
      footer: "Get points on first booking",
      progress: 0,
      icon: (
        <svg className="stat-icon icon-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.07 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" strokeWidth="1.5"/>
        </svg>
      )
    }
  ];

  const authenticatedStats = [
    {
      title: "Active Bookings",
      value: "1",
      footer: "Next event in 7 days",
      trend: "+1 from last month",
      trendDirection: "up",
      icon: (
        <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth="1.5"/>
          <path d="M8 2v4M16 2v4M3 10h18" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      title: "Total Rentals",
      value: "5",
      footer: "Since joining",
      trend: "Completed",
      trendDirection: "neutral",
      icon: (
        <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeWidth="1.5"/>
        </svg>
      )
    },
    {
      title: "Loyalty Points",
      value: "250",
      footer: "50 more for 10% off",
      progress: 83,
      icon: (
        <svg className="stat-icon icon-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.07 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" strokeWidth="1.5"/>
        </svg>
      )
    }
  ];

  const stats = isGuest ? guestStats : authenticatedStats;

  return (
    <section className="stats-container">
      <div className="stats-header">
        <h2 className="stats-title">
          {isGuest ? 'Discover EventWear' : 'Dashboard'}
        </h2>
        {!isGuest && <span className="stats-period">Last 30d</span>}
      </div>
      
      <div className="stats-content">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card ${isGuest ? 'guest-card' : ''}`}>
            <div className="stat-header">
              <div className="stat-title-wrapper">
                <span className="stat-label">{stat.title}</span>
                {stat.trend && (
                  <span className={`stat-trend stat-trend-${stat.trendDirection}`}>
                    {stat.trendDirection === "up" && "↑"}
                    {stat.trendDirection === "down" && "↓"}
                    {stat.trendDirection === "neutral" && "•"}
                    {stat.trend}
                  </span>
                )}
              </div>
              <div className="stat-icon-wrapper">
                {stat.icon}
              </div>
            </div>
            
            <div className="stat-body">
              <div className="stat-value-wrapper">
                <span className="stat-value">{stat.value}</span>
              </div>
              <div className="stat-footer-content">
                <span className="stat-footer">{stat.footer}</span>
                {stat.progress !== undefined && (
                  <div className="stat-progress">
                    <div 
                      className="stat-progress-bar" 
                      style={{ width: `${stat.progress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsGrid;