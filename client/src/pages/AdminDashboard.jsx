import React from 'react';
import { useVendors } from '../context/VendorContext';
import { useAuth } from '../context/AuthContext'; // Hooking into our new Auth subsystem
import VendorOnboardingForm from '../components/admin/VendorOnboardingForm';
import ApprovalQueue from '../components/admin/ApprovalQueue';
import ContractMonitor from '../components/admin/ContractMonitor';
import { ShieldCheck, Lock, Archive } from 'lucide-react';

const AdminDashboard = () => {
  const { vendors } = useVendors(); // Pulling the dynamic vendors array
  const { user } = useAuth(); // Extracting the authenticated user object

  // Secure dynamic evaluation against our Phase 3.5 state engine
  if (user?.role !== 'Admin') {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white border border-slate-200 rounded-xl max-w-2xl mx-auto shadow-sm p-8 text-center space-y-4">
        <div className="p-4 bg-red-50 text-red-600 rounded-full">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Access Privileges Denied</h2>
        <p className="text-sm text-slate-500 max-w-md">
          This workspace dashboard requires **Administrative Role Authorization**. Please log out and authenticate using the **HR / Admin** credentials to unlock this view.
        </p>
      </div>
    );
  }

  // Filter archived entries out once to keep the render body clean
  const archivedVendors = vendors 
  ? vendors.filter(v => v.status?.trim().toLowerCase() === 'archived') 
  : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-7 h-7 text-emerald-600" />
          <span>Admin Command Center</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Governance control panel for onboarding validation, risk escalation, and structural supplier contract tracking.
        </p>
      </div>

      {/* Main Structural Dashboard Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Form Subsystem */}
        <div className="lg:col-span-1">
          <VendorOnboardingForm />
        </div>

        {/* Right Columns: Workflow Queues, Monitors & Archived Vault */}
        <div className="lg:col-span-2 space-y-8">
          <ApprovalQueue />
          <ContractMonitor />
          
          {/* New Management Module: Archived Records Vault */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider border-b pb-2 text-red-700 flex items-center gap-2">
              <Archive className="w-4 h-4 text-red-600" />
              <span>Archived Vendor Archives (HR Confidential) ({archivedVendors.length})</span>
            </h3>
            
            {archivedVendors.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">
                No vendors are currently designated as Archived in the database registry.
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {archivedVendors.map((v) => (
                  <div key={v._id || v.id} className="p-3 bg-slate-50 rounded-lg flex justify-between items-center border border-slate-200/60">
                    <div>
                      <span className="text-xs font-bold text-slate-700 block">{v.name}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{v.category} &bull; {v.city}</span>
                    </div>
                    <span className="text-[9px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-slate-300/40">
                      Archived
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;