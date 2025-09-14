import React, { useState, useEffect } from 'react';
import { usersAPI, storesAPI, ratingsAPI } from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    users: 0,
    stores: 0,
    ratings: 0
  });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [storeOwners, setStoreOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ name: '', email: '', role: '' });
  const [sortConfig, setSortConfig] = useState({ field: '', direction: 'asc' });

  useEffect(() => {
    loadStats();
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'stores') loadStores();
    loadStoreOwners();
  }, [activeTab]);

  const loadStats = async () => {
    try {
      const [usersRes, storesRes, ratingsRes] = await Promise.all([
        usersAPI.getAll(),
        storesAPI.getAll(),
        ratingsAPI.getCount()
      ]);

      setStats({
        users: usersRes.data.length,
        stores: storesRes.data.length,
        ratings: ratingsRes.data.count
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await usersAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadStores = async () => {
    try {
      const response = await storesAPI.getAll();
      setStores(response.data);
    } catch (error) {
      console.error('Error loading stores:', error);
    }
  };

  const loadStoreOwners = async () => {
    try {
      const response = await usersAPI.getAll();
      const owners = response.data.filter(user => user.role === 'store_owner');
      setStoreOwners(owners);
    } catch (error) {
      console.error('Error loading store owners:', error);
    }
  };

  const handleSort = (field) => {
    let direction = 'asc';
    if (sortConfig.field === field && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ field, direction });
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortConfig.field) return 0;
    
    let aValue = a[sortConfig.field];
    let bValue = b[sortConfig.field];
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredUsers = sortedUsers.filter(user => {
    return (
      (!filter.name || user.name.toLowerCase().includes(filter.name.toLowerCase())) &&
      (!filter.email || user.email.toLowerCase().includes(filter.email.toLowerCase())) &&
      (!filter.role || user.role === filter.role)
    );
  });

  const filteredStores = stores.filter(store => {
    return (
      (!filter.name || store.name.toLowerCase().includes(filter.name.toLowerCase())) &&
      (!filter.email || store.email.toLowerCase().includes(filter.email.toLowerCase()))
    );
  });

  const renderDashboard = () => (
    <div className="row">
      <div className="col-xl-4 col-md-6 mb-4">
        <div className="card dashboard-card border-left-primary h-100 py-2">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col mr-2">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                  Total Users
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.users}</div>
              </div>
              <div className="col-auto">
                <i className="fas fa-users fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-xl-4 col-md-6 mb-4">
        <div className="card dashboard-card border-left-success h-100 py-2">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col mr-2">
                <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                  Total Stores
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.stores}</div>
              </div>
              <div className="col-auto">
                <i className="fas fa-store fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-xl-4 col-md-6 mb-4">
        <div className="card dashboard-card border-left-info h-100 py-2">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col mr-2">
                <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                  Total Ratings
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.ratings}</div>
              </div>
              <div className="col-auto">
                <i className="fas fa-star fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="card shadow mb-4">
      <div className="card-header py-3 d-flex justify-content-between align-items-center">
        <h6 className="m-0 font-weight-bold text-primary">Users</h6>
        <button className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addUserModal">
          <i className="fas fa-plus"></i> Add User
        </button>
      </div>
      <div className="card-body">
        {/* Filter UI */}
        <div className="row mb-3">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Filter by name"
              value={filter.name}
              onChange={(e) => setFilter({...filter, name: e.target.value})}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Filter by email"
              value={filter.email}
              onChange={(e) => setFilter({...filter, email: e.target.value})}
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-control"
              value={filter.role}
              onChange={(e) => setFilter({...filter, role: e.target.value})}
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="store_owner">Store Owner</option>
            </select>
          </div>
        </div>
        {/* Table */}
        <div className="table-responsive">
          <table className="table table-bordered" width="100%" cellSpacing="0">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')}>Name</th>
                <th onClick={() => handleSort('email')}>Email</th>
                <th>Address</th>
                <th onClick={() => handleSort('role')}>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.address}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderStores = () => (
    <div className="card shadow mb-4">
      <div className="card-header py-3 d-flex justify-content-between align-items-center">
        <h6 className="m-0 font-weight-bold text-primary">Stores</h6>
        <button className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addStoreModal">
          <i className="fas fa-plus"></i> Add Store
        </button>
      </div>
      <div className="card-body">
        {/* Table */}
        <div className="table-responsive">
          <table className="table table-bordered" width="100%" cellSpacing="0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Owner</th>
                <th>Rating</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredStores.map(store => (
                <tr key={store.id}>
                  <td>{store.name}</td>
                  <td>{store.email}</td>
                  <td>{store.address}</td>
                  <td>{store.owner_name || 'N/A'}</td>
                  <td>{store.average_rating ? `${parseFloat(store.average_rating).toFixed(1)}/5` : 'No ratings'}</td>
                  <td>{new Date(store.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid py-4">
      <h2 className="mb-4">Admin Dashboard</h2>
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            Dashboard
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            Users
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'stores' ? 'active' : ''}`} onClick={() => setActiveTab('stores')}>
            Stores
          </button>
        </li>
      </ul>

      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'users' && renderUsers()}
      {activeTab === 'stores' && renderStores()}

      {/* Add User Modal */}
      <div className="modal fade" id="addUserModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New User</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <AddUserForm onUserAdded={loadUsers} />
          </div>
        </div>
      </div>

      {/* Add Store Modal */}
      <div className="modal fade" id="addStoreModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Store</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <AddStoreForm storeOwners={storeOwners} onStoreAdded={loadStores} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Add User Form Component
const AddUserForm = ({ onUserAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await usersAPI.create(formData);
      onUserAdded();
      // Close modal using Bootstrap's modal API
      const modalElement = document.getElementById('addUserModal');
      const modal = window.bootstrap.Modal.getInstance(modalElement) || new window.bootstrap.Modal(modalElement);
      modal.hide();
      // Reset form
      setFormData({ name: '', email: '', password: '', address: '', role: 'user' });
    } catch (error) {
      console.error('Error creating user:', error);
      setError(error.response?.data?.error || 'Failed to create user');
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
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            minLength="20"
            maxLength="60"
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
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="8"
            maxLength="16"
            pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$"
            title="Password must be 8-16 characters with at least one uppercase letter and one special character"
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
            maxLength="400"
          ></textarea>
        </div>
        
        <div className="mb-3">
          <label className="form-label">Role</label>
          <select
            className="form-control"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="store_owner">Store Owner</option>
          </select>
        </div>
      </div>
      
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating...' : 'Create User'}
        </button>
      </div>
    </form>
  );
};

// Add Store Form Component
const AddStoreForm = ({ storeOwners, onStoreAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    owner_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Ensure owner_id is a number
      const submitData = {
        ...formData,
        owner_id: parseInt(formData.owner_id)
      };
      
      await storesAPI.create(submitData);
      onStoreAdded();
      // Close modal using Bootstrap's modal API
      const modalElement = document.getElementById('addStoreModal');
      const modal = window.bootstrap.Modal.getInstance(modalElement) || new window.bootstrap.Modal(modalElement);
      modal.hide();
      // Reset form
      setFormData({ name: '', email: '', address: '', owner_id: '' });
    } catch (error) {
      console.error('Error creating store:', error);
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
            maxLength="400"
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
            {storeOwners.map(user => (
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

export default AdminDashboard;
