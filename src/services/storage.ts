import { Campaign, Post, Poll, ActivityLog } from '../types';

const CAMPAIGNS_KEY = 'campaign_os_campaigns';
const POSTS_KEY = 'campaign_os_posts';
const POLLS_KEY = 'campaign_os_polls';
const ACTIVITY_KEY = 'campaign_os_activity';
const SETTINGS_KEY = 'campaign_os_settings';

export const storageService = {
  getCampaigns: (): Campaign[] => {
    const data = localStorage.getItem(CAMPAIGNS_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveCampaigns: (campaigns: Campaign[]) => {
    localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
  },
  
  getPosts: (): Post[] => {
    const data = localStorage.getItem(POSTS_KEY);
    return data ? JSON.parse(data) : [];
  },
  savePosts: (posts: Post[]) => {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  },

  getPolls: (): Poll[] => {
    const data = localStorage.getItem(POLLS_KEY);
    return data ? JSON.parse(data) : [];
  },
  savePolls: (polls: Poll[]) => {
    localStorage.setItem(POLLS_KEY, JSON.stringify(polls));
  },

  getActivityLogs: (): ActivityLog[] => {
    const data = localStorage.getItem(ACTIVITY_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveActivityLogs: (logs: ActivityLog[]) => {
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(logs));
  },

  getSettings: () => {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : { simulateActivity: false };
  },
  saveSettings: (settings: any) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }
};
