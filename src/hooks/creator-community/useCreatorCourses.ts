
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { CreatorCourse, CourseEnrollment } from '@/types/creator-community';

export const useCreatorCourses = (skillLevel?: string, courseType?: string) => {
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['creator-courses', skillLevel, courseType],
    queryFn: async () => {
      let query = supabase
        .from('creator_courses')
        .select(`
          *,
          instructor:creator_profiles(
            id,
            user_profile:user_profiles(username, avatar_url)
          )
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (skillLevel) {
        query = query.eq('skill_level', skillLevel);
      }

      if (courseType) {
        query = query.eq('course_type', courseType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as CreatorCourse[];
    }
  });

  return { courses, isLoading };
};

export const useCourseEnrollments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: enrollments = [], isLoading } = useQuery({
    queryKey: ['course-enrollments', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get creator profile
      const { data: creatorProfile } = await supabase
        .from('creator_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!creatorProfile) return [];

      const { data, error } = await supabase
        .from('course_enrollments')
        .select('*')
        .eq('creator_id', creatorProfile.id);

      if (error) throw error;
      return data as CourseEnrollment[];
    },
    enabled: !!user
  });

  const enrollInCourseMutation = useMutation({
    mutationFn: async (courseId: string) => {
      if (!user) throw new Error('Must be logged in');

      // Get creator profile
      const { data: creatorProfile } = await supabase
        .from('creator_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!creatorProfile) throw new Error('Creator profile required');

      const { data, error } = await supabase
        .from('course_enrollments')
        .insert({
          course_id: courseId,
          creator_id: creatorProfile.id
        })
        .select()
        .single();

      if (error) throw error;

      // Update course enrollment count
      await supabase.rpc('increment', {
        table: 'creator_courses',
        row_id: courseId,
        column: 'enrollment_count'
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['creator-courses'] });
      toast({
        title: 'Enrolled successfully',
        description: 'You have been enrolled in the course.',
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

  const updateProgressMutation = useMutation({
    mutationFn: async ({ enrollmentId, progress }: { enrollmentId: string; progress: number }) => {
      const { data, error } = await supabase
        .from('course_enrollments')
        .update({ 
          progress_percentage: progress,
          completed_at: progress >= 100 ? new Date().toISOString() : null
        })
        .eq('id', enrollmentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-enrollments'] });
    }
  });

  return {
    enrollments,
    isLoading,
    enrollInCourse: enrollInCourseMutation.mutate,
    isEnrolling: enrollInCourseMutation.isPending,
    updateProgress: updateProgressMutation.mutate
  };
};
