import axios from "axios";

const API_URL = "https://freshers-bazaar.onrender.com";

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
};

// Listings
export const listingAPI = {
  getAll: (params) => api.get("/listings", { params }),
  getById: (id) => api.get(`/listings/${id}`),
  create: (data) => api.post("/listings", data),
  update: (id, data) => api.put(`/listings/${id}`, data),
  delete: (id) => api.delete(`/listings/${id}`),
  getUserListings: (userId) => api.get(`/listings/user/${userId}`),
};

// Users
export const userAPI = {
  getProfile: (id) => api.get(`/users/${id}`),
  getCurrentUser: () => api.get("/users/profile/me"),
  updateProfile: (data) => api.put("/users/profile/update", data),
  getReviews: (userId) => api.get(`/users/${userId}/reviews`),
  createReview: (userId, data) => api.post(`/users/${userId}/reviews`, data),
};

// Messages
export const messageAPI = {
  getConversations: () => api.get("/messages/conversations"),
  getMessages: (userId) => api.get(`/messages/${userId}`),
  sendMessage: (userId, data) => api.post(`/messages/send/${userId}`, data),
  getUnreadCount: () => api.get("/messages/unread/count"),
};

export default api;
