import React from 'react';

const RatingStars = ({ rating, size = '1.2rem' }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  const stars = [];
  
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<i key={i} className="fas fa-star" style={{ color: '#f6c23e', fontSize: size }}></i>);
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(<i key={i} className="fas fa-star-half-alt" style={{ color: '#f6c23e', fontSize: size }}></i>);
    } else {
      stars.push(<i key={i} className="far fa-star" style={{ color: '#f6c23e', fontSize: size }}></i>);
    }
  }
  
  return <span className="rating-stars">{stars}</span>;
};

export default RatingStars;