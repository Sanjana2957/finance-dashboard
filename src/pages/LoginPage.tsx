import React, { useState } from 'react';
import { useAuth } from '../context/UserContext';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Server, 
  Activity,
  AlertCircle
} from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-lg space-y-10 relative">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-indigo-200 animate-in zoom-in duration-700">
            <ShieldCheck size={40} className="text-white stroke-[2.5px]" />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-900 leading-tight">Identity Verification</h1>
            <p className="text-slate-500 font-medium tracking-tight">Enterprise Control Center | Secure Portal Access</p>
          </div>
        </div>

        <div className="bg-white p-12 rounded-[48px] shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center animate-in slide-in-from-bottom-8 duration-1000">
          <form onSubmit={handleSubmit} className="w-full space-y-8">
            <div className="space-y-6">
              <div className="space-y-2 relative group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1">Enterprise Email</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
                  <input required type="email" placeholder="admin@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 border-none rounded-3xl py-5 pl-14 pr-6 text-sm font-bold focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-300" />
                </div>
              </div>

              <div className="space-y-2 relative group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1">Security Key</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
                  <input required type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 border-none rounded-3xl py-5 pl-14 pr-6 text-sm font-bold focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-300" />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-5 bg-red-50 rounded-3xl border border-red-100 flex items-center gap-3 text-red-600 animate-in shake duration-500">
                <AlertCircle size={20} />
                <span className="text-xs font-black uppercase tracking-tighter">{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-black py-5 rounded-3xl shadow-2xl shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-3 group">
              {loading ? <Activity className="animate-spin" /> : <><span>Grant Access</span> <ArrowRight className="group-hover:translate-x-1 transition-transform" /></>}
            </button>

            <div className="mt-6 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 text-center animate-in fade-in slide-in-from-top-4 duration-1000 delay-500">
              <p className="text-[11px] font-black text-indigo-600 leading-loose">
                Demo access: admin@gmail.com <span className="mx-2 opacity-30">|</span> password: password123
              </p>
            </div>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 w-full flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <Server size={12} />
              <span>Core infrastructure: Healthy</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-8 text-[10px] font-black text-slate-300 uppercase tracking-widest">
          <span className="hover:text-indigo-600 cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-indigo-600 cursor-pointer transition-colors">Audit Protocol</span>
          <span className="hover:text-indigo-600 cursor-pointer transition-colors">Identity Help</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
