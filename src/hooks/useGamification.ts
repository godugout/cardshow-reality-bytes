
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { gamificationService, type XPResult, type Achievement, type DailyChallenge, type ChallengeProgress } from '@/services/gamificationService';
import { toast } from 'sonner';

export const useGamification = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get user achievements
  const { data: achievements = [], isLoading: achievementsLoading } = useQuery({
    queryKey: ['achievements', user?.id],
    queryFn: () => user ? gamificationService.getUserAchievements(user.id) : Promise.resolve([]),
    enabled: !!user?.id
  });

  // Get user XP history
  const { data: xpHistory = [], isLoading: xpHistoryLoading } = useQuery({
    queryKey: ['xp-history', user?.id],
    queryFn: () => user ? gamificationService.getUserXPHistory(user.id) : Promise.resolve([]),
    enabled: !!user?.id
  });

  // Get daily challenges
  const { data: dailyChallenges = [], isLoading: challengesLoading } = useQuery({
    queryKey: ['daily-challenges'],
    queryFn: () => gamificationService.getDailyChallenges(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 60 * 1000 // 30 minutes
  });

  // Get user challenge progress
  const { data: challengeProgress = [], isLoading: progressLoading } = useQuery({
    queryKey: ['challenge-progress', user?.id],
    queryFn: () => user ? gamificationService.getUserChallengeProgress(user.id) : Promise.resolve([]),
    enabled: !!user?.id
  });

  // Award XP mutation
  const awardXPMutation = useMutation({
    mutationFn: ({ points, source, sourceId, metadata }: {
      points: number;
      source: string;
      sourceId?: string;
      metadata?: Record<string, any>;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      return gamificationService.awardXP(user.id, points, source, sourceId, metadata);
    },
    onSuccess: (result) => {
      if (result) {
        // Show XP notification
        toast.success(`+${result.points_awarded} XP earned!`, {
          description: `Total XP: ${result.total_xp}`
        });

        // Show level up notification
        if (result.level_up) {
          toast.success(`🎉 Level Up! You're now ${result.new_level.title}!`, {
            description: result.new_level.description,
            duration: 5000
          });
        }

        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ['xp-history', user?.id] });
        queryClient.invalidateQueries({ queryKey: ['user-profile', user?.id] });
      }
    },
    onError: (error) => {
      console.error('Failed to award XP:', error);
      toast.error('Failed to award XP');
    }
  });

  // Unlock achievement mutation
  const unlockAchievementMutation = useMutation({
    mutationFn: ({ achievementType, achievementName, description, points, metadata }: {
      achievementType: string;
      achievementName: string;
      description: string;
      points: number;
      metadata?: Record<string, any>;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      return gamificationService.unlockAchievement(
        user.id,
        achievementType,
        achievementName,
        description,
        points,
        metadata
      );
    },
    onSuccess: (unlocked) => {
      if (unlocked) {
        toast.success('🏆 Achievement Unlocked!', {
          description: 'Check your achievements to see your progress',
          duration: 4000
        });

        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ['achievements', user?.id] });
        queryClient.invalidateQueries({ queryKey: ['xp-history', user?.id] });
      }
    },
    onError: (error) => {
      console.error('Failed to unlock achievement:', error);
    }
  });

  // Update challenge progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: ({ challengeId, progress }: { challengeId: string; progress: number }) => {
      if (!user?.id) throw new Error('User not authenticated');
      return gamificationService.updateChallengeProgress(user.id, challengeId, progress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenge-progress', user?.id] });
    },
    onError: (error) => {
      console.error('Failed to update challenge progress:', error);
    }
  });

  // Complete challenge mutation
  const completeChallengeMutation = useMutation({
    mutationFn: ({ challengeId }: { challengeId: string }) => {
      if (!user?.id) throw new Error('User not authenticated');
      return gamificationService.completeChallenge(user.id, challengeId);
    },
    onSuccess: () => {
      toast.success('🎯 Challenge Complete!', {
        description: 'You earned bonus XP for completing a challenge'
      });
      
      queryClient.invalidateQueries({ queryKey: ['challenge-progress', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['xp-history', user?.id] });
    },
    onError: (error) => {
      console.error('Failed to complete challenge:', error);
      toast.error('Failed to complete challenge');
    }
  });

  // Helper functions
  const awardXP = (points: number, source: string, sourceId?: string, metadata?: Record<string, any>) => {
    awardXPMutation.mutate({ points, source, sourceId, metadata });
  };

  const unlockAchievement = (
    achievementType: string,
    achievementName: string,
    description: string,
    points: number,
    metadata?: Record<string, any>
  ) => {
    unlockAchievementMutation.mutate({
      achievementType,
      achievementName,
      description,
      points,
      metadata
    });
  };

  const updateChallengeProgress = (challengeId: string, progress: number) => {
    updateProgressMutation.mutate({ challengeId, progress });
  };

  const completeChallenge = (challengeId: string) => {
    completeChallengeMutation.mutate({ challengeId });
  };

  return {
    // Data
    achievements,
    xpHistory,
    dailyChallenges,
    challengeProgress,
    
    // Loading states
    achievementsLoading,
    xpHistoryLoading,
    challengesLoading,
    progressLoading,
    
    // Actions
    awardXP,
    unlockAchievement,
    updateChallengeProgress,
    completeChallenge,
    
    // Mutation states
    isAwarding: awardXPMutation.isPending,
    isUnlocking: unlockAchievementMutation.isPending,
    isUpdatingProgress: updateProgressMutation.isPending,
    isCompletingChallenge: completeChallengeMutation.isPending
  };
};
