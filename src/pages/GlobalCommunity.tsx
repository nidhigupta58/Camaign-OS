import React, { useState } from 'react';
import { useCampaignStore } from '../store/useCampaignStore';
import { Search, UserPlus, Shield, User } from 'lucide-react';

export const GlobalCommunity = () => {
  const { campaigns } = useCampaignStore();
  const [searchTerm, setSearchTerm] = useState('');

  const allMembers = campaigns.flatMap(c => 
    c.members.map(m => ({ ...m, campaignTitle: c.title, campaignId: c.id }))
  );

  const filteredMembers = allMembers.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.campaignTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group by campaign for a better view or just a big list
  const totalUniqueMembers = new Set(allMembers.map(m => m.id)).size;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="py-4">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Global Directory</h2>
        <p className="text-slate-500 font-medium mt-1">Unified view of {allMembers.length} participants across {campaigns.length} active initiatives.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat-card">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Members</p>
          <div className="text-2xl font-bold text-slate-900">{allMembers.length}</div>
        </div>
        <div className="stat-card">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Unique Users</p>
          <div className="text-2xl font-bold text-slate-900">{totalUniqueMembers}</div>
        </div>
        <div className="stat-card">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Avg. Retention</p>
          <div className="text-2xl font-bold text-indigo-600">92.4%</div>
        </div>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search members by name or campaign initiative..."
          className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm font-medium focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all placeholder:text-slate-400 shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Member</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Campaign</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.slice(0, 50).map((member, i) => (
                <tr key={`${member.id}-${i}`} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={member.avatar} className="w-8 h-8 rounded-lg bg-slate-100" alt="" />
                      <span className="text-sm font-bold text-slate-900">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{member.campaignTitle}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {member.role === 'ADMIN' ? (
                        <Shield size={12} className="text-indigo-500" />
                      ) : (
                        <User size={12} className="text-slate-400" />
                      )}
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${member.role === 'ADMIN' ? 'text-indigo-600' : 'text-slate-500'}`}>
                        {member.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-400">
                      {new Date(member.joinedAt).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredMembers.length > 50 && (
            <div className="p-4 text-center border-t border-slate-100 text-xs text-slate-400 font-medium">
              Showing first 50 results. Refine search to see more.
            </div>
          )}
          {filteredMembers.length === 0 && (
            <div className="p-20 text-center text-slate-400 font-medium">
              No members found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
