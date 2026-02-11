import React from 'react';
import '../css/RecentBookings.css';

const RecentBookings = () => {
  const bookings = [
    {
      id: 1,
      name: "Elegance Bridal Gown",
      designer: "Vera Wang",
      date: "Feb 18, 2026 - Feb 21, 2026",
      duration: "3 days",
      status: "confirmed",
      price: "₱16,500",
      imageUrl: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=200"
    },
    {
      id: 2,
      name: "Midnight Sapphire Gown",
      designer: "Marchesa",
      date: "Jan 28, 2026 - Jan 31, 2026",
      duration: "3 days",
      status: "returned",
      price: "₱9,600",
      imageUrl: "https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?q=80&w=200"
    }
  ];

  return (
    <section className="recent-bookings-container">
      <div className="recent-bookings-content">
        <div className="section-header">
          <div className="header-left">
            <h2>Recent Bookings</h2>
            <p className="subtitle">Your latest rental activity</p>
          </div>
          <button className="view-all-btn">
            View All
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className="booking-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-image-wrapper">
                <img src={booking.imageUrl} alt={booking.name} className="item-image" />
                <span className={`status-indicator ${booking.status}`} />
              </div>
              
              <div className="booking-info">
                <div className="booking-header">
                  <div className="title-section">
                    <h4>{booking.name}</h4>
                    <span className="designer">by {booking.designer}</span>
                  </div>
                  <span className={`status-badge ${booking.status}`}>
                    {booking.status === 'confirmed' ? 'Active' : 'Completed'}
                  </span>
                </div>
                
                <div className="booking-details">
                  <div className="detail-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" x2="16" y1="2" y2="6"/>
                      <line x1="8" x2="8" y1="2" y2="6"/>
                      <line x1="3" x2="21" y1="10" y2="10"/>
                    </svg>
                    <span>{booking.date}</span>
                  </div>
                  <div className="detail-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>{booking.duration}</span>
                  </div>
                </div>
              </div>
              
              <div className="booking-price-section">
                <span className="price-label">Total</span>
                <span className="booking-price">{booking.price}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="booking-footer">
          <p>Showing 2 of 12 total bookings</p>
        </div>
      </div>
    </section>
  );
};

export default RecentBookings;