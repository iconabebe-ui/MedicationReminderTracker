import axios from 'axios';

const API_BASE = 'http://localhost:5000/api'; // your backend URL

const api = axios.create({
  baseURL: API_BASE,
});

// Add JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // assuming you store JWT in localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
