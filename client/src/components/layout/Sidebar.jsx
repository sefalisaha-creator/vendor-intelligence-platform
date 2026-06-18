import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldCheck, Search, Bookmark, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // Swapped from VendorContext

const Sidebar = () => {
  // Connect to the real authentication state instead of the old mock role toggle
  const { user, isAdmin } = useAuth();

  // Unified styling pattern callback for React Router Active link status states
  const navLinkStyle = ({ isActive }) => 
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive 
        ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-full">
      <div className="px-4 py-6">
        {/* Brand System Header Identity */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <Building2 className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="font-bold text-slate-800 leading-tight text-sm uppercase tracking-wider">V-Intelligence</h2>
            <span className="text-xs text-slate-400 font-semibold">Corporate Portal v1.0</span>
          </div>
        </div>

        {/* Main Navigation Element Arrays */}
        <nav className="space-y-1">
          <NavLink to="/" end className={navLinkStyle}>
            <Search className="w-4 h-4" />
            <span>Discovery Hub</span>
          </NavLink>
          
          <NavLink to="/saved" className={navLinkStyle}>
            <Bookmark className="w-4 h-4" />
            <span>My Saved Vendors</span>
          </NavLink>

          {/* Conditional Authorization Layer: Render Admin panels exclusively for privileged roles */}
          {isAdmin && (
            <div className="pt-4 mt-4 border-t border-slate-100">
              <span className="px-4 text-[10px] font-bold text-slate-400 tracking-widest uppercase block mb-2">
                Management
              </span>
              <NavLink to="/admin" className={navLinkStyle}>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-700">Command Center</span>
              </NavLink>
            </div>
          )}
        </nav>
      </div>

      {/* Persistent Enterprise Footprint Indicator */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <p className="text-[11px] text-slate-400 font-medium text-center">35+ Years of Corporate Excellence</p>
      </div>
    </aside>
  );
};

export default Sidebar;