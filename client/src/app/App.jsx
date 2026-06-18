import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { VendorProvider } from '../context/VendorContext';
import Layout from '../components/layout/Layout';
import DiscoveryHub from '../pages/DiscoveryHub';
import VendorProfile from '../pages/VendorProfile';
import AdminDashboard from '../pages/AdminDashboard';
import Login from '../pages/Login';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import SavedVendors from '../pages/SavedVendors'; // 1. Added your real page import here

function App() {
  return (
    <AuthProvider>
      <VendorProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Entry Route */}
            <Route path="/login" element={<Login />} />

            {/* Shielded Infrastructure Shell Routing Layouts */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DiscoveryHub />} />
              <Route path="vendor/:id" element={<VendorProfile />} />
              
              {/* Specialized Administrative Access Area */}
              <Route 
                path="admin" 
                element={
                  <ProtectedRoute allowedRole="Admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* 2. Swapped out the placeholder for your real SavedVendors component here */}
              <Route path="saved" element={<SavedVendors />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </VendorProvider>
    </AuthProvider>
  );
}

export default App;