import React, { useState } from 'react';
import { useCampaignStore } from '../store/useCampaignStore';
import { Zap, Shield, HelpCircle, HardDrive, Share2, Clipboard, Download, Upload } from 'lucide-react';

export const Settings = () => {
  const { simulateActivity, setSimulateActivity, campaigns } = useCampaignStore();

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h2>
        <p className="text-slate-500 font-medium">Configure your local environment and simulation parameters.</p>
      </div>

      <div className="space-y-6">
        <SettingSection title="Simulation Engine" icon={Zap}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900">Activity Simulation</p>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Automatically generate likes, comments, and members to test UI states.
              </p>
            </div>
            <button 
              onClick={() => setSimulateActivity(!simulateActivity)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                simulateActivity ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            >
              <span 
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  simulateActivity ? 'translate-x-6' : 'translate-x-1'
                }`} 
              />
            </button>
          </div>
        </SettingSection>

        <SettingSection title="Persistence" icon={HardDrive}>
          <div className="space-y-4">
             <div className="flex justify-between items-center">
                <div>
                   <p className="font-bold text-slate-900">Clear Data</p>
                   <p className="text-sm text-slate-500 font-medium">Permanently delete all locally stored campaigns and activity logs.</p>
                </div>
                <button 
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete ALL data? This cannot be undone.')) {
                       localStorage.clear();
                       window.location.reload();
                    }
                  }}
                  className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-100 transition-colors"
                >
                  Clear Storage
                </button>
             </div>
          </div>
        </SettingSection>

        <SettingSection title="Privacy & Security" icon={Shield}>
           <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-start gap-3">
                 <HelpCircle size={20} className="text-blue-600 mt-0.5" />
                 <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    Campaign OS runs entirely in your browser. All your campaign data, members, and discussions are stored in your browser's <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200">localStorage</code>. No analytics or identifying data is sent to any server.
                 </p>
              </div>
           </div>
        </SettingSection>
      </div>
    </div>
  );
};

export const Exporter = () => {
  const { campaigns, importCampaign } = useCampaignStore();
  const [importData, setImportData] = useState('');
  const [exportData, setExportData] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const handleExport = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign) return;
    const data = btoa(JSON.stringify(campaign));
    setExportData(data);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(exportData);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Data Portability</h2>
        <p className="text-slate-500 font-medium">Share your campaigns via JSON bridge.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Download className="text-blue-600" size={24} />
            <h3 className="text-xl font-bold text-slate-900">Export Campaign</h3>
          </div>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            Select a campaign to generate a shareable base64 string.
          </p>
          
          <select 
             className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold"
             onChange={(e) => handleExport(e.target.value)}
             defaultValue=""
          >
             <option value="" disabled>Select campaign...</option>
             {campaigns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>

          {exportData && (
            <div className="space-y-4">
               <div className="relative">
                  <textarea 
                    readOnly
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-mono h-32 resize-none"
                    value={exportData}
                  />
                  <button 
                    onClick={handleCopy}
                    className="absolute bottom-4 right-4 p-2 bg-blue-600 text-white rounded-lg shadow-lg"
                  >
                    <Clipboard size={18} />
                  </button>
               </div>
               {copySuccess && <p className="text-center text-xs font-bold text-emerald-600">Copied to clipboard!</p>}
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Upload className="text-indigo-600" size={24} />
            <h3 className="text-xl font-bold text-slate-900">Import Campaign</h3>
          </div>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            Paste a campaign bridge string to import it into your console.
          </p>

          <textarea 
             placeholder="Paste base64 string here..."
             className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-mono h-32 resize-none focus:ring-2 focus:ring-indigo-500"
             value={importData}
             onChange={(e) => setImportData(e.target.value)}
          />

          <button 
            disabled={!importData}
            onClick={() => {
              importCampaign(importData);
              setImportData('');
              alert('Campaign imported successfully!');
            }}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-200"
          >
            Bridge Import
          </button>
        </div>
      </div>
    </div>
  );
};

const SettingSection = ({ title, icon: Icon, children }: any) => (
  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
    <div className="flex items-center gap-3 mb-6">
      <Icon className="text-blue-600" size={24} />
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
    </div>
    {children}
  </div>
);
