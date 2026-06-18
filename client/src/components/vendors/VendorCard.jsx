import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Tag, Star, Bookmark } from 'lucide-react';

const VendorCard = ({ vendor }) => {
  const navigate = useNavigate();
  const { user, toggleWatchlist } = useAuth();
  const { _id, name, category, city, status, scorecard } = vendor;

  const isBookmarked = user?.watchlist?.includes(_id);

  const statusConfig = {
    'Active': 'bg-blue-50 text-blue-700 border-blue-200',
    'Strategic Partner': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Under Review': 'bg-amber-50 text-amber-700 border-amber-200',
    'Escalated': 'bg-red-50 text-red-700 border-red-200 animate-pulse'
  };

  const compositeScore = ((scorecard.slaCompliance + scorecard.communication + scorecard.qualityOfService) / 3).toFixed(1);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group h-full relative">
      
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase border ${statusConfig[status] || 'bg-slate-50 text-slate-600'}`}>
            {status}
          </span>
          
          <div className="flex items-center gap-2">
            {/* Context Safe Watchlist Toggle Element */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Avoid triggering card navigation rules
                toggleWatchlist(_id);
              }}
              className={`p-1.5 rounded-lg border transition-all duration-150 ${
                isBookmarked 
                  ? 'bg-amber-50 border-amber-200 text-amber-500' 
                  : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-slate-600'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
            </button>

            <div className="flex items-center gap-1 text-amber-500 bg-amber-50/60 px-2 py-0.5 rounded text-xs font-bold">
              <Star className="w-3 h-3 fill-amber-500" />
              <span>{compositeScore}</span>
            </div>
          </div>
        </div>

        <div onClick={() => navigate(`/vendor/${_id}`)} className="cursor-pointer">
          <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-150 line-clamp-1">{name}</h4>
          <div className="flex items-center gap-4 mt-2.5 text-slate-500 text-xs font-medium">
            <div className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /><span>{category}</span></div>
            <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /><span>{city}</span></div>
          </div>
        </div>
      </div>

      <div onClick={() => navigate(`/vendor/${_id}`)} className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium cursor-pointer">
        <span>Active Contracts: {vendor.activeContracts?.length || 0}</span>
        <span className="text-blue-500 group-hover:translate-x-1 transition-transform duration-200">View Dossier &rarr;</span>
      </div>
    </div>
  );
};

export default VendorCard;