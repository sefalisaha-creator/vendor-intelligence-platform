import React, { useState } from 'react';
import axios from 'axios';
import { useVendors } from '../../context/VendorContext';
import { AlertCircle, PlusCircle } from 'lucide-react';

const VendorOnboardingForm = () => {
  const { vendors, refreshVendors } = useVendors();
  const [form, setForm] = useState({ name: '', category: 'Facility Management', city: 'Kolkata' });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Proactive Client-Side Data Integrity Validation Engine
  const isPotentialDuplicate = vendors.some(
    v => v.name.trim().toLowerCase() === form.name.trim().toLowerCase()
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || isPotentialDuplicate) return;

    setSubmitting(true);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      // SETTING STATUS TO 'Under Review' SO IT IMMEDIATELY ENTERS THE GOVERNANCE QUEUE
      const payload = {
        ...form,
        status: 'Under Review', 
        departmentsUsed: ['Admin/HR Override'],
        scorecard: { slaCompliance: 4.0, communication: 4.0, qualityOfService: 4.0 },
        activeContracts: []
      };

      // Correctly referencing the unified 'axios' instance variable
      const res = await axios.post(`${API_BASE}/api/vendors`, payload);
      
      if (res.data.success || res.status === 201) {
        setSuccessMsg(`Vendor "${form.name}" successfully initiated into vetting stream.`);
        setForm({ name: '', category: 'Facility Management', city: 'Kolkata' });
        
        // Refresh global state context so all screen widgets redraw instantly
        refreshVendors();
        
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error("Onboarding server fault:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2">
        Strategic Onboarding Registry
      </h3>

      {successMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold border border-emerald-100">
          {successMsg}
        </div>
      )}

      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Vendor Name</label>
        <input 
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
          placeholder="e.g., Eastern Power Grid Corp"
          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-medium"
        />
        {form.name && isPotentialDuplicate && (
          <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 p-2 rounded-md mt-1 text-[11px] font-medium border border-amber-100">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Potential duplicate vendor name found in company directory!</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Category Operations</label>
        <select
          value={form.category}
          onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-medium"
        >
          <option value="Facility Management">Facility Management</option>
          <option value="Information Technology">Information Technology</option>
          <option value="Logistics">Logistics</option>
          <option value="Hospitality">Hospitality</option>
          <option value="Legal Services">Legal Services</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Base Operating City</label>
        <select
          value={form.city}
          onChange={(e) => setForm(p => ({ ...p, city: e.target.value }))}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-medium"
        >
          <option value="Kolkata">Kolkata</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Pune">Pune</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={submitting || (form.name && isPotentialDuplicate)}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold py-2.5 rounded-lg text-xs transition-all duration-150 flex items-center justify-center gap-1.5 shadow-sm focus:outline-none"
      >
        <PlusCircle className="w-4 h-4" />
        <span>{submitting ? 'Syncing Schema...' : 'Initialize Onboarding'}</span>
      </button>
    </form>
  );
};

export default VendorOnboardingForm;