import React, { useState, useEffect } from 'react';
import { storesAPI, ratingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StoreCard from '../components/StoreCard';

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    loadStores();
    if (currentUser) {
      loadUserRatings();
    }
  }, [currentUser]);

  const loadStores = async () => {
    try {
      setLoading(true);
      const response = await storesAPI.getAll();
      setStores(response.data);
    } catch (error) {
      setError('Failed to load stores');
      console.error('Error loading stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserRatings = async () => {
    try {
      const response = await ratingsAPI.getByUser(currentUser.id);
      const ratingsMap = {};
      response.data.forEach(rating => {
        ratingsMap[rating.store_id] = rating.rating;
      });
      setUserRatings(ratingsMap);
    } catch (error) {
      console.error('Error loading user ratings:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadStores();
      return;
    }

    try {
      setLoading(true);
      const response = await storesAPI.search(searchTerm);
      setStores(response.data);
    } catch (error) {
      setError('Failed to search stores');
      console.error('Error searching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingUpdate = (storeId, newRating) => {
    const updatedRatings = { ...userRatings, [storeId]: newRating };
    setUserRatings(updatedRatings);
  };

  const filteredStores = stores.filter(store => {
    const searchLower = searchTerm.toLowerCase();
    return (
      store.name.toLowerCase().includes(searchLower) ||
      store.address.toLowerCase().includes(searchLower)
    );
  });

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
        <h2>Store Directory</h2>
        {currentUser?.role === 'admin' && (
          <button 
            className="btn btn-primary"
            data-bs-toggle="modal" 
            data-bs-target="#addStoreModal"
          >
            <i className="fas fa-plus me-2"></i>Add Store
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError('')}
          ></button>
        </div>
      )}

      <div className="row mb-4">
        <div className="col-md-8">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search stores by name or address"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              className="btn btn-outline-primary" 
              type="button"
              onClick={handleSearch}
            >
              <i className="fas fa-search"></i>
            </button>
            {searchTerm && (
              <button 
                className="btn btn-outline-secondary" 
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  loadStores();
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="row">
        {filteredStores.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info">
              {searchTerm ? 'No stores found matching your search.' : 'No stores available.'}
            </div>
          </div>
        ) : (
          filteredStores.map(store => (
            <div key={store.id} className="col-md-6 col-lg-4 mb-4">
              <StoreCard 
                store={store} 
                userRating={userRatings[store.id]}
                onRatingUpdate={handleRatingUpdate}
              />
            </div>
          ))
        )}
      </div>

      {/* Add Store Modal (for admin) */}
      {currentUser?.role === 'admin' && (
        <div className="modal fade" id="addStoreModal" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Store</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <AddStoreForm onStoreAdded={loadStores} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Add Store Form Component
const AddStoreForm = ({ onStoreAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    owner_id: ''
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStoreOwners();
  }, []);

  const loadStoreOwners = async () => {
    try {
      // In a real app, you'd have an API endpoint to get store owners
      // For now, we'll use a mock list or you can implement the actual API call
      const storeOwners = [
        { id: 4, name: 'Mike Johnson' },
        { id: 5, name: 'Sarah Wilson' }
      ];
      setUsers(storeOwners);
    } catch (error) {
      console.error('Error loading store owners:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await storesAPI.create(formData);
      onStoreAdded();
      // Close modal
      document.getElementById('addStoreModal').querySelector('.btn-close').click();
      // Reset form
      setFormData({ name: '', email: '', address: '', owner_id: '' });
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create store');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="modal-body">
        {error && <div className="alert alert-danger">{error}</div>}
        
        <div className="mb-3">
          <label className="form-label">Store Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Address</label>
          <textarea
            className="form-control"
            name="address"
            rows="3"
            value={formData.address}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        
        <div className="mb-3">
          <label className="form-label">Owner</label>
          <select
            className="form-control"
            name="owner_id"
            value={formData.owner_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Owner</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating...' : 'Create Store'}
        </button>
      </div>
    </form>
  );
};

export default Stores;