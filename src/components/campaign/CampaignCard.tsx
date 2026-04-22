import React from 'react';
import { Calendar, Users, Target, MoreVertical, ExternalLink, Trash2 } from 'lucide-react';
import { Campaign } from '../../types';
import { format } from 'date-fns';

interface CampaignCardProps {
  key?: React.Key;
  campaign: Campaign;
  onSelect: (campaign: Campaign) => void;
  onDelete: (id: string) => void;
}

export const CampaignCard = ({ campaign, onSelect, onDelete }: CampaignCardProps) => {
  const goalColors = {
    AWARENESS: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    FEEDBACK: 'bg-slate-100 text-slate-700 border-slate-200',
    VOTING: 'bg-emerald-50 text-emerald-700 border-emerald-100'
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 hover:border-indigo-300 hover:shadow-lg transition-all group flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest border ${goalColors[campaign.goal]}`}>
          {campaign.goal}
        </span>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(campaign.id); }}
          className="p-1 px-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="flex-1">
        <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-2">
          {campaign.title}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4">
          {campaign.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {Array.from(new Set(campaign.tags)).map(tag => (
            <span key={tag} className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
              {tag.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-slate-700">
            <Users size={14} className="text-slate-400" />
            <span className="text-xs font-bold">{campaign.members.length.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Calendar size={14} />
            <span className="text-[11px] font-medium">{format(new Date(campaign.createdAt), 'MMM d, yyyy')}</span>
          </div>
        </div>
        
        <button 
          onClick={() => onSelect(campaign)}
          className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 group/btn"
        >
          Manage
          <ExternalLink size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
