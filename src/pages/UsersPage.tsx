import React, { useState, useEffect } from 'react';
import { apiClient, useAuth } from '../context/UserContext';
import { 
  ShieldAlert, 
  UserPlus, 
  ToggleLeft, 
  ToggleRight, 
  Mail,
  UserCheck,
  X,
  Pencil
} from 'lucide-react';

const UsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'viewer',
    isActive: true
  });

  const isAdmin = currentUser?.role === 'admin';
  const isAnalyst = currentUser?.role === 'analyst';

  const fetchUsers = async () => {
    if (!isAdmin && !isAnalyst) return;
    try {
      const res = await apiClient.get('/users');
      setUsers(res.data.data);
    } catch (err: any) {
      console.error('Failed to load users', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [isAdmin, isAnalyst]);

  const handleOpenAdd = () => {
    setIsEditMode(false);
    setEditingId(null);
    setFormData({ name: '', email: '', role: 'viewer', isActive: true });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: any) => {
    setIsEditMode(true);
    setEditingId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      password: user.password || ''
    } as any);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    try {
      if (isEditMode && editingId) {
        await apiClient.put(`/users/${editingId}`, formData);
      } else {
        await apiClient.post('/users', formData);
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      alert('Operation failed. Check security policies.');
    }
  };

  const handleToggleStatus = async (id: string) => {
    if (!isAdmin) return;
    try {
      await apiClient.patch(`/users/${id}/status`);
      setUsers(users.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
    } catch (err) {
      alert('Status policy violation.');
    }
  };

  const handleUpdateRole = async (id: string, newRole: string) => {
    if (!isAdmin) return;
    try {
      await apiClient.patch(`/users/${id}/role`, { role: newRole });
      setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
    } catch (err) {
      alert('Role transition failed.');
    }
  };

  if (!isAdmin && !isAnalyst) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mb-6 shadow-red-100 shadow-xl border-4 border-white"><ShieldAlert size={40} className="stroke-[2.5px]" /></div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Access Restricted</h2>
        <p className="text-slate-500 font-medium text-center max-w-sm mb-8">Security clearing required. Administrator or Analyst only.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-8 space-y-6 relative border border-slate-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"><X size={20}/></button>
            <h2 className="text-2xl font-black text-slate-900 leading-tight">{isEditMode ? 'Modify Member Profile' : 'Enroll Enterprise Member'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-indigo-600 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address (@gmail.com)</label>
                <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="example@gmail.com" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Role</label>
                <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-indigo-600 outline-none">
                  <option value="viewer">Viewer</option><option value="analyst">Analyst</option><option value="admin">Admin</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Temporary Security Key</label>
                <input required type="text" placeholder="e.g. Pass123!" value={(formData as any).password || ''} onChange={(e) => setFormData({...formData, password: e.target.value} as any)} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-indigo-600 outline-none" />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-indigo-200 shadow-xl transition-all active:scale-95">
                {isEditMode ? 'Save Profile Changes' : 'Enroll Enterprise Member'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 leading-tight">User Management</h1>
          <p className="text-slate-500 font-medium">Enterprise member clearance matrix.</p>
        </div>
        {isAdmin && (
          <button onClick={handleOpenAdd} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl font-bold transition-all shadow-indigo-200 shadow-lg active:scale-95 group">
            <UserPlus size={20} className="group-hover:translate-x-0.5" />
            <span>Create User</span>
          </button>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-xs font-black text-slate-600 lg:w-48 uppercase">Verified Member</th>
                <th className="px-6 py-4 text-xs font-black text-slate-600 uppercase">Clearance Layer</th>
                <th className="px-6 py-4 text-xs font-black text-slate-600 uppercase">Registry ID</th>
                <th className="px-6 py-4 text-xs font-black text-slate-600 uppercase">Authentication Status</th>
                <th className="px-6 py-4 text-xs font-black text-slate-600 uppercase text-right">Settings</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className={`border-b border-slate-50 transition-colors group ${!u.isActive ? 'bg-slate-50/50 grayscale-[0.5]' : 'hover:bg-indigo-50/30'}`}>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${!u.isActive ? 'bg-slate-200 text-slate-400' : 'bg-indigo-100 text-indigo-700'}`}>{u.name.substring(0, 2).toUpperCase()}</div>
                      <div><p className="text-sm font-black text-slate-900">{u.name}</p><p className="text-xs font-medium text-slate-400 flex items-center gap-1 mt-0.5"><Mail size={10} /> {u.email}</p></div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {isAdmin ? (
                      <select value={u.role} onChange={(e) => handleUpdateRole(u.id, e.target.value)} className="bg-transparent text-sm font-bold text-slate-700 border-b-2 border-transparent focus:border-indigo-600 focus:outline-none transition-all cursor-pointer uppercase tracking-tight">
                        <option value="viewer">Viewer</option><option value="analyst">Analyst</option><option value="admin">Admin</option>
                      </select>
                    ) : ( <span className="text-sm font-black text-slate-900 uppercase tracking-tighter">{u.role}</span> )}
                  </td>
                  <td className="px-6 py-5"><code className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-md uppercase tracking-widest">{u.id}</code></td>
                  <td className="px-6 py-5">
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg uppercase tracking-widest">
                      {u.isActive ? <><UserCheck size={12} /> Active</> : 'Deactivated'}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => isAdmin && handleOpenEdit(u)} 
                          disabled={!isAdmin}
                          className={`p-2 transition-all rounded-xl ${isAdmin ? 'text-indigo-400 hover:text-indigo-700 hover:bg-indigo-50 cursor-pointer' : 'text-slate-200 cursor-not-allowed'}`} 
                          title={isAdmin ? "Edit Profile" : "Access Required"}
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={() => isAdmin && handleToggleStatus(u.id)} 
                          disabled={!isAdmin}
                          className={`p-2 transition-all rounded-xl ${isAdmin ? (u.isActive ? 'text-emerald-600 hover:bg-emerald-50 cursor-pointer' : 'text-slate-400 hover:bg-slate-100 cursor-pointer') : 'text-slate-200 cursor-not-allowed'}`} 
                          title={isAdmin ? "Toggle Status" : "Access Required"}
                        >
                          {u.isActive ? <ToggleRight size={22} className="stroke-[2.5px]" /> : <ToggleLeft size={22} className="stroke-[2.5px]" />}
                        </button>
                      </div>
                      {!isAdmin && <span className="text-[9px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-widest mr-2 whitespace-nowrap">Protected Account</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
