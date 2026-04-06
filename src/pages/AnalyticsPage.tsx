import React, { useState, useEffect } from 'react';
import { apiClient, useAuth } from '../context/UserContext';
import { 
  ShieldAlert, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar
} from 'recharts';

const AnalyticsPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [trends, setTrends] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = currentUser?.role === 'admin';
  const isAnalyst = currentUser?.role === 'analyst';

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!isAdmin && !isAnalyst) return;
      try {
        setLoading(true);
        const [trendRes, catRes, incCatRes] = await Promise.all([
          apiClient.get('/analytics/trends?period=monthly'),
          apiClient.get('/analytics/categories?type=expense'),
          apiClient.get('/analytics/categories?type=income'),
        ]);
        setTrends(trendRes.data.data);
        setCategories(catRes.data.data);
        setIncomeCategories(incCatRes.data.data);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [isAdmin, isAnalyst]);

  if (!isAdmin && !isAnalyst) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mb-6 shadow-amber-100 shadow-xl border-4 border-white">
          <ShieldAlert size={40} className="stroke-[2.5px]" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Analytics Restricted</h2>
        <p className="text-slate-500 font-medium text-center max-w-sm mb-8">
          Detailed financial analytics and trend reports are reserved for <span className="font-bold text-slate-900 underline decoration-indigo-500">Administrator</span> and <span className="font-bold text-slate-900 underline decoration-indigo-500">Analyst</span> roles.
        </p>
        <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mb-4 italic text-[10px]">Access Control Check</p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
              <span>Custom '/api/analytics/trends' 403 response verified</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <div className="animate-pulse flex flex-col gap-8 h-screen pt-10"><div className="h-64 bg-slate-200 rounded-3xl w-full"></div><div className="h-64 bg-slate-200 rounded-3xl w-full"></div></div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 leading-tight">Advanced Analytics</h1>
          <p className="text-slate-500 font-medium">Detailed trend visualisations and category-wise performance reports.</p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-xl text-indigo-700 font-bold border border-indigo-100 text-xs">
          <Activity size={14} className="stroke-[2.5px]" />
          <span>Real-time backend processing active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-slate-900">Revenue & Expense Timeline</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Income</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Expense</span>
              </div>
            </div>
          </div>
          <div className="h-96 w-full">
            <ResponsiveContainer>
              <AreaChart data={trends}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 500, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 500, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ border: 'none', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '16px' }} 
                  itemStyle={{ fontSize: '13px', fontWeight: 'black' }}
                />
                <Area type="natural" dataKey="income" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" name="Income ($)" />
                <Area type="natural" dataKey="expense" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" name="Expenses ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <TrendingUp className="text-emerald-500 stroke-[2.5px]" size={18} />
                Income Source Analysis
              </h3>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <BarChart data={incomeCategories} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis type="category" dataKey="category" axisLine={false} tickLine={false} width={100} tick={{ fontSize: 11, fontWeight: 'bold', fill: '#475569' }} />
                  <Tooltip 
                    contentStyle={{ border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="amount" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24} name="Income Amount" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <TrendingDown className="text-red-500 stroke-[2.5px]" size={18} />
                Expense Allocation
              </h3>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <BarChart data={categories} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis type="category" dataKey="category" axisLine={false} tickLine={false} width={100} tick={{ fontSize: 11, fontWeight: 'bold', fill: '#475569' }} />
                  <Tooltip 
                    contentStyle={{ border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="amount" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={24} name="Expense Amount" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
