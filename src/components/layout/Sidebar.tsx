import React from 'react';
import { LayoutDashboard, Users, MessageSquare, BarChart3, Settings, PlusCircle, Share2, Info } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useCampaignStore } from '../../store/useCampaignStore';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const SidebarItem = ({ icon: Icon, label, active, onClick }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 mx-1",
      active 
        ? "bg-slate-800 text-white" 
        : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
    )}
  >
    <Icon size={18} className={active ? "text-indigo-400" : "text-slate-500"} />
    <span className="font-medium text-sm">{label}</span>
  </button>
);

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const { simulateActivity, setSimulateActivity } = useCampaignStore();

  return (
    <div className="w-64 bg-slate-950 h-screen flex flex-col p-4">
      <div className="flex items-center gap-3 px-4 py-6 mb-6">
        <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center text-white font-bold">
          C
        </div>
        <h1 className="font-bold text-xl tracking-tight text-white leading-none">
          Campaign <span className="text-indigo-500">OS</span>
        </h1>
      </div>

      <nav className="flex-1 space-y-0.5">
        <SidebarItem 
          icon={LayoutDashboard} 
          label="Dashboard" 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')} 
        />
        <SidebarItem 
          icon={Users} 
          label="Global Community" 
          active={activeTab === 'community'} 
          onClick={() => setActiveTab('community')} 
        />
        <SidebarItem 
          icon={MessageSquare} 
          label="Global Feed" 
          active={activeTab === 'discussions'} 
          onClick={() => setActiveTab('discussions')} 
        />
        <SidebarItem 
          icon={BarChart3} 
          label="Global Analytics" 
          active={activeTab === 'analytics'} 
          onClick={() => setActiveTab('analytics')} 
        />
        <SidebarItem 
          icon={Share2} 
          label="Exporter" 
          active={activeTab === 'exporter'} 
          onClick={() => setActiveTab('exporter')} 
        />
      </nav>

      <div className="p-4 mt-auto">
        <button 
          onClick={() => setSimulateActivity(!simulateActivity)}
          className="w-full p-4 bg-slate-900 rounded-xl border border-slate-800 text-left transition-all hover:bg-slate-800 group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Simulation</span>
            <div className={simulateActivity ? "badge-live" : "bg-slate-700 w-2 h-2 rounded-full"} />
          </div>
          <p className="text-[10px] text-slate-400 font-medium leading-relaxed mb-3">
            Status: <span className={simulateActivity ? "text-indigo-400" : "text-rose-400"}>
              {simulateActivity ? 'Enabled' : 'Disabled'}
            </span>
          </p>
          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-1000 rounded-full",
                simulateActivity ? "bg-indigo-500 w-2/3" : "bg-slate-700 w-0"
              )} 
            />
          </div>
        </button>
      </div>
    </div>
  );
};
