import React, { useState } from 'react';
import axios from 'axios';
import { MessageSquare, AlertTriangle, CheckCircle, Send } from 'lucide-react';

const LedgerFeed = ({ vendorId, existingEntries, onNewEntryAdded }) => {
  const [formData, setFormData] = useState({ author: '', entryType: 'Review', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const typeConfig = {
    'Review': { icon: MessageSquare, color: 'text-blue-600 bg-blue-50 border-blue-100' },
    'Success Story': { icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    'Warning': { icon: AlertTriangle, color: 'text-red-600 bg-red-50 border-red-100' }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!formData.author || !formData.message) return;
    setSubmitting(true);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${API_BASE}/api/vendors/${vendorId}/ledger`, formData);
      if (res.data.success) {
        setFormData({ author: '', entryType: 'Review', message: '' });
        onNewEntryAdded(); // Trigger parent profile component refresh reload
      }
    } catch (err) {
      console.error("Failed to post entry:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {/* Structural Left Column: Input Form Engine */}
      <form onSubmit={handlePost} className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-4 md:col-span-1">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Log Institutional Insight</h4>
        
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Your Identity / Department</label>
          <input 
            type="text" 
            required
            value={formData.author}
            onChange={(e) => setFormData(p => ({ ...p, author: e.target.value }))}
            placeholder="e.g., S. Chakraborty (IT Operations)"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Insight Categorization Classification</label>
          <select 
            value={formData.entryType}
            onChange={(e) => setFormData(p => ({ ...p, entryType: e.target.value }))}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-medium"
          >
            <option value="Review">General Review Note</option>
            <option value="Success Story">Success Story Milestone</option>
            <option value="Warning">Critical Operational Warning</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Commentary / Details</label>
          <textarea 
            rows="3"
            required
            value={formData.message}
            onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
            placeholder="Document success criteria or warning signals for other regional boards..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700"
          />
        </div>

        <button 
          type="submit" 
          disabled={submitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-xs transition-colors duration-150 flex items-center justify-center gap-1.5 shadow-sm focus:outline-none disabled:opacity-50"
        >
          <Send className="w-3 h-3"/>
          <span>{submitting ? 'Syncing...' : 'Publish Insight'}</span>
        </button>
      </form>

      {/* Structural Right Column: Timeline Stream Ledger */}
      <div className="md:col-span-2 space-y-4 max-h-125 overflow-y-auto pr-1">
        {existingEntries.length === 0 ? (
          <p className="text-xs text-slate-400 italic bg-white p-4 rounded-xl border text-center">No institutional logs recorded for this supplier.</p>
        ) : (
          existingEntries.map((entry) => {
            const cfg = typeConfig[entry.entryType] || typeConfig['Review'];
            const IconComponent = cfg.icon;
            return (
              <div key={entry._id} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-start gap-4 hover:border-slate-300 transition-colors">
                <div className={`p-2.5 rounded-lg border ${cfg.color}`}><IconComponent className="w-4 h-4" /></div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-700">{entry.author}</span>
                    <span className="text-[10px] font-medium text-slate-400 font-mono">{new Date(entry.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{entry.message}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default LedgerFeed;