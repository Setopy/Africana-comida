import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../config/constants';
import { useNavigate } from 'react-router-dom';

// Create context
export const AuthContext = createContext();

// Custom hook to use the context
export const useAuth = () => useContext(AuthContext);

// Auth provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTokenRefreshing, setIsTokenRefreshing] = useState(false);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();
  
  // Setup axios interceptor for token refreshing
  useEffect(() => {
    const setupInterceptors = () => {
      // Add request interceptor to include token
      axios.interceptors.request.use(
        (config) => {
          const token = localStorage.getItem('token');
          if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
          }
          return config;
        },
        (error) => Promise.reject(error)
      );
      
      // Add response interceptor to handle token expiration
      axios.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config;
          
          if (error.response?.status === 401 && 
              error.response?.data?.expired && 
              !originalRequest._retry) {
            
            if (isTokenRefreshing) {
              // Wait for the other refresh to complete
              await new Promise(resolve => setTimeout(resolve, 1000));
              return axios(originalRequest);
            }
            
            originalRequest._retry = true;
            setIsTokenRefreshing(true);
            
            try {
              // Get refresh token from localStorage in dev or cookies in prod
              const refreshToken = localStorage.getItem('refreshToken');
              
              // If no refresh token, logout and reject
              if (!refreshToken) {
                logout();
                return Promise.reject(error);
              }
              
              // Try to refresh the token
              const res = await axios.post(`${API_URL}/api/users/refresh-token`, {
                refreshToken
              });
              
              // Store new tokens
              const { token, refreshToken: newRefreshToken, user: userData } = res.data;
              
              if (token) {
                localStorage.setItem('token', token);
                if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);
                setUser(userData);
                
                // Update Authorization header for the original request
                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                return axios(originalRequest);
              }
            } catch (refreshError) {
              // If refresh fails, logout
              logout();
              return Promise.reject(refreshError);
            } finally {
              setIsTokenRefreshing(false);
            }
          }
          
          return Promise.reject(error);
        }
      );
    };
    
    setupInterceptors();
  }, [isTokenRefreshing]);
  
  // Check if user is already logged in on initial load
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      setAuthError(null);
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Set default headers for all requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Fetch user profile to validate token
          const res = await axios.get(`${API_URL}/api/users/profile`);
          setUser(res.data.data);
        } catch (error) {
          // If token is invalid, try to refresh it
          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const res = await axios.post(`${API_URL}/api/users/refresh-token`, {
                refreshToken
              });
              
              const { token: newToken, refreshToken: newRefreshToken, user: userData } = res.data;
              
              if (newToken) {
                localStorage.setItem('token', newToken);
                if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);
                axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                setUser(userData);
              } else {
                logout();
              }
            } else {
              logout();
            }
          } catch (refreshError) {
            logout();
          }
        }
      }
      
      setLoading(false);
    };
    
    initAuth();
  }, []);
  
  // Login function
  const login = async (email, password) => {
    try {
      setAuthError(null);
      const res = await axios.post('/.netlify/functions/users-simple/login', {
        email,
        password
      });
      
      const { accessToken, refreshToken, user: userData } = res.data;
      
      if (accessToken) {
        localStorage.setItem('token', accessToken);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        setUser(userData);
        return { success: true };
      }
      
      return { success: false, message: 'Authentication failed' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Authentication failed';
      setAuthError(errorMessage);
      return { 
        success: false, 
        message: errorMessage
      };
    }
  };
  
  // Register function
  const register = async (userData) => {
    try {
      setAuthError(null);
      const res = await axios.post('/.netlify/functions/users-simple/register', userData);
      
      const { accessToken, refreshToken, user: newUser } = res.data;
      
      if (accessToken) {
        localStorage.setItem('token', accessToken);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        setUser(newUser);
        return { success: true };
      }
      
      return { success: false, message: 'Registration failed' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setAuthError(errorMessage);
      return { 
        success: false, 
        message: errorMessage
      };
    }
  };
  
  // Logout function
  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        await axios.post(`${API_URL}/api/users/logout`, { refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Clear auth data regardless of API call success
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setAuthError(null);
    navigate('/login');
  }, [navigate]);
  
  // Update profile function
  const updateProfile = async (data) => {
    try {
      const res = await axios.put(`${API_URL}/api/users/profile`, data);
      setUser(res.data.data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Profile update failed' 
      };
    }
  };
  
  // Change password function
  const changePassword = async (currentPassword, newPassword) => {
    try {
      await axios.put(`${API_URL}/api/users/change-password`, {
        currentPassword,
        newPassword
      });
      
      // Force logout after password change
      logout();
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Password change failed' 
      };
    }
  };
  
  // Clear auth error
  const clearAuthError = () => {
    setAuthError(null);
  };
  
  // Provide auth context
  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStaff: user?.role === 'staff' || user?.role === 'admin',
    loading,
    authError,
    clearAuthError
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};