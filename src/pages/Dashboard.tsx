import React, { useState } from 'react';
import { useCampaignStore } from '../store/useCampaignStore';
import { CampaignCard } from '../components/campaign/CampaignCard';
import { Plus, Search, Filter, TrendingUp, Users, Activity } from 'lucide-react';
import { CampaignGoal } from '../types';

export const Dashboard = () => {
  const { campaigns, addCampaign, deleteCampaign, selectCampaign } = useCampaignStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [newCampaign, setNewCampaign] = useState({
    title: '',
    description: '',
    tags: '',
    goal: 'AWARENESS' as CampaignGoal
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addCampaign(
      newCampaign.title,
      newCampaign.description,
      newCampaign.tags.split(',').map(t => t.trim()),
      newCampaign.goal
    );
    setNewCampaign({ title: '', description: '', tags: '', goal: 'AWARENESS' });
    setIsModalOpen(false);
  };

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<CampaignGoal | 'ALL'>('ALL');

  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGoal = selectedGoal === 'ALL' || c.goal === selectedGoal;
    return matchesSearch && matchesGoal;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 px-6 -mx-6 bg-white border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
             <span>Projects / <span className="text-slate-900 font-medium">Global_OS_System</span></span>
             <span className="w-1 h-1 bg-slate-300 rounded-full" />
             <span className="flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-black border border-emerald-100 uppercase animate-pulse">
               System Nominal
             </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Campaign Console</h2>
        </div>
        <div className="flex gap-3">
          <div className="relative hidden md:block group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search command..." 
              className="bg-slate-100 border-none text-sm rounded-lg px-4 py-2 pl-10 w-64 focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            New Campaign
          </button>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Total Members" value={campaigns.reduce((acc, c) => acc + c.members.length, 0).toLocaleString()} trend="+14% from last week" />
        <StatCard label="Active Discussions" value={campaigns.length * 12} trend="24 posts today" />
        <StatCard label="Engagement Rate" value="22.4%" trend="Goal: 25.0%" color="indigo" />
        <StatCard label="Sentiment" value="Positive" trend="High confidence" color="emerald" />
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search campaigns, tags, or descriptions..." 
            className="w-full bg-slate-50 border border-transparent rounded-xl py-3 pl-12 pr-12 text-sm font-medium focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
            >
              <Plus size={16} className="rotate-45" />
            </button>
          )}
        </div>
        <div className="flex gap-3 w-full md:w-auto shrink-0">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all border ${
              isFilterOpen 
                ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-inner' 
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Filter size={16} />
            {selectedGoal === 'ALL' ? 'Filter' : selectedGoal}
          </button>
          <div className="h-10 w-[1px] bg-slate-100 hidden md:block self-center mx-1" />
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
            <button className="p-2 text-indigo-600 bg-white rounded-lg shadow-sm">
              <TrendingUp size={16} />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Activity size={16} />
            </button>
          </div>
        </div>
      </div>

      {isFilterOpen && (
        <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Segmentation Protocol</h4>
            <button onClick={() => setSelectedGoal('ALL')} className="text-[10px] font-bold text-slate-400 hover:text-rose-500 uppercase">Clear Filters</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {['ALL', 'AWARENESS', 'FEEDBACK', 'VOTING'].map(g => (
              <button 
                key={g} 
                onClick={() => setSelectedGoal(g as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedGoal === g 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 translate-y-[-1px]' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:shadow-sm'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredCampaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200">
          <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center text-slate-300 mb-4">
            <Plus size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No campaigns found</h3>
          <p className="text-sm text-slate-500 text-center max-w-sm">
            Launch your first initiative to start building.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map(campaign => (
            <CampaignCard 
              key={campaign.id} 
              campaign={campaign} 
              onSelect={(c) => selectCampaign(c.id)}
              onDelete={deleteCampaign}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-2">New Campaign</h3>
              <p className="text-sm text-slate-500 mb-8 font-medium">Define your mission and reach your target audience.</p>
              
              <form onSubmit={handleCreate} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Title</label>
                  <input 
                    required
                    type="text" 
                    className="input-geometric"
                    placeholder="e.g. Save the Local Park"
                    value={newCampaign.title}
                    onChange={e => setNewCampaign({...newCampaign, title: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                  <textarea 
                    required
                    rows={3}
                    className="input-geometric resize-none"
                    placeholder="What is your campaign about?"
                    value={newCampaign.description}
                    onChange={e => setNewCampaign({...newCampaign, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Goal</label>
                    <select 
                      className="input-geometric"
                      value={newCampaign.goal}
                      onChange={e => setNewCampaign({...newCampaign, goal: e.target.value as CampaignGoal})}
                    >
                      <option value="AWARENESS">Awareness</option>
                      <option value="FEEDBACK">Feedback</option>
                      <option value="VOTING">Voting</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tags</label>
                    <input 
                      type="text" 
                      className="input-geometric"
                      placeholder="nature, community"
                      value={newCampaign.tags}
                      onChange={e => setNewCampaign({...newCampaign, tags: e.target.value})}
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3 text-sm">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2 px-4 rounded-lg font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 btn-primary"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, trend, color }: { label: string, value: any, trend: string, color?: string }) => {
  const trendColors = {
    indigo: 'text-indigo-600',
    emerald: 'text-emerald-600',
    default: 'text-slate-500'
  } as any;

  return (
    <div className="stat-card">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className={`text-[11px] mt-1 font-medium ${trendColors[color || 'default']}`}>{trend}</div>
    </div>
  );
};
