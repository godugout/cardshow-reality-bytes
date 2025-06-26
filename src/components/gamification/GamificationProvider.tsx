
import React, { createContext, useContext, ReactNode } from 'react';
import { useGamificationTracking } from '@/hooks/useGamificationTracking';
import { useGamification } from '@/hooks/useGamification';

interface GamificationContextType {
  // Tracking functions
  trackCardCreation: (cardId: string, cardTitle: string) => void;
  trackTemplateBrowsing: () => void;
  trackMarketplaceActivity: (activity: string, metadata?: Record<string, any>) => void;
  trackSocialInteraction: (interaction: string, targetId?: string) => void;
  trackMilestone: (milestone: string, value: number, metadata?: Record<string, any>) => void;
  
  // Gamification data
  achievements: any[];
  xpHistory: any[];
  dailyChallenges: any[];
  challengeProgress: any[];
  
  // Loading states
  achievementsLoading: boolean;
  xpHistoryLoading: boolean;
  challengesLoading: boolean;
  progressLoading: boolean;
  
  // Direct actions
  awardXP: (points: number, source: string, sourceId?: string, metadata?: Record<string, any>) => void;
  unlockAchievement: (type: string, name: string, description: string, points: number, metadata?: Record<string, any>) => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const useGamificationContext = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamificationContext must be used within a GamificationProvider');
  }
  return context;
};

interface GamificationProviderProps {
  children: ReactNode;
}

export const GamificationProvider = ({ children }: GamificationProviderProps) => {
  const tracking = useGamificationTracking();
  const gamification = useGamification();

  const value: GamificationContextType = {
    // Tracking functions
    ...tracking,
    
    // Gamification data and actions
    ...gamification
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
};
