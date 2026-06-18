import React, { useState } from 'react';
import axios from 'axios';
import { useVendors } from '../../context/VendorContext';
import { ClipboardList, Check, AlertTriangle, Archive, RotateCcw, Award } from 'lucide-react';

const ApprovalQueue = () => {
  const { vendors, refreshVendors } = useVendors();
  const [actioningId, setActioningId] = useState(null);

  // Filter lists down to specific workflow stages
  const pendingQueue = vendors.filter(v => v.status === 'Under Review');
  const escalatedQueue = vendors.filter(v => v.status === 'Escalated');

  const handleStatusChange = async (id, targetStatus) => {
    setActioningId(id);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.patch(`${API_BASE}/api/vendors/${id}/status`, {
        status: targetStatus
      });
      if (res.data.success) {
        refreshVendors(); // Sync global frontend state changes instantly
      }
    } catch (err) {
      console.error("Governance transition processing fault:", err);
      alert(`Server Rejected Status Update to "${targetStatus}". Ensure backend server is running and database schema matches.`);
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* SECTION 1: UNDER REVIEW QUEUE */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-slate-400" />
          <span>Governance Verification Queue ({pendingQueue.length})</span>
        </h3>

        {pendingQueue.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-2 text-center">
            No records are currently flagged for initial onboarding reviews.
          </p>
        ) : (
          <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
            {pendingQueue.map((vendor) => (
              <div key={vendor._id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 first:pt-0 last:pb-0">
                <div>
                  <h4 className="text-xs font-bold text-slate-700">{vendor.name}</h4>
                  <p className="text-[10px] font-medium text-slate-400 mt-0.5">{vendor.category} &bull; {vendor.city}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Standard Approve */}
                  <button
                    disabled={actioningId !== null}
                    onClick={() => handleStatusChange(vendor._id, 'Active')}
                    className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold transition-colors flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Approve</span>
                  </button>

                  {/* PLACE ADDED HERE: Promote to Strategic Tier */}
                  <button
                    disabled={actioningId !== null}
                    onClick={() => handleStatusChange(vendor._id, 'Strategic Partner')}
                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded text-[10px] font-bold transition-colors flex items-center gap-1"
                  >
                    <Award className="w-3 h-3" />
                    <span>Promote to Strategic</span>
                  </button>

                  {/* Escalate Risk */}
                  <button
                    disabled={actioningId !== null}
                    onClick={() => handleStatusChange(vendor._id, 'Escalated')}
                    className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-[10px] font-bold transition-colors flex items-center gap-1"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    <span>Escalate Risk</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: HIGH-RISK ESCALATION RESOLUTION TRACK */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-red-800 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <span>High-Risk Escalated Resolution Monitor ({escalatedQueue.length})</span>
        </h3>

        {escalatedQueue.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-2 text-center">
            Excellent. No high-risk vendor threats are currently active.
          </p>
        ) : (
          <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
            {escalatedQueue.map((vendor) => (
              <div key={vendor._id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 first:pt-0 last:pb-0">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{vendor.name}</h4>
                  <p className="text-[10px] font-semibold text-red-500 mt-0.5">Status: Critical Risk Escalation</p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Re-evaluate: Push back to Review */}
                  <button
                    disabled={actioningId !== null}
                    onClick={() => handleStatusChange(vendor._id, 'Under Review')}
                    className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-[10px] font-bold transition-colors flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Re-Evaluate</span>
                  </button>
                  {/* Offboard: Archive out of view */}
                  <button
                    disabled={actioningId !== null}
                    onClick={() => handleStatusChange(vendor._id, 'Archived')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded text-[10px] font-bold transition-colors flex items-center gap-1"
                    title="Move vendor out of active channels into archived data stores"
                  >
                    <Archive className="w-3 h-3" />
                    <span>Archive / Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalQueue;