import React from 'react';
import { 
  ShieldCheck, 
  Database, 
  Lock, 
  Terminal,
  Server,
  Key
} from 'lucide-react';
import { useAuth } from '../context/UserContext';

const ApiStatusPage: React.FC = () => {
  const { user } = useAuth();

  const endpoints = [
    { 
      name: 'System Health Diagnostics', 
      access: 'Public', 
      status: 'Stable',
      description: 'Verifies server uptime and database connectivity.' 
    },
    { 
      name: 'Identity & Access Verification', 
      access: 'Secured', 
      status: 'Active',
      description: 'Confirms the current user profile and session security.' 
    },
    { 
      name: 'Enterprise Member Management', 
      access: 'Admin Only', 
      status: 'Restricted',
      description: 'Advanced controls for user roles and account status.' 
    },
    { 
      name: 'Financial Ledger Registry', 
      access: 'All Members', 
      status: 'Operational',
      description: 'Master database for all income and expense entries.' 
    },
    { 
      name: 'Dashboard Analytics Engine', 
      access: 'All Members', 
      status: 'Operational',
      description: 'Aggregates totals for high-level summary cards.' 
    },
    { 
      name: 'Performance Trend Analysis', 
      access: 'Admins & Analysts', 
      status: 'Analytical',
      description: 'Generates time-series data for growth visualization.' 
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-100 text-indigo-700 rounded-2xl shadow-lg shadow-indigo-50"><Server size={28} className="stroke-[2.5px]" /></div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 leading-tight">System Diagnostics</h1>
          <p className="text-slate-500 font-medium tracking-tight">Real-time enterprise infrastructure monitoring.</p>
        </div>
      </div>

      <div className="bg-slate-950 rounded-[40px] shadow-2xl overflow-hidden border-8 border-slate-900">
        <div className="bg-slate-900 px-8 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-[4px]">Enterprise Status Protocol</div>
          <Terminal size={16} className="text-slate-500" />
        </div>
        
        <div className="p-1">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <th className="px-8 py-6">Service Component</th>
                <th className="px-8 py-6">Security Level</th>
                <th className="px-8 py-6">Protocol Status</th>
                <th className="px-8 py-6">Purpose</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              {endpoints.map((ep, i) => (
                <tr key={i} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-5 font-black text-white">{ep.name}</td>
                  <td className="px-8 py-5">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md tracking-tighter ${ep.access.includes('Secured') || ep.access.includes('Admin') ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-500/20 text-slate-400'}`}>
                      {ep.access}
                    </span>
                  </td>
                  <td className="px-8 py-5 font-bold text-slate-400">{ep.status}</td>
                  <td className="px-8 py-5 text-sm italic text-slate-500">{ep.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl shadow-slate-100/50 space-y-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 text-slate-50 opacity-0 group-hover:opacity-100 transition-opacity"><Lock size={120} /></div>
        <div className="flex items-center gap-6 relative">
          <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-200">
            <ShieldCheck size={32} className="text-white stroke-[2.5px]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Access Verification context</h2>
            <p className="text-slate-500 font-medium tracking-tight italic">Current authentication layer active.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          <div className="space-y-4 p-8 bg-indigo-50/50 rounded-[30px] border border-indigo-100/50">
            <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest"><Key size={14} /> Identity Signature</div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-indigo-100/50 flex items-center justify-between">
              <span className="text-sm font-bold text-indigo-900 lowercase italic tracking-tight">Active Reference: {user?.id}</span>
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Verified</span>
            </div>
          </div>

          <div className="space-y-4 p-8 bg-slate-50/50 rounded-[30px] border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 font-black text-[10px] uppercase tracking-widest"><Database size={14} /> Persistence Lock</div>
            <div className="text-sm font-bold text-slate-600 italic tracking-tight">Active session cached in secure local container.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiStatusPage;
