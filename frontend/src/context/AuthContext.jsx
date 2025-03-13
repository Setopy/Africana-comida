import React, { createContext, useState, useContext } from 'react';

// Create contexts
export const AuthContext = createContext();

// Custom hooks to use the contexts
export const useAuth = () => useContext(AuthContext);

// Simple AuthProvider with minimal functionality
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  // Simplified login function
  const login = (email, password) => {
    // Simulate successful login
    setUser({ name: 'Test User', email, role: 'customer' });
    return { success: true };
  };
  
  // Simplified logout function
  const logout = () => {
    setUser(null);
  };
  
  // Value to be provided to consuming components
  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    loading: false
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};