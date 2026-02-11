import React, { useState } from 'react';
import '../css/PopularPicks.css';

const AvailableOutfits = () => {
  const [showAll, setShowAll] = useState(false);
  
  const allOutfits = [
    {
      id: 1,
      name: "Elegance Bridal Gown",
      category: "Wedding",
      desc: "Stunning white lace wedding gown with intricate embroidery and flowing train.",
      price: "5,500",
      sizes: ["XS", "S", "M", "L", "+1"],
      image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=400"
    },
    {
      id: 2,
      name: "Heritage Barong Tagalog",
      category: "Barong",
      desc: "Traditional Filipino formal barong with exquisite hand-embroidered details.",
      price: "2,800",
      sizes: ["S", "M", "L", "XL", "+1"],
      image: "https://images.unsplash.com/photo-1621335829175-95f437384d7c?q=80&w=400"
    },
    {
      id: 3,
      name: "Midnight Sapphire Gown",
      category: "Gown",
      desc: "Sophisticated navy blue evening gown with elegant draping for any gala.",
      price: "3,200",
      sizes: ["XS", "S", "M", "L"],
      image: "https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?q=80&w=400"
    },
    {
      id: 4,
      name: "Burgundy Romance Dress",
      category: "Cocktail",
      desc: "Deep burgundy cocktail dress with flattering silhouette. Perfect for parties.",
      price: "2,500",
      sizes: ["XS", "S", "M", "L", "+1"],
      image: "https://images.unsplash.com/photo-1550630993-c83d62c113e0?q=80&w=400"
    },
    {
      id: 5,
      name: "Ivory Silk Gown",
      category: "Wedding",
      desc: "Elegant ivory silk gown with minimalist design and subtle sheen.",
      price: "4,800",
      sizes: ["XS", "S", "M", "L"],
      image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=400"
    },
    {
      id: 6,
      name: "Modern Barong",
      category: "Barong",
      desc: "Contemporary take on the classic barong with modern cut and design.",
      price: "3,200",
      sizes: ["S", "M", "L", "XL"],
      image: "https://images.unsplash.com/photo-1593030761757-71fae45fa3e5?q=80&w=400"
    },
    {
      id: 7,
      name: "Emerald Evening Gown",
      category: "Gown",
      desc: "Stunning emerald green gown with elegant draping and subtle sparkle.",
      price: "3,900",
      sizes: ["XS", "S", "M", "L"],
      image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=400"
    },
    {
      id: 8,
      name: "Blush Pink Dress",
      category: "Cocktail",
      desc: "Romantic blush pink cocktail dress with delicate floral details.",
      price: "2,300",
      sizes: ["XS", "S", "M", "L", "+1"],
      image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=400"
    },
    {
      id: 9,
      name: "Classic Tuxedo",
      category: "Formal",
      desc: "Timeless black tuxedo perfect for black-tie events and galas.",
      price: "3,500",
      sizes: ["S", "M", "L", "XL", "XXL"],
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=400"
    },
    {
      id: 10,
      name: "Floral Maxi Dress",
      category: "Casual",
      desc: "Boho-inspired floral maxi dress perfect for summer weddings.",
      price: "1,800",
      sizes: ["XS", "S", "M", "L"],
      image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=400"
    }
  ];

  // Show first 8 items (2 rows of 4) initially
  const visibleOutfits = showAll ? allOutfits : allOutfits.slice(0, 8);
  const hasMore = allOutfits.length > 8;

  return (
    <section className="available-outfits-container">
      <div className="available-outfits-content">
        <div className="section-header">
          <div className="header-left">
            <h2>
              <span className="header-icon">Popular Picks</span> 
            </h2>
            <p className="section-subtitle">Handpicked pieces for your next occasion</p>
          </div>
          <a href="#all" className="view-all">
            <span>View Collection</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
        
        <div className="outfits-grid">
          {visibleOutfits.map(outfit => (
            <article key={outfit.id} className="outfit-card">
              <div className="image-container">
                <span className="category-tag">{outfit.category}</span>
                <img 
                  src={outfit.image} 
                  alt={outfit.name} 
                  className="outfit-image"
                  loading="lazy"
                />
                <button className="quick-view-btn">Quick View</button>
              </div>
              
              <div className="outfit-info">
                <div className="outfit-header">
                  <h4>{outfit.name}</h4>
                  <div className="rating">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>☆</span>
                    <span className="rating-count">(24)</span>
                  </div>
                </div>
                
                <p className="outfit-description">{outfit.desc}</p>
                
                <div className="outfit-details">
                  <div className="sizes">
                    <span className="size-label">Sizes:</span>
                    {outfit.sizes.map(s => (
                      <span key={s} className={`size-chip ${s === '+1' ? 'more' : ''}`}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="outfit-footer">
                  <div className="price-wrapper">
                    <span className="price-currency">₱</span>
                    <span className="price">{outfit.price}</span>
                    <span className="per-day">/day</span>
                  </div>
                  <button className="btn-book">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" x2="16" y1="2" y2="6"/>
                      <line x1="8" x2="8" y1="2" y2="6"/>
                      <line x1="3" x2="21" y1="10" y2="10"/>
                    </svg>
                    Book Now
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Show More Button - Only appears when there are more than 8 items */}
        {hasMore && !showAll && (
          <div className="show-more-container">
            <button 
              className="show-more-btn"
              onClick={() => setShowAll(true)}
            >
              <span>Show More</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 13l5 5 5-5M7 7l5 5 5-5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <p className="show-more-count">
              +{allOutfits.length - 8} more outfits available
            </p>
          </div>
        )}

        {/* Show Less Button - Only appears when showing all items */}
        {showAll && (
          <div className="show-more-container">
            <button 
              className="show-more-btn show-less"
              onClick={() => setShowAll(false)}
            >
              <span>Show Less</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 11l5-5 5 5M7 17l5-5 5 5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <p className="show-more-count">
              Showing all {allOutfits.length} outfits
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AvailableOutfits;