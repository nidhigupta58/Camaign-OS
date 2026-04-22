/**
 * Campaign OS Types
 */

export type Role = 'ADMIN' | 'MEMBER';
export type CampaignGoal = 'AWARENESS' | 'FEEDBACK' | 'VOTING';

export interface Member {
  id: string;
  name: string;
  avatar: string;
  role: Role;
  joinedAt: string;
}

export interface CampaignComment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  replies: CampaignComment[];
}

export interface Post {
  id: string;
  campaignId: string;
  authorId: string;
  authorName: string;
  content: string;
  likes: string[]; // Array of member IDs who liked
  comments: CampaignComment[];
  createdAt: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: string[]; // Array of member IDs who voted
}

export interface Poll {
  id: string;
  campaignId: string;
  question: string;
  options: PollOption[];
  createdAt: string;
  isClosed: boolean;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  tags: string[];
  goal: CampaignGoal;
  members: Member[];
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  campaignId: string;
  userId: string;
  userName: string;
  type: 'JOIN' | 'POST' | 'LIKE' | 'COMMENT' | 'VOTE' | 'SYNC';
  details: string;
  timestamp: string;
}
