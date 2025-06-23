
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { CreatorForum, ForumReply } from '@/types/creator-community';

export const useCreatorForums = (category?: string, skillLevel?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: forums = [], isLoading } = useQuery({
    queryKey: ['creator-forums', category, skillLevel],
    queryFn: async () => {
      let query = supabase
        .from('creator_forums')
        .select(`
          *,
          creator:creator_profiles(
            id,
            user_id,
            bio,
            specialties,
            verification_status,
            user_profile:user_profiles(username, avatar_url)
          )
        `)
        .order('is_pinned', { ascending: false })
        .order('last_activity', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      if (skillLevel && skillLevel !== 'all') {
        query = query.eq('skill_level', skillLevel);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return (data as any[]).map(item => ({
        ...item,
        creator: item.creator ? {
          ...item.creator,
          user_profile: item.creator.user_profile || { username: 'Unknown', avatar_url: null }
        } : undefined
      })) as CreatorForum[];
    }
  });

  const createForumMutation = useMutation({
    mutationFn: async (forumData: {
      title: string;
      description?: string;
      category: string;
      skill_level: string;
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
        .from('creator_forums')
        .insert({
          ...forumData,
          creator_id: creatorProfile.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator-forums'] });
      toast({
        title: 'Forum created',
        description: 'Your forum topic has been created successfully.',
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
    forums,
    isLoading,
    createForum: createForumMutation.mutate,
    isCreating: createForumMutation.isPending
  };
};

export const useForumReplies = (forumId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: replies = [], isLoading } = useQuery({
    queryKey: ['forum-replies', forumId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forum_replies')
        .select(`
          *,
          creator:creator_profiles(
            id,
            user_profile:user_profiles(username, avatar_url)
          )
        `)
        .eq('forum_id', forumId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      return (data as any[]).map(item => ({
        ...item,
        creator: item.creator ? {
          id: item.creator.id,
          user_profile: item.creator.user_profile || { username: 'Unknown', avatar_url: null }
        } : undefined
      })) as ForumReply[];
    },
    enabled: !!forumId
  });

  const addReplyMutation = useMutation({
    mutationFn: async (replyData: {
      content: string;
      parent_reply_id?: string;
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
        .from('forum_replies')
        .insert({
          ...replyData,
          forum_id: forumId,
          creator_id: creatorProfile.id
        })
        .select()
        .single();

      if (error) throw error;

      // Update forum reply count manually
      const { data: forum } = await supabase
        .from('creator_forums')
        .select('reply_count')
        .eq('id', forumId)
        .single();

      if (forum) {
        await supabase
          .from('creator_forums')
          .update({ 
            reply_count: forum.reply_count + 1,
            last_activity: new Date().toISOString()
          })
          .eq('id', forumId);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-replies', forumId] });
      queryClient.invalidateQueries({ queryKey: ['creator-forums'] });
      toast({
        title: 'Reply added',
        description: 'Your reply has been posted successfully.',
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
    replies,
    isLoading,
    addReply: addReplyMutation.mutate,
    isAddingReply: addReplyMutation.isPending
  };
};
