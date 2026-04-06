import React, { useState, useEffect } from 'react';
import { apiClient, useAuth } from '../context/UserContext';
import { 
  Search, 
  Trash2, 
  Plus, 
  X,
  Pencil
} from 'lucide-react';

const RecordsPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: 'SaaS Subscription',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const isAdmin = currentUser?.role === 'admin';

  const fetchRecords = async () => {
    try {
      setLoading(true);
      let url = '/records?';
      if (searchTerm) url += `search=${searchTerm}&`;
      if (filterType) url += `type=${filterType}&`;
      if (filterCategory) url += `category=${filterCategory}&`;
      
      const res = await apiClient.get(url);
      setRecords(res.data.data);
    } catch (err) {
      console.error('Failed to fetch records', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchRecords();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filterType, filterCategory]);

  const handleOpenAdd = () => {
    setIsEditMode(false);
    setEditingId(null);
    setFormData({ amount: '', type: 'expense', category: 'SaaS Subscription', date: new Date().toISOString().split('T')[0], description: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (record: any) => {
    setIsEditMode(true);
    setEditingId(record.id);
    setFormData({
      amount: record.amount.toString(),
      type: record.type,
      category: record.category,
      date: new Date(record.date).toISOString().split('T')[0],
      description: record.description
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    try {
      const payload = { ...formData, amount: parseFloat(formData.amount) };
      if (isEditMode && editingId) {
        await apiClient.put(`/records/${editingId}`, payload);
      } else {
        await apiClient.post('/records', payload);
      }
      setIsModalOpen(false);
      fetchRecords();
    } catch (err) {
      alert('Transaction failed. Policy violation.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) return;
    if (!window.confirm('Archive this record?')) return;
    try {
      await apiClient.delete(`/records/${id}`);
      setRecords(records.filter(r => r.id !== id));
    } catch (err) {
      alert('Archive failed');
    }
  };

  if (loading && records.length === 0) return <div className="animate-pulse flex flex-col gap-8 h-screen pt-10"><div className="h-16 bg-slate-200 rounded-2xl w-full"></div><div className="h-64 bg-slate-200 rounded-2xl"></div></div>;

  return (
    <div className="space-y-8 relative">
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-8 space-y-6 relative border border-slate-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"><X size={20}/></button>
            <h2 className="text-2xl font-black text-slate-900 leading-tight">{isEditMode ? 'Modify Enterprise Record' : 'Post Technical Transaction'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Amount ($)</label>
                <input required type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-indigo-600 outline-none transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
                  <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-indigo-600 outline-none appearance-none cursor-pointer">
                    <option value="income">Income</option><option value="expense">Expense</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-indigo-600 outline-none appearance-none cursor-pointer">
                    {['SaaS Subscription', 'Enterprise Sales', 'Cloud Infra', 'Payroll', 'Consulting'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <input required type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-indigo-600 outline-none" />
              <textarea required placeholder="Transaction description..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-indigo-600 outline-none h-20" />
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-indigo-200 shadow-xl transition-all active:scale-95">
                {isEditMode ? 'Commit Changes' : 'Post Record'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 leading-tight">Financial Records</h1>
          <p className="text-slate-500 font-medium tracking-tight">Main ledger for enterprise transactions.</p>
        </div>
        {isAdmin && (
          <button onClick={handleOpenAdd} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl font-bold transition-all shadow-indigo-100 shadow-lg active:scale-95 group">
            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
            <span>Add Record</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 border border-slate-200 rounded-3xl">
        <div className="md:col-span-2 relative"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" /><input type="text" placeholder="Search records..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-indigo-600 outline-none" /></div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-indigo-600 outline-none"><option value="">All Types</option><option value="income">Income</option><option value="expense">Expense</option></select>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-indigo-600 outline-none"><option value="">All Categories</option><option value="Enterprise Sales">Enterprise Sales</option><option value="Cloud Infra">Cloud Infra</option></select>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-xs font-black text-slate-600 uppercase tracking-widest">Post Date</th>
                <th className="px-6 py-4 text-xs font-black text-slate-600 uppercase tracking-widest">Statement Entry</th>
                <th className="px-6 py-4 text-xs font-black text-slate-600 uppercase tracking-widest">Classification</th>
                <th className="px-6 py-4 text-xs font-black text-slate-600 uppercase tracking-widest text-right">Debit/Credit</th>
                <th className="px-6 py-4 text-xs font-black text-slate-600 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50 group transition-colors">
                  <td className="px-6 py-5 text-sm font-medium text-slate-500 whitespace-nowrap">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="px-6 py-5"><p className="text-sm font-black text-slate-900 truncate max-w-sm">{r.description}</p></td>
                  <td className="px-6 py-5"><span className="text-xs font-bold text-slate-600 px-2 py-1 bg-slate-100 rounded-lg">{r.category}</span></td>
                  <td className={`px-6 py-5 text-sm font-black text-right ${r.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {r.type === 'income' ? '+' : '-'}${r.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => isAdmin && handleOpenEdit(r)} 
                          disabled={!isAdmin}
                          className={`p-2 transition-all rounded-xl ${isAdmin ? 'text-indigo-400 hover:text-indigo-700 hover:bg-indigo-50 cursor-pointer' : 'text-slate-200 cursor-not-allowed'}`} 
                          title={isAdmin ? "Modify Record" : "Access Required"}
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={() => isAdmin && handleDelete(r.id)} 
                          disabled={!isAdmin}
                          className={`p-2 transition-all rounded-xl ${isAdmin ? 'text-red-300 hover:text-red-700 hover:bg-red-50 cursor-pointer' : 'text-slate-200 cursor-not-allowed'}`} 
                          title={isAdmin ? "Archive Record" : "Access Required"}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      {!isAdmin && <span className="text-[9px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-widest mr-2">Protected Protocol</span>}
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

export default RecordsPage;
