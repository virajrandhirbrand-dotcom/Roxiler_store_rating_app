import axios from "axios";

// Use Vite environment variable, fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
};

export const usersAPI = {
  getAll: () => api.get("/users"),
  create: (userData) => api.post("/users", userData),
  updatePassword: (userId, passwordData) =>
    api.put(`/users/${userId}/password`, passwordData),
};

export const storesAPI = {
  getAll: () => api.get("/stores"),
  getByOwner: (ownerId) => api.get(`/stores/owner/${ownerId}`),
  create: (storeData) => api.post("/stores", storeData),
  search: (query) => api.get(`/stores/search?q=${encodeURIComponent(query)}`),
};

export const ratingsAPI = {
  getByStore: (storeId) => api.get(`/ratings/store/${storeId}`),
  getByUser: (userId) => api.get(`/ratings/user/${userId}`),
  create: (ratingData) => api.post("/ratings", ratingData),
  update: (ratingId, ratingData) =>
    api.put(`/ratings/${ratingId}`, ratingData),
  getCount: () => api.get("/ratings/count"),
};

export default api;
