import axios from 'axios';

/**
 * Pre-configured Axios instance with automatic JWT Authorization header attachment
 */
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Automatically attach Bearer token from localStorage
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('parthub_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error retrieving token from localStorage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle unauthorized/expired tokens globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If server returns 401 on an authenticated route
      console.warn('Unauthorized request - session may be expired.');
    }
    return Promise.reject(error);
  }
);

export default api;
