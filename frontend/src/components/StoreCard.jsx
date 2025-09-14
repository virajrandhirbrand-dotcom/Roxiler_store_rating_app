import React, { useState } from 'react';
import RatingStars from './RatingStars';
import { ratingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const StoreCard = ({ store, userRating, onRatingUpdate }) => {
  const { currentUser } = useAuth();
  const [rating, setRating] = useState(userRating || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRateStore = async (newRating) => {
    if (!currentUser) {
      alert('Please login to rate stores');
      return;
    }

    setIsSubmitting(true);
    try {
      await ratingsAPI.create({
        store_id: store.id,
        rating: newRating
      });
      setRating(newRating);
      if (onRatingUpdate) {
        onRatingUpdate(store.id, newRating);
      }
    } catch (error) {
      console.error('Failed to rate store:', error);
      alert('Failed to rate store. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card store-card h-100 shadow">
      <div className="card-body">
        <h5 className="card-title">{store.name}</h5>
        <p className="card-text text-muted">
          <i className="fas fa-map-marker-alt me-2"></i>{store.address}
        </p>
        <div className="mb-3">
          <span className="fw-bold">Overall Rating: </span>
          <RatingStars rating={store.average_rating || 0} />
          <span className="ms-2">({store.average_rating ? parseFloat(store.average_rating).toFixed(1) : 'No ratings'})</span>
        </div>
        
        {currentUser && currentUser.role === 'user' && (
          <>
            <div className="mb-3">
              <span className="fw-bold">Your Rating: </span>
              {rating ? (
                <span><RatingStars rating={rating} /> ({rating})</span>
              ) : (
                <span className="text-muted">Not rated yet</span>
              )}
            </div>
            <div>
              <label className="form-label">Rate this store:</label>
              <div className="btn-group w-100" role="group">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`btn ${rating === star ? 'btn-warning' : 'btn-outline-warning'}`}
                    onClick={() => handleRateStore(star)}
                    disabled={isSubmitting}
                  >
                    {star}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StoreCard;