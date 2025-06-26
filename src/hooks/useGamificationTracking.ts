
import { useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useGamification } from './useGamification';

// Tracking hook for automatic XP and achievement awards
export const useGamificationTracking = () => {
  const { user } = useAuth();
  const { awardXP, unlockAchievement } = useGamification();

  // Track welcome XP (first time user visits)
  const trackWelcomeXP = useCallback(() => {
    if (!user?.id) return;
    
    // Check if user has received welcome XP before
    const hasReceivedWelcome = localStorage.getItem(`welcome_xp_${user.id}`);
    
    if (!hasReceivedWelcome) {
      awardXP(50, 'welcome', undefined, { 
        message: 'Welcome to Cardshow!' 
      });
      localStorage.setItem(`welcome_xp_${user.id}`, 'true');
    }
  }, [user?.id, awardXP]);

  // Track card creation
  const trackCardCreation = useCallback((cardId: string, cardTitle: string) => {
    if (!user?.id) return;
    
    // XP is already awarded by database trigger
    // This is for additional client-side tracking if needed
    console.log('Card created:', { cardId, cardTitle, userId: user.id });
  }, [user?.id]);

  // Track template browsing
  const trackTemplateBrowsing = useCallback(() => {
    if (!user?.id) return;
    
    // Track template browsing for challenges
    const todayKey = `template_browsing_${new Date().toDateString()}_${user.id}`;
    const currentCount = parseInt(localStorage.getItem(todayKey) || '0');
    const newCount = currentCount + 1;
    
    localStorage.setItem(todayKey, newCount.toString());
    
    // Award small XP for browsing templates
    if (newCount <= 10) { // Limit to prevent spam
      awardXP(2, 'template_browsing', undefined, { 
        count: newCount,
        date: new Date().toDateString()
      });
    }
  }, [user?.id, awardXP]);

  // Track marketplace activity
  const trackMarketplaceActivity = useCallback((activity: string, metadata: Record<string, any> = {}) => {
    if (!user?.id) return;
    
    const xpRewards: Record<string, number> = {
      'listing_created': 25,
      'purchase_made': 50,
      'sale_completed': 100,
      'auction_bid': 10
    };
    
    const points = xpRewards[activity] || 5;
    awardXP(points, `marketplace_${activity}`, undefined, metadata);
  }, [user?.id, awardXP]);

  // Track social interactions
  const trackSocialInteraction = useCallback((interaction: string, targetId?: string) => {
    if (!user?.id) return;
    
    const xpRewards: Record<string, number> = {
      'follow_creator': 5,
      'like_card': 2,
      'share_card': 10,
      'comment_posted': 15
    };
    
    const points = xpRewards[interaction] || 1;
    awardXP(points, `social_${interaction}`, targetId, { 
      interaction_type: interaction 
    });
  }, [user?.id, awardXP]);

  // Track milestone achievements
  const trackMilestone = useCallback((milestone: string, value: number, metadata: Record<string, any> = {}) => {
    if (!user?.id) return;
    
    const milestones: Record<string, { threshold: number; achievement: string; points: number; description: string }> = {
      'cards_created': {
        threshold: 10,
        achievement: 'Prolific Creator',
        points: 200,
        description: 'Created 10 cards'
      },
      'cards_sold': {
        threshold: 5,
        achievement: 'Successful Seller',
        points: 300,
        description: 'Sold 5 cards'
      },
      'followers_gained': {
        threshold: 50,
        achievement: 'Community Builder',
        points: 250,
        description: 'Gained 50 followers'
      }
    };
    
    const config = milestones[milestone];
    if (config && value >= config.threshold) {
      unlockAchievement(
        milestone,
        config.achievement,
        config.description,
        config.points,
        { ...metadata, milestone_value: value }
      );
    }
  }, [user?.id, unlockAchievement]);

  // Initialize welcome tracking when user logs in
  useEffect(() => {
    if (user?.id) {
      // Delay to ensure user is fully loaded
      const timer = setTimeout(() => {
        trackWelcomeXP();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [user?.id, trackWelcomeXP]);

  return {
    trackCardCreation,
    trackTemplateBrowsing,
    trackMarketplaceActivity,
    trackSocialInteraction,
    trackMilestone,
    trackWelcomeXP
  };
};
