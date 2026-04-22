import { useEffect } from 'react';
import { useCampaignStore } from '../store/useCampaignStore';

export const useActivitySimulation = () => {
  const { 
    campaigns, 
    posts, 
    polls, 
    simulateActivity, 
    generateDummyMember, 
    likePost, 
    addComment, 
    votePoll,
    addActivityLog 
  } = useCampaignStore();

  useEffect(() => {
    if (!simulateActivity || campaigns.length === 0) return;

    const interval = setInterval(() => {
      const activeCampaign = campaigns[Math.floor(Math.random() * campaigns.length)];
      const dice = Math.random();

      if (dice < 0.2) {
        // Someone joins
        generateDummyMember(activeCampaign.id);
        addActivityLog({
          campaignId: activeCampaign.id,
          userId: 'system',
          userName: 'New Member',
          type: 'JOIN',
          details: 'A new member joined the campaign'
        });
      } else if (dice < 0.5 && posts.length > 0) {
        // Someone likes a post
        const campaignPosts = posts.filter(p => p.campaignId === activeCampaign.id);
        if (campaignPosts.length > 0) {
          const post = campaignPosts[Math.floor(Math.random() * campaignPosts.length)];
          const member = activeCampaign.members[Math.floor(Math.random() * activeCampaign.members.length)];
          likePost(post.id, member.id);
          addActivityLog({
            campaignId: activeCampaign.id,
            userId: member.id,
            userName: member.name,
            type: 'LIKE',
            details: `Liked post: ${post.content.substring(0, 20)}...`
          });
        }
      } else if (dice < 0.7 && posts.length > 0) {
        // Someone comments
        const campaignPosts = posts.filter(p => p.campaignId === activeCampaign.id);
        if (campaignPosts.length > 0) {
          const post = campaignPosts[Math.floor(Math.random() * campaignPosts.length)];
          const member = activeCampaign.members[Math.floor(Math.random() * activeCampaign.members.length)];
          const comments = ['Totally agree!', 'Great point!', 'Interesting...', 'Supporting this!', 'I have some questions about this.'];
          addComment(post.id, member.id, member.name, comments[Math.floor(Math.random() * comments.length)]);
          addActivityLog({
            campaignId: activeCampaign.id,
            userId: member.id,
            userName: member.name,
            type: 'COMMENT',
            details: `Commented on post`
          });
        }
      } else if (dice < 0.9 && polls.length > 0) {
        // Someone votes
        const campaignPolls = polls.filter(p => p.campaignId === activeCampaign.id && !p.isClosed);
        if (campaignPolls.length > 0) {
          const poll = campaignPolls[Math.floor(Math.random() * campaignPolls.length)];
          const option = poll.options[Math.floor(Math.random() * poll.options.length)];
          const member = activeCampaign.members[Math.floor(Math.random() * activeCampaign.members.length)];
          votePoll(poll.id, option.id, member.id);
          addActivityLog({
            campaignId: activeCampaign.id,
            userId: member.id,
            userName: member.name,
            type: 'VOTE',
            details: `Voted in poll: ${poll.question}`
          });
        }
      }
    }, 5000); // Activity every 5 seconds

    return () => clearInterval(interval);
  }, [simulateActivity, campaigns, posts, polls]);
};
