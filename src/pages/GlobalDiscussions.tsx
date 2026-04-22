import React, { useState } from 'react';
import { useCampaignStore } from '../store/useCampaignStore';
import { MessageSquare, ThumbsUp, MessageCircle, Send, TrendingUp, Sparkles, Search } from 'lucide-react';
import { format } from 'date-fns';

export const GlobalDiscussions = () => {
  const { posts, campaigns, likePost } = useCampaignStore();
  const [searchTerm, setSearchTerm] = useState('');

  const hydratedPosts = posts.map(p => {
    const campaign = campaigns.find(c => c.id === p.campaignId);
    return { ...p, campaignTitle: campaign?.title || 'Unknown Campaign' };
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filteredPosts = hydratedPosts.filter(p => 
    p.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.campaignTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="py-4">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Ecosystem Intelligence</h2>
        <p className="text-slate-500 font-medium mt-1">Aggregated data stream from {posts.length} discussions across all campaign nodes.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search conversations, keywords, or campaigns..."
              className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm font-medium focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all placeholder:text-slate-400 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            {filteredPosts.slice(0, 20).map(post => (
              <div key={post.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:border-indigo-200 transition-all">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                       <div className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 uppercase tracking-tight">
                         {post.campaignTitle}
                       </div>
                       <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                         {format(new Date(post.createdAt), 'MMM d, h:mm a')}
                       </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-xs flex-shrink-0">
                      {post.authorName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 mb-1">{post.authorName}</p>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium line-clamp-3">
                        {post.content}
                      </p>
                      
                      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-50">
                        <button 
                          onClick={() => likePost(post.id, 'admin-1')}
                          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                          <ThumbsUp size={14} />
                          {post.likes.length}
                        </button>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                          <MessageCircle size={14} />
                          {post.comments.length}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredPosts.length === 0 && (
              <div className="py-20 text-center bg-white rounded-xl border border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">No discussions match your filter.</p>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-80 space-y-6">
          <div className="bg-slate-900 text-white rounded-xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-indigo-400" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-400">Viral Signals</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Environment', count: 142, trend: '+12%' },
                { label: 'Community Fund', count: 89, trend: '+24%' },
                { label: 'Education', count: 64, trend: '+5%' }
              ].map(topic => (
                <div key={topic.label} className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-300">{topic.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black">{topic.count}</span>
                    <span className="text-[10px] text-emerald-400">{topic.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900">Campaign Sentiment</h3>
            </div>
            <div className="space-y-4">
               <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1 uppercase">Positive</div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[78%] rounded-full" />
                  </div>
               </div>
               <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1 uppercase">Neutral</div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-300 w-[15%] rounded-full" />
                  </div>
               </div>
               <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1 uppercase">Critical</div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 w-[7%] rounded-full" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
