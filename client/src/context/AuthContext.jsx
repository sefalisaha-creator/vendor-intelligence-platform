import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('v_intel_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    setAuthLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${API_BASE}/api/auth/login`, { email, password });
      if (response.data.success) {
        const authUser = response.data.user;
        setUser(authUser);
        localStorage.setItem('v_intel_user', JSON.stringify(authUser));
        localStorage.setItem('v_intel_token', response.data.token);
        return { success: true };
      }
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Authentication error.' };
    }
  };

  // Modern network pipeline sync tool to handle dashboard bookmarks cleanly
  const handleToggleWatchlist = async (vendorId) => {
    if (!user) return;
    try {
      const res = await axios.post('https://vendor-api-zzqd.onrender.com/api/auth/watchlist/toggle', {
        userId: user.id,
        vendorId
      });
      if (res.data.success) {
        const updatedUser = { ...user, watchlist: res.data.watchlist };
        setUser(updatedUser);
        localStorage.setItem('v_intel_user', JSON.stringify(updatedUser)); // Persist update
      }
    } catch (err) {
      console.error("Watchlist operational update failure:", err);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('v_intel_user');
    localStorage.removeItem('v_intel_token');
  };

  return (
    <AuthContext.Provider value={{ user, authLoading, login, logout, toggleWatchlist: handleToggleWatchlist, isAdmin: user?.role === 'Admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth missing wrapper environment references.');
  return context;
};