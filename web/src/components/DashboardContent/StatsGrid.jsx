import React from 'react';
import '../css/StatsGrid.css';

const StatsGrid = () => {
  const stats = [
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

  return (
    <section className="stats-container">
      <div className="stats-header">
        <h2 className="stats-title">Dashboard</h2>
        <span className="stats-period">Last 30d</span>
      </div>
      
      <div className="stats-content">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
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
                {stat.progress && (
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