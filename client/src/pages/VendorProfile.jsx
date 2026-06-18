import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import LedgerFeed from '../components/vendors/LedgerFeed';
import { ArrowLeft, Briefcase, BarChart3, History, Calendar, User2 } from 'lucide-react';

const VendorProfile = () => {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchProfile = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${API_BASE}/api/vendors/${id}`);
      if (res.data.success) {
        setProfileData(res.data.data);
      }
    } catch (err) {
      console.error("Profile synchronization breakdown:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  if (loading) return <div className="text-sm font-medium text-slate-500">Retrieving operational records...</div>;
  if (!profileData) return <div className="text-sm font-semibold text-red-500">Vendor database entry not found.</div>;

  const { vendor, historyLedger } = profileData;

  const tabClass = (tabId) => `px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-150 focus:outline-none ${
    activeTab === tabId ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
  }`;

  return (
    <div className="space-y-6 max-w-5xl">
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Discovery Hub
      </Link>

      {/* Master Profile Dossier Header Box */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 tracking-widest uppercase">{vendor.category} &bull; {vendor.city}</span>
          <h2 className="text-2xl font-bold text-slate-800 mt-1">{vendor.name}</h2>
        </div>
        <div className="px-4 py-2 bg-slate-50 border rounded-lg text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Operational Tier</span>
          <span className="text-xs font-bold text-slate-700">{vendor.status}</span>
        </div>
      </div>

      {/* Tab Navigation Interface Deck */}
      <div className="border-b border-slate-200 flex items-center gap-2">
        <button onClick={() => setActiveTab('overview')} className={tabClass('overview')}>Overview</button>
        <button onClick={() => setActiveTab('performance')} className={tabClass('performance')}>Performance & Governance</button>
        <button onClick={() => setActiveTab('ledger')} className={tabClass('ledger')}>Experience Ledger ({historyLedger.length})</button>
      </div>

      {/* Tab Panel Render Routing Cases */}
      <div className="mt-4">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm md:col-span-2 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2 flex items-center gap-2"><Briefcase className="w-4 h-4 text-slate-400"/>Active System Registries</h3>
              {vendor.activeContracts?.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No legal framework contracts active currently.</p>
              ) : (
                vendor.activeContracts.map(c => (
                  <div key={c.contractId} className="p-4 bg-slate-50 border border-slate-100 rounded-lg space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>{c.description}</span>
                      <span className="text-blue-600 font-mono">{c.contractId}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-1"><Calendar className="w-3 h-3"/> {new Date(c.startDate).toLocaleDateString()} to {new Date(c.endDate).toLocaleDateString()}</div>
                  </div>
                ))
              )}
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2 flex items-center gap-2"><User2 className="w-4 h-4 text-slate-400"/>Stakeholders</h3>
              <div className="flex flex-wrap gap-1.5">
                {vendor.departmentsUsed.map(d => (
                  <span key={d} className="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded">Dept: {d}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-6 max-w-xl">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-slate-400"/>Metric Matrix Balanced Scorecard</h3>
            {[
              { label: 'SLA Compliance Validation', val: vendor.scorecard.slaCompliance },
              { label: 'Cross-Department Communication', val: vendor.scorecard.communication },
              { label: 'Quality of Delivered Service', val: vendor.scorecard.qualityOfService }
            ].map(m => (
              <div key={m.label} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                  <span>{m.label}</span>
                  <span className="font-bold text-slate-800">{m.val} / 5.0</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${(m.val / 5) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'ledger' && (
          <LedgerFeed vendorId={vendor._id} existingEntries={historyLedger} onNewEntryAdded={fetchProfile} />
        )}
      </div>
    </div>
  );
};

export default VendorProfile;