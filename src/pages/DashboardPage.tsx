import React, { useState, useEffect } from 'react';
import { apiClient, useAuth } from '../context/UserContext';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ListRestart, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  Activity as ActivityIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const SummaryCard: React.FC<{ icon: any, label: string, value: string, color: string, bgColor: string }> = ({ icon: Icon, label, value, color, bgColor }) => (
  <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
    <div className={`w-10 h-10 ${bgColor} ${color} rounded-2xl flex items-center justify-center mb-4`}>
      <Icon size={20} className="stroke-[2.5px]" />
    </div>
    <div className="space-y-1">
      <p className="text-xs font-black text-slate-600 uppercase tracking-widest">{label}</p>
      <p className={`text-xl font-black ${color} tracking-tight`}>{value}</p>
    </div>
  </div>
);

const DashboardPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [summary, setSummary] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [trends, setTrends] = useState<any[]>([]);
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [sumRes, actRes, catRes, trendRes, healthRes] = await Promise.all([
          apiClient.get('/analytics/summary'),
          apiClient.get('/analytics/recent-activity?limit=5'),
          apiClient.get('/analytics/categories?type=expense'),
          apiClient.get('/analytics/trends?period=monthly'),
          apiClient.get('/health'),
        ]);

        setSummary(sumRes.data.data);
        setRecentActivity(actRes.data.data);
        setCategories(catRes.data.data);
        setTrends(trendRes.data.data);
        setHealth(healthRes.data.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) return <div className="animate-pulse flex flex-col gap-8 h-screen pt-10"><div className="h-32 bg-slate-200 rounded-2xl w-full"></div><div className="grid grid-cols-1 md:grid-cols-2 gap-8"><div className="h-64 bg-slate-200 rounded-2xl"></div><div className="h-64 bg-slate-200 rounded-2xl"></div></div></div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 leading-tight">Finance Data Processing Dashboard</h1>
          <p className="text-slate-500 font-medium font-inter">Global Financial Operations Center</p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-2.5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-slate-600 uppercase tracking-widest">API Status:</span>
            {health?.status === 'healthy' ? (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                <CheckCircle2 size={12} /> Healthy
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg">
                <AlertCircle size={12} /> Error
              </span>
            )}
          </div>
          <div className="w-px h-4 bg-slate-200 mx-2"></div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-slate-600 uppercase tracking-widest">DB:</span>
            <span className="text-xs font-bold text-slate-600">{health?.database || 'Unknown'}</span>
          </div>
        </div>
      </div>

      <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-100 flex items-center justify-between group animate-in fade-in slide-in-from-top-6 duration-1000">
        <div className="absolute top-[-50%] right-[-10%] w-[60%] h-[200%] bg-white/5 rotate-12 blur-[100px] pointer-events-none group-hover:bg-white/10 transition-colors duration-1000"></div>
        <div className="relative space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] font-black uppercase tracking-[3px] bg-white/20 px-3 py-1 rounded-full border border-white/20">Security Clearance: {currentUser?.role}</span>
          </div>
          <h2 className="text-4xl font-black tracking-tight leading-tight">Welcome Back, {currentUser?.name.split(' ')[0]}</h2>
          <p className="text-indigo-100 font-medium max-w-lg leading-relaxed">Identity verified. {
            currentUser?.role === 'admin' ? 'Full Enterprise Control protocol is active.' :
            currentUser?.role === 'analyst' ? 'Analytical insights and registry access confirmed.' :
            'Dashboard summary mode enabled for monitoring.'
          }</p>
        </div>
        <div className="relative flex gap-4">
           <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-xl"><ActivityIcon size={32} /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <SummaryCard 
          icon={TrendingUp} 
          label="Total Income" 
          value={`$${(summary?.totalIncome || 0).toLocaleString()}`} 
          color="text-emerald-600" 
          bgColor="bg-emerald-50" 
        />
        <SummaryCard 
          icon={TrendingDown} 
          label="Total Expenses" 
          value={`$${(summary?.totalExpenses || 0).toLocaleString()}`} 
          color="text-red-600" 
          bgColor="bg-red-50" 
        />
        <SummaryCard 
          icon={Wallet} 
          label="Net Balance" 
          value={`$${(summary?.netBalance || 0).toLocaleString()}`} 
          color="text-indigo-600" 
          bgColor="bg-indigo-50" 
        />
        <SummaryCard 
          icon={ListRestart} 
          label="Total Records" 
          value={(summary?.totalRecords || 0).toString()} 
          color="text-slate-600" 
          bgColor="bg-slate-100" 
        />
        <SummaryCard 
          icon={Users} 
          label="Active Users" 
          value={(summary?.activeUsers || 0).toString()} 
          color="text-blue-600" 
          bgColor="bg-blue-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900 border-l-4 border-indigo-600 pl-4">Monthly Financial Trend</h3>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">Enterprise Yearly Trend</span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer>
              <BarChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 500, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 500, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ border: 'none', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }} 
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Bar dataKey="income" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Income" />
                <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900 border-l-4 border-indigo-600 pl-4">Expense Categories</h3>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie 
                  data={categories} 
                  innerRadius={80} 
                  outerRadius={100} 
                  paddingAngle={5} 
                  dataKey="amount" 
                  nameKey="category"
                  stroke="none"
                >
                  {categories.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {categories.map((cat, i) => (
              <div key={cat.category} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                <span className="text-[11px] font-semibold text-slate-600 truncate">{cat.category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      { currentUser?.role !== 'viewer' && (
      <div className="bg-white border border-slate-200 overflow-hidden rounded-3xl shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-900">Recent Financial Activity</h3>
          <Link to="/records" className="text-sm font-black text-indigo-600 hover:text-indigo-700">View All Records &rarr;</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-xs font-black text-slate-600 uppercase tracking-widest">Transaction Date</th>
                <th className="px-6 py-4 text-xs font-black text-slate-600 uppercase tracking-widest">Entry Description</th>
                <th className="px-6 py-4 text-xs font-black text-slate-600 uppercase tracking-widest text-right">Net Amount</th>
                <th className="px-6 py-4 text-xs font-black text-slate-600 uppercase tracking-widest">Registry Type</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((r) => (
                <tr key={r.id} className="border-b border-slate-50 hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-6 py-4 text-sm font-medium text-slate-600 whitespace-nowrap">
                    {new Date(r.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 truncate max-w-xs">{r.description}</td>
                  <td className={`px-6 py-4 text-sm font-black text-right ${r.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {r.type === 'income' ? '+' : '-'}${r.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] uppercase font-black px-2 py-1 rounded-lg tracking-tighter ${
                      r.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {r.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </div>
  );
};

export default DashboardPage;
