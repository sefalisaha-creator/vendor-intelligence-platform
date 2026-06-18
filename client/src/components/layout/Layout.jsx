import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = () => {
  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden font-sans">
      {/* Structural Column 1: Responsive Sidebar Navigation Panel */}
      <Sidebar />

      {/* Structural Column 2: Dashboard Content Panel */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Horizontal Top Header Panel */}
        <Topbar />

        {/* Scrollable View Containment Area with Scaled Mobile Padding */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;