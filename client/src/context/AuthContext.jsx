import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('parthub_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('parthub_token') || null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // Sync state with localStorage & fetch fresh profile on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('parthub_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data?.success && res.data?.data) {
            setUser(res.data.data);
            localStorage.setItem('parthub_user', JSON.stringify(res.data.data));
          }
        } catch (error) {
          console.warn('Stored token is invalid or expired:', error?.message);
          // Only clear if server explicitly returned 401
          if (error.response?.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Login user with username/email and password
   */
  const login = async (emailOrUsername, password) => {
    setLoading(true);
    try {
      const payload = {
        username: emailOrUsername,
        password,
      };

      const res = await api.post('/auth/login', payload);

      if (res.data?.success && res.data?.data) {
        const { token: receivedToken, ...userData } = res.data.data;
        setUser(userData);
        setToken(receivedToken);

        localStorage.setItem('parthub_user', JSON.stringify(userData));
        localStorage.setItem('parthub_token', receivedToken);

        return { success: true, data: userData };
      }
      throw new Error(res.data?.message || 'Login failed');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register new user with formData { name, username, email, password }
   */
  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', formData);

      if (res.data?.success && res.data?.data) {
        const { token: receivedToken, ...userData } = res.data.data;
        setUser(userData);
        setToken(receivedToken);

        localStorage.setItem('parthub_user', JSON.stringify(userData));
        localStorage.setItem('parthub_token', receivedToken);

        return { success: true, data: userData };
      }
      throw new Error(res.data?.message || 'Registration failed');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user and wipe credentials from localStorage
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('parthub_user');
    localStorage.removeItem('parthub_token');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
