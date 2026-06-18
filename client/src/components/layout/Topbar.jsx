import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useVendors } from '../../context/VendorContext'; // Pulling search state context bindings
import { Search, LogOut, User, Building, X } from 'lucide-react';

const Topbar = () => {
  const { user, logout } = useAuth();
  const { searchQuery, setSearchQuery } = useVendors();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm">
      
      {/* Activated Live Global Search Bar Subsystem Component */}
      <div className="relative w-72 max-w-lg hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search vendors by company title name..." 
          className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-8 py-2 text-slate-700 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-150"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
      <div className="sm:hidden text-sm font-bold text-slate-700">V-Intelligence</div>

      {/* Right Section: Authenticated Session Profile & Controls */}
      <div className="flex items-center gap-4">
        
        {/* User Identity Display Metadata Card */}
        <div className="text-right hidden md:block">
          <p className="text-xs font-bold text-slate-800 leading-none">
            {user?.name || 'Corporate Employee'}
          </p>
          <p className="text-[10px] text-slate-400 font-medium mt-1 flex items-center gap-1 justify-end">
            <Building className="w-2.5 h-2.5" />
            <span>{user?.department || 'Operations'}</span>
          </p>
        </div>

        {/* Dynamic Security Authorization Role Badge */}
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border ${
          user?.role === 'Admin'
            ? 'bg-red-50 text-red-700 border-red-200'
            : 'bg-blue-50 text-blue-700 border-blue-200'
        }`}>
          {user?.role || 'Employee'}
        </span>

        {/* User Avatar Presentation Block */}
        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-600 shadow-sm">
          {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : <User className="w-3.5 h-3.5" />}
        </div>

        {/* Vertical Separator Divider */}
        <div className="h-6 w-px bg-slate-200 mx-1"></div>

        {/* Session Termination Actions Execution Trigger */}
        <button
          onClick={logout}
          className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all duration-150 group focus:outline-none"
          title="Sign out of the Vendor Intelligence Application Session"
        >
          <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
        </button>

      </div>
    </header>
  );
};

export default Topbar;