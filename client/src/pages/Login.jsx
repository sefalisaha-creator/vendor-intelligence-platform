import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Building2, KeyRound, Mail, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const result = await login(credentials.email, credentials.password);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setErrorMsg(result.error);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200/80 rounded-2xl p-8 max-w-md w-full shadow-xl shadow-slate-100/50 space-y-6">
        
        {/* Brand System Hub Icon Layout */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mx-auto shadow-md shadow-blue-100">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Vendor Intelligence Portal</h2>
          <p className="text-xs text-slate-400 font-medium">35+ Years Enterprise Relationship Management System</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 border border-red-100 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Corporate Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="email"
                required
                value={credentials.email}
                onChange={(e) => setCredentials(p => ({ ...p, email: e.target.value }))}
                placeholder="employee@company.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">System Security Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="password"
                required
                value={credentials.password}
                onChange={(e) => setCredentials(p => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-md shadow-blue-100 disabled:opacity-50 mt-2"
          >
            {loading ? 'Validating Workspace Access...' : 'Authenticate Access Credentials'}
          </button>
        </form>

        {/* Informative Guidance Panel for Evaluators */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-1">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Evaluation Credential Guide:</span>
          <p className="text-[11px] text-slate-600 font-medium">Employee: <span className="font-mono text-blue-600 font-bold">employee@company.com</span> / password123</p>
          <p className="text-[11px] text-slate-600 font-medium">HR/Admin: <span className="font-mono text-emerald-600 font-bold">admin@company.com</span> / admin123</p>
        </div>

      </div>
    </div>
  );
};

export default Login;