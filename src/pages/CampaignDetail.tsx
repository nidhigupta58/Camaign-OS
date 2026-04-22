import React, { useState } from 'react';
import { useCampaignStore } from '../store/useCampaignStore';
import { 
  MessageSquare, Users, BarChart3, PieChart, Plus, ArrowLeft, 
  MoreHorizontal, ThumbsUp, MessageCircle, Send, PlusCircle, 
  CheckCircle2, Share2, Trash2, Activity, Settings 
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Campaign, Post, CampaignComment, Poll } from '../types';

interface CampaignDetailProps {
  campaignId: string;
}

export const CampaignDetail = ({ campaignId }: CampaignDetailProps) => {
  const { 
    campaigns, posts, polls, selectCampaign, addPost, 
    likePost, addComment, addPoll, votePoll, 
    generateDummyMember, deleteCampaign, syncCampaign 
  } = useCampaignStore();
  const campaign = campaigns.find(c => c.id === campaignId);
  const campaignPosts = posts.filter(p => p.campaignId === campaignId);
  const campaignPolls = polls.filter(p => p.campaignId === campaignId);

  const [activeTab, setActiveTab] = useState<'feed' | 'community' | 'analytics' | 'polls'>('feed');
  const [newPostContent, setNewPostContent] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  if (!campaign) return <div>Campaign not found</div>;

  // Dynamic dummy data for charts based on campaign properties
  const activityData = [
    { name: 'Mon', count: 12 + (campaign.members.length % 10) },
    { name: 'Tue', count: 19 + (campaign.members.length % 7) },
    { name: 'Wed', count: 15 + (campaign.members.length % 5) },
    { name: 'Thu', count: 22 + (campaign.members.length % 3) },
    { name: 'Fri', count: 30 + (campaign.members.length % 12) },
    { name: 'Sat', count: 25 + (campaign.members.length % 8) },
    { name: 'Sun', count: 28 + (campaign.members.length % 15) },
  ];

  const handleShare = () => {
    try {
      const json = JSON.stringify(campaign);
      const encoded = btoa(unescape(encodeURIComponent(json)));
      
      // Auto-adaptable sharing: uses the current domain (location.origin)
      const shareUrl = `${window.location.origin}?import=${encoded}`;
      
      navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      toast.success('Campaign share link copied to clipboard!', {
        description: 'You can now share this URL with your collaborators.'
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy share link');
      console.error(error);
    }
  };

  const handleSyncNode = async () => {
    setShowOptions(false);
    const toastId = toast.loading('Synchronizing node telemetry...', {
      description: 'Realigning local campaign state with global ecosystem metadata.'
    });
    
    try {
      await syncCampaign(campaignId);
      toast.success('Node synchronization complete', {
        id: toastId,
        description: `${campaign.title} is now fully optimized and up-to-date.`
      });
    } catch (error) {
      toast.error('Synchronization failed', {
        id: toastId,
        description: 'The campaign node could not reach the global coordination layer.'
      });
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 px-6 -mx-6 bg-white border-b border-slate-200 -mt-8 mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => selectCampaign(null)}
            className="p-2 -ml-2 text-slate-400 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="text-sm text-slate-500">
            Campaigns / <span className="text-slate-900 font-medium">{campaign.title}</span>
          </div>
        </div>
        <div className="flex gap-2 relative">
          <button 
            onClick={handleShare} 
            className={`p-2 rounded-lg transition-all ${isCopied ? 'text-emerald-500 bg-emerald-50' : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-50'}`} 
            title="Copy share link"
          >
            {isCopied ? <CheckCircle2 size={18} /> : <Share2 size={18} />}
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowOptions(!showOptions)} 
              className={`p-2 rounded-lg transition-all ${showOptions ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-50'}`}
            >
              <MoreHorizontal size={18} />
            </button>
            {showOptions && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in zoom-in-95 duration-200">
                <button 
                  onClick={handleSyncNode}
                  className="w-full px-4 py-3 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                >
                  <Activity size={14} className="text-emerald-500" />
                  Sync Node Data
                </button>
                <button 
                  onClick={() => { alert('Campaign export started...'); setShowOptions(false); }}
                  className="w-full px-4 py-3 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                >
                  <Share2 size={14} className="text-indigo-500" />
                  Export Metadata
                </button>
                <div className="h-[1px] bg-slate-100" />
                <button 
                  onClick={() => {
                    if (window.confirm('Delete campaign? This cannot be undone.')) {
                      deleteCampaign(campaignId);
                      selectCampaign(null);
                    }
                    setShowOptions(false);
                  }}
                  className="w-full px-4 py-3 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-3 transition-colors"
                >
                  <Trash2 size={14} />
                  Purge Campaign
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{campaign.title}</h2>
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-[10px] font-bold uppercase tracking-widest border border-indigo-100">
                {campaign.goal}
              </span>
            </div>
            <p className="text-base text-slate-500 font-medium max-w-2xl leading-relaxed">{campaign.description}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => {
              const el = document.getElementById('post-textarea');
              el?.focus();
            }} className="btn-primary flex items-center gap-2">
              <Plus size={16} />
              New Update
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <TabButton active={activeTab === 'feed'} onClick={() => setActiveTab('feed')} label="Live Feed" />
        <TabButton active={activeTab === 'community'} onClick={() => setActiveTab('community')} label="Community" />
        <TabButton active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} label="Analytics" />
        <TabButton active={activeTab === 'polls'} onClick={() => setActiveTab('polls')} label="Feedback" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          {activeTab === 'feed' && (
            <div className="space-y-6">
              {/* Write Post */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex gap-4">
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" 
                    className="w-12 h-12 rounded-xl bg-slate-100 p-1"
                    alt="admin" 
                  />
                  <div className="flex-1 space-y-4">
                    <textarea 
                      id="post-textarea"
                      placeholder="Share an update with your community..."
                      className="w-full bg-slate-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium min-h-[120px] resize-none"
                      value={newPostContent}
                      onChange={e => setNewPostContent(e.target.value)}
                    />
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                          <PlusCircle size={20} />
                        </button>
                      </div>
                      <button 
                        onClick={() => {
                          if (!newPostContent.trim()) return;
                          addPost(campaignId, 'admin-1', 'Campaign Admin', newPostContent);
                          setNewPostContent('');
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl transition-all shadow-lg shadow-blue-200"
                      >
                        Publish
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feed */}
              <div className="space-y-4">
                {campaignPosts.map(post => (
                  <PostItem key={post.id} post={post} onLike={likePost} onComment={addComment} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'community' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200">
                <div>
                   <h3 className="text-xl font-bold text-slate-900">Community Directory</h3>
                   <p className="text-sm text-slate-500 font-medium tracking-tight">Managing {campaign.members.length} contributors in this initiative.</p>
                </div>
                <button 
                  onClick={() => generateDummyMember(campaignId)}
                  className="btn-primary flex items-center gap-2 text-xs"
                >
                  <Plus size={16} />
                  Rapid Onboard
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {campaign.members.map(member => (
                   <div key={member.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3 group hover:border-indigo-300 transition-colors">
                      <img src={member.avatar} className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100" alt={member.name} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                           <p className="font-bold text-xs text-slate-900 truncate">{member.name}</p>
                           {member.role === 'ADMIN' && <CheckCircle2 size={10} className="text-indigo-500" />}
                        </div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">
                          Role: <span className="text-slate-500">{member.role}</span>
                        </p>
                      </div>
                      <button 
                        onClick={() => alert(`Reviewing activity for ${member.name}...`)}
                        className="p-1.5 text-slate-300 hover:text-indigo-600 transition-colors"
                      >
                        <ArrowLeft size={14} className="rotate-180" />
                      </button>
                   </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div onClick={() => alert('Viewing detailed engagement breakdown...')} className="cursor-pointer">
                  <MiniStat label="Engagement Rate" value={`${(10 + (campaign.members.length / 50)).toFixed(1)}%`} trend="+2.4%" />
                </div>
                <div onClick={() => alert('Analyzing member retention trends...')} className="cursor-pointer">
                  <MiniStat label="Retention" value={`${(85 + (campaign.members.length / 100)).toFixed(0)}%`} trend="+0.5%" />
                </div>
                <div onClick={() => alert('Calculating virality coefficients...')} className="cursor-pointer">
                  <MiniStat label="Viral K-Factor" value={(1.0 + (campaign.members.length / 1000)).toFixed(2)} trend="-0.1%" />
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Engagement Activity (Last 7 Days)</h4>
                  <div className="flex gap-2">
                    <button onClick={() => alert('Downloading CSV report...')} className="text-[10px] font-bold text-indigo-600 hover:underline uppercase tracking-wider">Export CSV</button>
                  </div>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%" minHeight={100} minWidth={0}>
                    <BarChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10}} dy={10} />
                      <Tooltip 
                        contentStyle={{borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '12px', fontWeight: 'bold'}} 
                        cursor={{fill: '#F1F5F9'}}
                      />
                      <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Growth Trajectory</h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%" minHeight={100} minWidth={0}>
                    <LineChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10}} dy={10} />
                      <Tooltip contentStyle={{borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '12px', fontWeight: 'bold'}} />
                      <Line type="monotone" dataKey="count" stroke="#4F46E5" strokeWidth={3} dot={{r: 4, fill: '#4F46E5', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'polls' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-900">Polls & Feedback</h3>
                <button 
                  onClick={() => addPoll(campaignId, "What should our next goal be?", ["Environment Cleanup", "Education Workshop", "Health Fair"])}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
                >
                  <Plus size={18} />
                  New Poll
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {campaignPolls.map(poll => (
                  <PollItem key={poll.id} poll={poll} onVote={(optionId) => votePoll(poll.id, optionId, 'admin-1')} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <button 
            onClick={() => alert('Viewing detailed goal milestones...')}
            className="w-full text-left bg-slate-900 text-white rounded-xl p-8 shadow-2xl hover:bg-slate-800 transition-all group"
          >
             <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Goal Progress</h4>
                <Plus size={14} className="text-slate-500 group-hover:text-white transition-colors" />
             </div>
            <div className="flex items-end gap-2 mb-6">
              <span className="text-5xl font-bold">{Math.min(100, Math.floor((campaign.members.length / 500) * 100))}%</span>
              <span className="text-slate-400 font-bold mb-2">of 500</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-6">
              <div 
                className="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
                style={{ width: `${Math.min(100, (campaign.members.length / 500) * 100)}%` }} 
              />
            </div>
            <p className="text-slate-400 text-xs font-medium leading-relaxed">
              Target reached: <span className="text-white">{campaign.members.length} members</span>. Reaching 500 unlocks premium simulation features.
            </p>
          </button>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
               <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recent Activity</h4>
               <button onClick={() => alert('Viewing all activity logs...')} className="text-[10px] font-bold text-indigo-600 hover:underline">VIEW ALL</button>
            </div>
            <div className="space-y-4">
              {campaign.members.slice(-5).reverse().map(member => (
                <div key={member.id} className="flex items-center gap-3">
                  <img src={member.avatar} className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100" alt={member.name} />
                  <p className="text-xs font-medium text-slate-700">
                    <span className="font-bold text-slate-900">{member.name}</span> joined.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, label }: any) => (
  <button 
    onClick={onClick}
    className={`px-4 py-3 text-sm font-bold transition-all border-b-2 -mb-[2px] ${
      active 
        ? 'border-indigo-600 text-slate-900' 
        : 'border-transparent text-slate-400 hover:text-slate-600'
    }`}
  >
    {label}
  </button>
);

const PostItem = ({ post, onLike, onComment }: any) => {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="p-6">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
            {post.authorName.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <span className="text-sm font-bold text-slate-900">{post.authorName}</span>
              <span className="text-xs text-slate-400 font-medium">{format(new Date(post.createdAt), 'h:mm a')}</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-medium mb-4 whitespace-pre-wrap">{post.content}</p>
            
            <div className="flex items-center gap-6 pt-4 border-t border-slate-50">
              <button 
                onClick={() => onLike(post.id, 'admin-1')}
                className={`flex items-center gap-2 text-xs font-bold transition-colors ${
                  post.likes.includes('admin-1') ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'
                }`}
              >
                <ThumbsUp size={14} />
                {post.likes.length}
              </button>
              <button 
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
              >
                <MessageCircle size={14} />
                {post.comments.length}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showComments && (
        <div className="bg-slate-50 p-6 border-t border-slate-100 space-y-4">
          <div className="space-y-4">
            {post.comments.map((comment: any) => (
              <div key={comment.id} className="feed-line">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-200 text-[8px] flex items-center justify-center font-bold text-slate-500">
                    {comment.authorName[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-bold text-slate-900 leading-none mb-1">{comment.authorName}</p>
                    <p className="text-xs text-slate-700 font-medium">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Type your response..." 
              className="input-geometric py-1.5"
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && commentText.trim()) {
                   onComment(post.id, 'admin-1', 'Campaign Admin', commentText);
                   setCommentText('');
                }
              }}
            />
            <button 
              onClick={() => {
                if (!commentText.trim()) return;
                onComment(post.id, 'admin-1', 'Campaign Admin', commentText);
                setCommentText('');
              }}
              className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const PollItem = ({ poll, onVote }: any) => {
  const totalVotes = poll.options.reduce((acc: number, o: any) => acc + o.votes.length, 0);
  const userOptionId = poll.options.find((o: any) => o.votes.includes('admin-1'))?.id;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
      <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">{poll.question}</h4>
      <div className="space-y-4">
        {poll.options.map((option: any) => {
          const percentage = totalVotes === 0 ? 0 : Math.round((option.votes.length / totalVotes) * 100);
          const isSelected = userOptionId === option.id;

          return (
            <div key={option.id} className="space-y-2">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-700 uppercase tracking-tight">{option.text}</span>
                <span className="text-indigo-600">{percentage}%</span>
              </div>
              <button 
                disabled={!!userOptionId}
                onClick={() => onVote(option.id)}
                className="w-full chart-bar-bg group"
              >
                <div 
                  className={`chart-bar-fill ${isSelected ? '' : 'opacity-50'}`}
                  style={{ width: `${percentage}%` }}
                />
              </button>
            </div>
          );
        })}
      </div>
      {!userOptionId && (
        <button className="w-full mt-6 py-2 text-[10px] font-bold text-indigo-600 bg-indigo-50 rounded-lg uppercase tracking-widest">
          Cast your vote
        </button>
      )}
    </div>
  );
};

const MiniStat = ({ label, value, trend }: any) => (
  <div className="stat-card">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <div className="flex items-end gap-2 text-2xl font-bold">
      <p className="text-slate-900">{value}</p>
      <span className={`text-[11px] font-bold mb-1 ${trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
        {trend}
      </span>
    </div>
  </div>

);
