import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  Users, 
  BarChart3, 
  ShieldCheck, 
  Activity,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/UserContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard', roles: ['admin', 'analyst', 'viewer'] },
    { to: '/records', icon: <Receipt size={20} />, label: 'Ledger', roles: ['admin', 'analyst'] },
    { to: '/analytics', icon: <BarChart3 size={20} />, label: 'Analytics', roles: ['admin', 'analyst'] },
    { to: '/users', icon: <Users size={20} />, label: 'Members', roles: ['admin'] },
    { to: '/api-status', icon: <Activity size={20} />, label: 'Diagnostics', roles: ['admin', 'analyst'] }
  ].filter(item => item.roles.includes(user?.role || ''));

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-900 font-sans">
      {/* Premium Sidebar */}
      <aside className="w-80 bg-white border-r border-slate-100 flex flex-col p-8 fixed h-full z-50">
        <div className="flex items-center gap-4 mb-20">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-200">
            <ShieldCheck size={24} className="text-white stroke-[2.5px]" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 leading-none">FinData</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Enterprise Registry</p>
          </div>
        </div>

        <nav className="flex-1 space-y-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 group
                ${isActive ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity transition-transform ${item.to === '/' ? 'translate-x-0' : 'translate-x--1'}`} />
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-10 space-y-6">
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center text-center gap-4 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-opacity group-hover:opacity-10"><ShieldCheck size={80} /></div>
             <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center font-black text-indigo-600 border border-slate-100">
               {user?.name.substring(0, 2).toUpperCase()}
             </div>
             <div>
               <p className="text-sm font-black text-slate-900">{user?.name}</p>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user?.role}</p>
             </div>
             <button onClick={logout} className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all cursor-pointer shadow-sm group">
               <LogOut size={16} />
               <span>End Session</span>
             </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-80 p-12 transition-all">
         <header className="max-w-7xl mx-auto flex justify-between items-center mb-16 px-4">
           <div>
             <h2 className="text-slate-400 text-sm font-bold flex items-center gap-2">
               Enterprise Core Platform <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-ping"></span>
             </h2>
           </div>
           <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                Protocol: Active
             </div>
           </div>
         </header>
         <div className="max-w-7xl mx-auto px-4 pb-20">
           {children}
         </div>
      </main>
    </div>
  );
};

export default Layout;
