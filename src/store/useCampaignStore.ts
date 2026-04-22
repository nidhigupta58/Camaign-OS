import { create } from 'zustand';
import { Campaign, Post, Poll, ActivityLog, Member, CampaignGoal, CampaignComment } from '../types';
import { storageService } from '../services/storage';
import { v4 as uuidv4 } from 'uuid';

interface CampaignStore {
  campaigns: Campaign[];
  posts: Post[];
  polls: Poll[];
  activityLogs: ActivityLog[];
  simulateActivity: boolean;
  selectedCampaignId: string | null;
  initialized: boolean;

  // Actions
  init: () => void;
  addCampaign: (title: string, description: string, tags: string[], goal: CampaignGoal) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  selectCampaign: (id: string | null) => void;

  addMember: (campaignId: string, name: string, role: Member['role']) => void;
  generateDummyMember: (campaignId: string) => void;

  addPost: (campaignId: string, authorId: string, authorName: string, content: string) => void;
  likePost: (postId: string, userId: string) => void;
  addComment: (postId: string, authorId: string, authorName: string, content: string, parentCommentId?: string) => void;

  addPoll: (campaignId: string, question: string, options: string[]) => void;
  votePoll: (pollId: string, optionId: string, userId: string) => void;

  setSimulateActivity: (value: boolean) => void;
  addActivityLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  syncCampaign: (campaignId: string) => Promise<void>;
  importCampaign: (data: string) => void;
}

export const useCampaignStore = create<CampaignStore>((set, get) => ({
  campaigns: [],
  posts: [],
  polls: [],
  activityLogs: [],
  simulateActivity: false,
  selectedCampaignId: null,
  initialized: false,

  init: () => {
    if (get().initialized) return;

    let campaigns = storageService.getCampaigns();
    let posts = storageService.getPosts();
    let polls = storageService.getPolls();
    let activityLogs = storageService.getActivityLogs();

    if (campaigns.length === 0) {
      // Generate 20 diverse campaigns
      const goals: CampaignGoal[] = ['AWARENESS', 'FEEDBACK', 'VOTING'];
      const themes = [
        { title: 'Clean Oceans', tags: ['env', 'ocean'] },
        { title: 'Urban Gardens', tags: ['city', 'nature'] },
        { title: 'Tech Literacy', tags: ['edu', 'tech'] },
        { title: 'Mental Health Awareness', tags: ['health', 'support'] },
        { title: 'Pet Adoption Drive', tags: ['animals', 'charity'] },
        { title: 'Local Library Bloom', tags: ['edu', 'culture'] },
        { title: 'Renewable Future', tags: ['energy', 'future'] },
        { title: 'Senior Connectivity', tags: ['social', 'care'] },
        { title: 'Youth Sports Fund', tags: ['sports', 'youth'] },
        { title: 'Sustainable Fashion', tags: ['style', 'eco'] }
      ];

      for (let i = 0; i < 20; i++) {
        const theme = themes[i % themes.length];
        const campaignId = uuidv4();
        const goal = goals[i % goals.length];
        
        const members: Member[] = Array.from({ length: 15 + Math.floor(Math.random() * 50) }).map((_, j) => ({
          id: `m-${campaignId}-${j}`,
          name: `Member ${j + 1}`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=member${campaignId}${j}`,
          role: j === 0 ? 'ADMIN' : 'MEMBER',
          joinedAt: new Date(Date.now() - Math.random() * 1000000000).toISOString()
        }));

        campaigns.push({
          id: campaignId,
          title: `${theme.title} ${Math.floor(i / themes.length) + 1}`,
          description: `Strategic initiative focused on ${theme.title.toLowerCase()} to drive community engagement and positive social impact through grassroots movements.`,
          tags: theme.tags,
          goal: goal,
          members,
          createdAt: new Date(Date.now() - 1000000000).toISOString(),
          updatedAt: new Date().toISOString()
        });

        // Add some posts
        for (let k = 0; k < 5; k++) {
          posts.push({
            id: uuidv4(),
            campaignId,
            authorId: members[0].id,
            authorName: members[0].name,
            content: `Hello Team! Update #${k + 1}: We are seeing great progress in our ${theme.title} goals. Keep up the good work!`,
            likes: members.slice(1, 1 + Math.floor(Math.random() * 10)).map(m => m.id),
            comments: [],
            createdAt: new Date(Date.now() - Math.random() * 500000000).toISOString()
          });
        }

        // Add a poll
        if (goal === 'VOTING' || goal === 'FEEDBACK') {
          polls.push({
            id: uuidv4(),
            campaignId,
            question: `What is our priority for ${theme.title}?`,
            options: [
              { id: uuidv4(), text: "Increase funding", votes: members.slice(1, 20).map(m => m.id) },
              { id: uuidv4(), text: "Recruit volunteers", votes: members.slice(20, 30).map(m => m.id) },
              { id: uuidv4(), text: "Social media reach", votes: [] }
            ],
            createdAt: new Date().toISOString(),
            isClosed: false
          });
        }
      }
      
      storageService.saveCampaigns(campaigns);
      storageService.savePosts(posts);
      storageService.savePolls(polls);
    }

    set({
      campaigns,
      posts,
      polls,
      activityLogs,
      simulateActivity: storageService.getSettings().simulateActivity,
      initialized: true
    });
  },

  addCampaign: (title, description, tags, goal) => {
    const newCampaign: Campaign = {
      id: uuidv4(),
      title,
      description,
      tags,
      goal,
      members: [
        {
          id: 'admin-1',
          name: 'Campaign Admin',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=admin`,
          role: 'ADMIN',
          joinedAt: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [...get().campaigns, newCampaign];
    set({ campaigns: updated });
    storageService.saveCampaigns(updated);
  },

  updateCampaign: (id, updates) => {
    const updated = get().campaigns.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c);
    set({ campaigns: updated });
    storageService.saveCampaigns(updated);
  },

  deleteCampaign: (id) => {
    const updated = get().campaigns.filter(c => c.id !== id);
    set({ campaigns: updated });
    storageService.saveCampaigns(updated);
    // Also cleanup posts/polls
    const updatedPosts = get().posts.filter(p => p.campaignId !== id);
    const updatedPolls = get().polls.filter(p => p.campaignId !== id);
    set({ posts: updatedPosts, polls: updatedPolls });
    storageService.savePosts(updatedPosts);
    storageService.savePolls(updatedPolls);
  },

  selectCampaign: (id) => set({ selectedCampaignId: id }),

  addMember: (campaignId, name, role) => {
    const campaigns = get().campaigns.map(c => {
      if (c.id === campaignId) {
        const newMember: Member = {
          id: uuidv4(),
          name,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
          role,
          joinedAt: new Date().toISOString()
        };
        return { ...c, members: [...c.members, newMember] };
      }
      return c;
    });
    set({ campaigns });
    storageService.saveCampaigns(campaigns);
  },

  generateDummyMember: (campaignId) => {
    const names = ['Alex', 'Jordan', 'Taylor', 'Casey', 'Riley', 'Morgan', 'Quinn', 'Skyler', 'Charlie', 'Peyton', 'Avery', 'Blake'];
    for (let i = 0; i < 5; i++) {
        const name = names[Math.floor(Math.random() * names.length)] + ' ' + (Math.floor(Math.random() * 899) + 100);
        get().addMember(campaignId, name, 'MEMBER');
    }
  },

  addPost: (campaignId, authorId, authorName, content) => {
    const newPost: Post = {
      id: uuidv4(),
      campaignId,
      authorId,
      authorName,
      content,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString()
    };
    const updated = [newPost, ...get().posts];
    set({ posts: updated });
    storageService.savePosts(updated);
  },

  likePost: (postId, userId) => {
    const updated = get().posts.map(p => {
      if (p.id === postId) {
        const likes = p.likes.includes(userId)
          ? p.likes.filter(id => id !== userId)
          : [...p.likes, userId];
        return { ...p, likes };
      }
      return p;
    });
    set({ posts: updated });
    storageService.savePosts(updated);
  },

  addComment: (postId, authorId, authorName, content, parentCommentId) => {
    const updated = get().posts.map(p => {
      if (p.id === postId) {
        const newComment: CampaignComment = {
          id: uuidv4(),
          authorId,
          authorName,
          content,
          createdAt: new Date().toISOString(),
          replies: []
        };
        
        if (parentCommentId) {
          const findAndAddReply = (comments: CampaignComment[]): CampaignComment[] => {
            return comments.map(c => {
              if (c.id === parentCommentId) {
                return { ...c, replies: [...c.replies, newComment] };
              }
              if (c.replies.length > 0) {
                return { ...c, replies: findAndAddReply(c.replies) };
              }
              return c;
            });
          };
          return { ...p, comments: findAndAddReply(p.comments) };
        } else {
          return { ...p, comments: [...p.comments, newComment] };
        }
      }
      return p;
    });
    set({ posts: updated });
    storageService.savePosts(updated);
  },

  addPoll: (campaignId, question, options) => {
    const newPoll: Poll = {
      id: uuidv4(),
      campaignId,
      question,
      options: options.map(text => ({ id: uuidv4(), text, votes: [] })),
      createdAt: new Date().toISOString(),
      isClosed: false
    };
    const updated = [newPoll, ...get().polls];
    set({ polls: updated });
    storageService.savePolls(updated);
  },

  votePoll: (pollId, optionId, userId) => {
    const updated = get().polls.map(p => {
      if (p.id === pollId) {
        const hasVoted = p.options.some(o => o.votes.includes(userId));
        if (hasVoted) return p; // Assume single vote for now
        return {
          ...p,
          options: p.options.map(o => o.id === optionId ? { ...o, votes: [...o.votes, userId] } : o)
        };
      }
      return p;
    });
    set({ polls: updated });
    storageService.savePolls(updated);
  },

  setSimulateActivity: (value) => {
    set({ simulateActivity: value });
    storageService.saveSettings({ simulateActivity: value });
  },

  addActivityLog: (log) => {
    const newLog: ActivityLog = {
      ...log,
      id: uuidv4(),
      timestamp: new Date().toISOString()
    };
    const updated = [newLog, ...get().activityLogs].slice(0, 100); // Keep last 100
    set({ activityLogs: updated });
    storageService.saveActivityLogs(updated);
  },

  syncCampaign: async (campaignId: string) => {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const campaigns = get().campaigns.map(c => 
      c.id === campaignId ? { ...c, updatedAt: new Date().toISOString() } : c
    );
    
    set({ campaigns });
    storageService.saveCampaigns(campaigns);
    
    get().addActivityLog({
      campaignId,
      userId: 'system-agent',
      userName: 'Network Intelligence',
      type: 'SYNC',
      details: 'Full node telemetry synchronization complete. Local state aligned with global ecosystem.'
    });
  },

  importCampaign: (data) => {
    try {
      const decoded = JSON.parse(atob(data));
      // Deduplicate by ID
      const existingIds = new Set(get().campaigns.map(c => c.id));
      if (existingIds.has(decoded.id)) {
        alert('Campaign with this ID already exists.');
        return;
      }
      const campaigns = [...get().campaigns, decoded];
      set({ campaigns });
      storageService.saveCampaigns(campaigns);
    } catch (e) {
      console.error('Failed to import campaign', e);
    }
  }
}));
