import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useVendors } from '../context/VendorContext';
import VendorCard from '../components/vendors/VendorCard';
import { Bookmark, FolderOpen } from 'lucide-react';

const SavedVendors = () => {
  const { user } = useAuth();
  const { vendors, loading } = useVendors();

  // Filter cross-platform vendor listings against the authenticated user account watchlist identifiers
  const userSavedList = vendors.filter(vendor => user?.watchlist?.includes(vendor._id));

  if (loading) return <div className="text-sm font-medium text-slate-400 p-4 animate-pulse">Running inventory matches...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg border border-amber-100">
          <Bookmark className="w-5 h-5 fill-amber-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Saved Vendors</h1>
          <p className="text-sm text-slate-500 mt-0.5">Your monitored vendors and localized departmental watchlists.</p>
        </div>
      </div>

      {userSavedList.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-dashed rounded-xl max-w-xl mx-auto text-center space-y-3 mt-8">
          <FolderOpen className="w-8 h-8 text-slate-300" />
          <div>
            <h3 className="font-semibold text-slate-700 text-sm">Watchlist is Empty</h3>
            <p className="text-xs text-slate-400 max-w-xs mt-1">
              Go to the Discovery Hub and click the bookmark button on any supplier card to begin tracking critical metrics here.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {userSavedList.map(vendor => (
            <VendorCard key={vendor._id} vendor={vendor} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedVendors;