
import { supabase } from '@/integrations/supabase/client';

export interface XPResult {
  success: boolean;
  points_awarded: number;
  total_xp: number;
  old_level: {
    level: number;
    title: string;
    icon: string;
    description: string;
    next_level_xp: number | null;
  };
  new_level: {
    level: number;
    title: string;
    icon: string;
    description: string;
    next_level_xp: number | null;
  };
  level_up: boolean;
}

export interface Achievement {
  id: string;
  user_id: string;
  achievement_type: string;
  achievement_name: string;
  description: string;
  points_awarded: number;
  badge_image_url?: string;
  unlocked_at: string;
  is_featured: boolean;
  metadata: Record<string, any>;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  challenge_type: string;
  target_value: number;
  points_reward: number;
  expires_at: string;
  is_active: boolean;
  created_at: string;
}

export interface ChallengeProgress {
  id: string;
  user_id: string;
  challenge_id: string;
  current_progress: number;
  is_completed: boolean;
  completed_at?: string;
  created_at: string;
}

export const gamificationService = {
  // Award XP to a user
  async awardXP(
    userId: string,
    points: number,
    source: string,
    sourceId?: string,
    metadata: Record<string, any> = {}
  ): Promise<XPResult | null> {
    try {
      const { data, error } = await supabase.rpc('award_user_xp', {
        user_uuid: userId,
        points,
        source,
        source_ref_id: sourceId || null,
        xp_metadata: metadata
      });

      if (error) {
        console.error('Error awarding XP:', error);
        return null;
      }

      return data as XPResult;
    } catch (error) {
      console.error('Error in awardXP:', error);
      return null;
    }
  },

  // Unlock an achievement
  async unlockAchievement(
    userId: string,
    achievementType: string,
    achievementName: string,
    description: string,
    points: number,
    metadata: Record<string, any> = {}
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('unlock_achievement', {
        user_uuid: userId,
        achievement_type_param: achievementType,
        achievement_name_param: achievementName,
        description_param: description,
        points_param: points,
        metadata_param: metadata
      });

      if (error) {
        console.error('Error unlocking achievement:', error);
        return false;
      }

      return data as boolean;
    } catch (error) {
      console.error('Error in unlockAchievement:', error);
      return false;
    }
  },

  // Get user's achievements
  async getUserAchievements(userId: string): Promise<Achievement[]> {
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId)
        .order('unlocked_at', { ascending: false });

      if (error) {
        console.error('Error fetching achievements:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserAchievements:', error);
      return [];
    }
  },

  // Get user's XP history
  async getUserXPHistory(userId: string, limit: number = 50) {
    try {
      const { data, error } = await supabase
        .from('user_experience_points')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching XP history:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserXPHistory:', error);
      return [];
    }
  },

  // Get daily challenges
  async getDailyChallenges(): Promise<DailyChallenge[]> {
    try {
      const { data, error } = await supabase
        .from('daily_challenges')
        .select('*')
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching daily challenges:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getDailyChallenges:', error);
      return [];
    }
  },

  // Get user's challenge progress
  async getUserChallengeProgress(userId: string): Promise<ChallengeProgress[]> {
    try {
      const { data, error } = await supabase
        .from('user_challenge_progress')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching challenge progress:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserChallengeProgress:', error);
      return [];
    }
  },

  // Update challenge progress
  async updateChallengeProgress(
    userId: string,
    challengeId: string,
    progress: number
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_challenge_progress')
        .upsert({
          user_id: userId,
          challenge_id: challengeId,
          current_progress: progress,
          is_completed: false
        });

      if (error) {
        console.error('Error updating challenge progress:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateChallengeProgress:', error);
      return false;
    }
  },

  // Complete a challenge
  async completeChallenge(userId: string, challengeId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_challenge_progress')
        .update({
          is_completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('challenge_id', challengeId);

      if (error) {
        console.error('Error completing challenge:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in completeChallenge:', error);
      return false;
    }
  },

  // Generate new daily challenges
  async generateDailyChallenges(): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('generate_daily_challenges');

      if (error) {
        console.error('Error generating daily challenges:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in generateDailyChallenges:', error);
      return false;
    }
  }
};
