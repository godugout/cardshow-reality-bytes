
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { CreatorChallenge, ChallengeSubmission } from '@/types/creator-community';

export const useCreatorChallenges = (status?: string) => {
  const { data: challenges = [], isLoading } = useQuery({
    queryKey: ['creator-challenges', status],
    queryFn: async () => {
      let query = supabase
        .from('creator_challenges')
        .select('*')
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as CreatorChallenge[];
    }
  });

  return { challenges, isLoading };
};

export const useChallengeSubmissions = (challengeId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['challenge-submissions', challengeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('challenge_submissions')
        .select(`
          *,
          card:cards(id, title, image_url, rarity),
          creator:creator_profiles(
            id,
            user_profile:user_profiles(username, avatar_url)
          )
        `)
        .eq('challenge_id', challengeId)
        .order('score', { ascending: false, nullsLast: true });

      if (error) throw error;
      return data as ChallengeSubmission[];
    },
    enabled: !!challengeId
  });

  const submitToChallengeMutation = useMutation({
    mutationFn: async (submissionData: {
      card_id?: string;
      submission_title?: string;
      submission_description?: string;
    }) => {
      if (!user) throw new Error('Must be logged in');

      // Get creator profile
      const { data: creatorProfile } = await supabase
        .from('creator_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!creatorProfile) throw new Error('Creator profile required');

      const { data, error } = await supabase
        .from('challenge_submissions')
        .insert({
          ...submissionData,
          challenge_id: challengeId,
          creator_id: creatorProfile.id
        })
        .select()
        .single();

      if (error) throw error;

      // Update challenge participant count
      await supabase.rpc('increment', {
        table: 'creator_challenges',
        row_id: challengeId,
        column: 'current_participants'
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenge-submissions', challengeId] });
      queryClient.invalidateQueries({ queryKey: ['creator-challenges'] });
      toast({
        title: 'Submission created',
        description: 'Your challenge submission has been created successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  return {
    submissions,
    isLoading,
    submitToChallenge: submitToChallengeMutation.mutate,
    isSubmitting: submitToChallengeMutation.isPending
  };
};
