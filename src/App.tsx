/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */


import React, { useEffect, useState } from 'react';
import { Users, MessageSquare, BarChart3 } from 'lucide-react';
import { useCampaignStore } from './store/useCampaignStore';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { CampaignDetail } from './pages/CampaignDetail';
import { Settings, Exporter } from './pages/Settings';
import { GlobalCommunity } from './pages/GlobalCommunity';
import { GlobalDiscussions } from './pages/GlobalDiscussions';
import { GlobalAnalytics } from './pages/GlobalAnalytics';
import { useActivitySimulation } from './hooks/useActivitySimulation';

export default function App() {
  const { init, selectedCampaignId, campaigns } = useCampaignStore();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Load initial data
  useEffect(() => {
    init();
  }, [init]);

  // Run activity simulation engine
  useActivitySimulation();

  return (
    <div className="flex bg-slate-50 h-screen overflow-hidden text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Sidebar activeTab={selectedCampaignId ? 'campaign' : activeTab} setActiveTab={(tab) => {
        useCampaignStore.getState().selectCampaign(null);
        setActiveTab(tab);
      }} />
      
      <main className="flex-1 overflow-y-auto h-full">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          {selectedCampaignId ? (
            <CampaignDetail campaignId={selectedCampaignId} />
          ) : (
            <>
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'community' && <GlobalCommunity />}
              {activeTab === 'discussions' && <GlobalDiscussions />}
              {activeTab === 'analytics' && <GlobalAnalytics />}
              {activeTab === 'exporter' && <Exporter />}
              {activeTab === 'settings' && <Settings />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

