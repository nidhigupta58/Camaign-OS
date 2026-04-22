import React from 'react';
import { useCampaignStore } from '../store/useCampaignStore';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Activity, Users, MessageSquare, TrendingUp, Zap, Target } from 'lucide-react';

export const GlobalAnalytics = () => {
  const { campaigns, posts, polls } = useCampaignStore();

  const totalMembers = campaigns.reduce((acc, c) => acc + c.members.length, 0);
  const totalPosts = posts.length;
  const totalPolls = polls.length;

  const leaderboardData = campaigns.map(c => ({
    name: c.title,
    val: c.members.length,
    id: c.id
  })).sort((a, b) => b.val - a.val).slice(0, 5);

  const growthData = [
    { day: 'Mon', active: 400, growth: 240 },
    { day: 'Tue', active: 300, growth: 139 },
    { day: 'Wed', active: 200, growth: 980 },
    { day: 'Thu', active: 278, growth: 390 },
    { day: 'Fri', active: 189, growth: 480 },
    { day: 'Sat', active: 239, growth: 380 },
    { day: 'Sun', active: 349, growth: 430 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="py-4">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">System Performance</h2>
        <p className="text-slate-500 font-medium mt-1">Real-time telemetry and cross-node demographic intelligence.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard icon={Users} label="Total Population" value={totalMembers.toLocaleString()} trend="+12.4%" />
        <MetricCard icon={MessageSquare} label="Aggregated Feeds" value={totalPosts.toLocaleString()} trend="+8.1%" />
        <MetricCard icon={Activity} label="Active Events" value={(totalPosts + totalPolls).toLocaleString()} trend="+14.2%" />
        <MetricCard icon={Zap} label="System Latency" value="24ms" trend="Optimal" color="text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Population vs Capacity</h3>
            <button className="text-[10px] font-bold text-indigo-600 uppercase hover:underline">View Details</button>
          </div>
          <div className="h-64 w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%" minHeight={100} minWidth={0}>
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dy={10} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="active" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorActive)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-rose-500">Node Alerts: Attention Required</h3>
            <span className="text-[10px] font-bold text-slate-400">{campaigns.filter(c => c.members.length < 25).length} Critical</span>
          </div>
          <div className="space-y-3">
             {campaigns.filter(c => c.members.length < 25).slice(0, 5).map(c => (
               <div key={c.id} className="flex items-center justify-between p-3 bg-rose-50/50 border border-rose-100 rounded-lg">
                 <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-slate-900">{c.title}</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-rose-600">{c.members.length} members</span>
                    <button onClick={() => useCampaignStore.getState().selectCampaign(c.id)} className="text-[9px] font-bold text-white bg-rose-500 px-2 py-0.5 rounded shadow-sm hover:bg-rose-600 transition-colors">FIX</button>
                 </div>
               </div>
             ))}
             {campaigns.filter(c => c.members.length < 25).length === 0 && (
               <div className="py-12 text-center">
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">All nodes within nominal range</p>
               </div>
             )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Performance Leaderboard</h3>
          <TrendingUp size={14} className="text-indigo-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 divide-x divide-slate-100">
          {leaderboardData.map((c, i) => (
            <div key={c.id} className="p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer group" onClick={() => useCampaignStore.getState().selectCampaign(c.id)}>
              <span className="text-[10px] font-black text-slate-300 group-hover:text-indigo-400">#{i + 1}</span>
              <h4 className="text-xs font-bold text-slate-900 mt-1 mb-2 truncate">{c.name}</h4>
              <p className="text-xl font-black text-indigo-600">{c.val}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Active Nodes</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Node Health Overview</h3>
          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-bold uppercase tracking-widest border border-emerald-100">ALL SYSTEMS GO</span>
        </div>
        <div className="p-0">
          {campaigns.slice(0, 5).map((c, i) => (
            <div key={c.id} className="flex items-center justify-between p-4 px-6 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center font-black text-slate-400 text-xs">
                  {i + 1}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{c.title}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{c.goal}</p>
                </div>
              </div>
              <div className="flex items-center gap-12">
                 <div className="text-right">
                    <p className="text-xs font-bold text-slate-900">{c.members.length}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">Members</p>
                 </div>
                 <div className="text-right">
                    <p className="text-xs font-bold text-emerald-500">{(80 + Math.random() * 20).toFixed(1)}%</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">Sync</p>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ icon: Icon, label, value, trend, color }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-50 rounded-lg">
        <Icon size={18} className="text-slate-400" />
      </div>
      <span className={`text-[10px] font-bold ${color || 'text-emerald-500'}`}>{trend}</span>
    </div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <h4 className="text-2xl font-black text-slate-900">{value}</h4>
  </div>
);
