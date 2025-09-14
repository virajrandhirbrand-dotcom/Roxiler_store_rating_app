import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser } = useAuth();

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">Dashboard</h6>
            </div>
            <div className="card-body">
              <h2 className="mb-4">Welcome to Store Rating App</h2>

              {currentUser ? (
                <div>
                  <p>
                    Hello, <strong>{currentUser.name}</strong>! You are logged in as a <strong>{currentUser.role}</strong>.
                  </p>

                  {/* Normal User */}
                  {currentUser.role === 'user' && (
                    <div className="mt-4">
                      <h4>What would you like to do?</h4>
                      <ul>
                        <li>Browse and rate stores</li>
                        <li>Search for specific stores</li>
                        <li>Update your password</li>
                      </ul>
                      <Link to="/stores" className="btn btn-primary mt-3">
                        Browse Stores
                      </Link>
                    </div>
                  )}

                  {/* Admin */}
                  {currentUser.role === 'admin' && (
                    <div className="mt-4">
                      <h4>Admin Privileges</h4>
                      <ul>
                        <li>Manage users and stores</li>
                        <li>View system statistics</li>
                        <li>Add new stores and admin users</li>
                      </ul>
                      <Link to="/admin" className="btn btn-primary mt-3">
                        Go to Admin Dashboard
                      </Link>
                    </div>
                  )}

                  {/* Store Owner */}
                  {currentUser.role === 'store_owner' && (
                    <div className="mt-4">
                      <h4>Store Owner Features</h4>
                      <ul>
                        <li>View ratings for your stores</li>
                        <li>See average ratings</li>
                        <li>Monitor customer feedback</li>
                      </ul>
                      <Link to="/owner" className="btn btn-primary mt-3">
                        View My Stores
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <p>Please log in or register to access all features of the Store Rating App.</p>
                  <div className="mt-4">
                    <Link to="/Login" className="btn btn-primary me-3">
                      Login
                    </Link>
                    <Link to="/register" className="btn btn-outline-primary">
                      Register
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
