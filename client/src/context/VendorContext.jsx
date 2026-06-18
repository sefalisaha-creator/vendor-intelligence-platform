import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const VendorContext = createContext(null);

export const VendorProvider = ({ children }) => {
  const { user } = useAuth(); 
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Real-Time Global Search State Query String
  const [searchQuery, setSearchQuery] = useState('');

  const currentUserRole = user?.role || 'Employee';

  // Core Data Synchronization Pipeline Engine
  const fetchVendors = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await axios.get(`http://localhost:5000/api/vendors?${queryParams}`);
      
      let extractedData = [];
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        extractedData = response.data.data;
      } else if (Array.isArray(response.data)) {
        extractedData = response.data;
      }

      setVendors(extractedData);
      setError(null);
    } catch (err) {
      console.error('Error synchronizing core vendor matrices:', err);
      setError(err.response?.data?.error || 'Failed to sync platform records.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  return (
    <VendorContext.Provider 
      value={{ 
        vendors, 
        loading, 
        error, 
        currentUserRole, 
        searchQuery,
        setSearchQuery,
        refreshVendors: fetchVendors 
      }}
    >
      {children}
    </VendorContext.Provider>
  );
};

export const useVendors = () => {
  const context = useContext(VendorContext);
  if (!context) {
    throw new Error('useVendors must be wrapped within a valid VendorProvider node layout.');
  }
  return context;
};