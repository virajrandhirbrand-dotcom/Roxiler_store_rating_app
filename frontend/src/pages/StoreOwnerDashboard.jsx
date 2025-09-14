import React, { useState, useEffect } from 'react';
import { storesAPI, ratingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import RatingStars from '../components/RatingStars';

const StoreOwnerDashboard = () => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      loadStores();
    }
  }, [currentUser]);

  const loadStores = async () => {
    try {
      setLoading(true);
      const response = await storesAPI.getByOwner(currentUser.id);
      setStores(response.data);
      
      // Select the first store by default
      if (response.data.length > 0) {
        setSelectedStore(response.data[0]);
        loadRatings(response.data[0].id);
      }
    } catch (error) {
      console.error('Error loading stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRatings = async (storeId) => {
    try {
      const response = await ratingsAPI.getByStore(storeId);
      setRatings(response.data);
    } catch (error) {
      console.error('Error loading ratings:', error);
    }
  };

  const handleStoreSelect = (store) => {
    setSelectedStore(store);
    loadRatings(store.id);
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Stores</h2>
      </div>

      {stores.length === 0 ? (
        <div className="alert alert-info">
          You don't own any stores yet.
        </div>
      ) : (
        <>
          {/* Store Selection */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Select a Store</h5>
                </div>
                <div className="card-body">
                  <div className="btn-group" role="group">
                    {stores.map(store => (
                      <button
                        key={store.id}
                        type="button"
                        className={`btn ${selectedStore?.id === store.id ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => handleStoreSelect(store)}
                      >
                        {store.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Store Details */}
          {selectedStore && (
            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="card h-100">
                  <div className="card-header">
                    <h5 className="mb-0">Store Information</h5>
                  </div>
                  <div className="card-body">
                    <h4>{selectedStore.name}</h4>
                    <p className="text-muted">
                      <i className="fas fa-map-marker-alt me-2"></i>
                      {selectedStore.address}
                    </p>
                    <p>
                      <i className="fas fa-envelope me-2"></i>
                      {selectedStore.email}
                    </p>
                    <div className="mt-3">
                      <h5>Average Rating</h5>
                      <div className="d-flex align-items-center">
                        <RatingStars rating={selectedStore.average_rating || 0} />
                        <span className="ms-2 fs-4">
                          {selectedStore.average_rating 
                            ? parseFloat(selectedStore.average_rating).toFixed(1) 
                            : 'No ratings'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-4">
                <div className="card h-100">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Customer Ratings</h5>
                    <span className="badge bg-primary">{ratings.length} ratings</span>
                  </div>
                  <div className="card-body">
                    {ratings.length === 0 ? (
                      <div className="text-center text-muted py-4">
                        <i className="fas fa-star fa-3x mb-3"></i>
                        <p>No ratings yet</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Customer</th>
                              <th>Rating</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ratings.map(rating => (
                              <tr key={rating.id}>
                                <td>
                                  <div>
                                    <div className="fw-bold">{rating.user_name}</div>
                                    <small className="text-muted">{rating.user_email}</small>
                                  </div>
                                </td>
                                <td>
                                  <RatingStars rating={rating.rating} />
                                </td>
                                <td>
                                  {new Date(rating.created_at).toLocaleDateString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StoreOwnerDashboard;