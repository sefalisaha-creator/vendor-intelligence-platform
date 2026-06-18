import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, authLoading } = useAuth();
  const location = useLocation();

  // Responsive, full-screen centered loading layout block
  if (authLoading) {
    return (
      <div className="min-h-screen w-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-3 text-center animate-pulse">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100/50">
            <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-bold text-slate-700 tracking-tight">
              Security Protocol Syncing
            </p>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium">
              Running authorized enterprise verification scans...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Intercept unauthenticated visits, forcing relocation to login views
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization layers
  if (allowedRole && user.role !== allowedRole) {
    // If an Employee runs into Admin boundaries, redirect them to the safe discovery view
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;