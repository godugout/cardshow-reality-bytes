
import { useCallback } from 'react';
import { PostgrestError } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { auditor } from '@/utils/integrationAudit';

interface SupabaseErrorContext {
  operation: string;
  table?: string;
  userId?: string;
}

export const useSupabaseErrorHandler = () => {
  const { toast } = useToast();

  const handleError = useCallback((
    error: PostgrestError | Error, 
    context: SupabaseErrorContext
  ) => {
    const isPostgrestError = (error: any): error is PostgrestError => {
      return error.code !== undefined && error.details !== undefined;
    };

    let severity: 'critical' | 'high' | 'medium' | 'low' = 'medium';
    let userMessage = 'An unexpected error occurred. Please try again.';
    let solution = 'Check network connection and try again';

    if (isPostgrestError(error)) {
      // Handle specific Supabase/PostgreSQL errors
      switch (error.code) {
        case 'PGRST116': // No rows found
          severity = 'low';
          userMessage = 'No data found.';
          solution = 'Verify the requested data exists';
          break;
        case 'PGRST204': // Empty response
          severity = 'low';
          userMessage = 'No results found.';
          solution = 'Check if data exists or filters are correct';
          break;
        case '23505': // Unique constraint violation
          severity = 'medium';
          userMessage = 'This item already exists.';
          solution = 'Check for duplicate data before inserting';
          break;
        case '23503': // Foreign key violation
          severity = 'high';
          userMessage = 'Related data is missing or invalid.';
          solution = 'Ensure referenced data exists before creating relationship';
          break;
        case 'PGRST301': // Permission denied
          severity = 'high';
          userMessage = 'You don\'t have permission to perform this action.';
          solution = 'Check RLS policies and user permissions';
          break;
        case '42501': // Insufficient privilege
          severity = 'critical';
          userMessage = 'Access denied.';
          solution = 'Review database permissions and RLS policies';
          break;
        default:
          severity = 'high';
          userMessage = error.message || 'Database operation failed.';
          solution = `Check database connectivity and query syntax: ${error.details}`;
      }
    } else {
      // Handle generic errors
      if (error.message.includes('fetch')) {
        severity = 'high';
        userMessage = 'Network connection error. Please check your internet connection.';
        solution = 'Verify network connectivity and Supabase URL configuration';
      } else if (error.message.includes('timeout')) {
        severity = 'medium';
        userMessage = 'Request timed out. Please try again.';
        solution = 'Optimize query performance or increase timeout';
      }
    }

    // Log to integration auditor
    auditor.logIssue({
      system: 'supabase',
      severity,
      issue: `${context.operation} failed: ${error.message}`,
      location: context.table ? `Table: ${context.table}` : 'Unknown table',
      solution,
      tested: false
    });

    // Show user-friendly toast
    toast({
      title: 'Error',
      description: userMessage,
      variant: 'destructive'
    });

    // Log detailed error for debugging
    console.error('Supabase operation failed:', {
      context,
      error: {
        message: error.message,
        code: isPostgrestError(error) ? error.code : 'unknown',
        details: isPostgrestError(error) ? error.details : undefined,
        hint: isPostgrestError(error) ? error.hint : undefined
      },
      timestamp: new Date().toISOString()
    });

    return {
      handled: true,
      severity,
      userMessage,
      solution
    };
  }, [toast]);

  return { handleError };
};
