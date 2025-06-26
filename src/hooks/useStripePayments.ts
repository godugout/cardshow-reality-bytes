
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { usePaymentPerformance } from '@/utils/paymentPerformance';
import type { ShippingAddress } from '@/types/marketplace';

export const useCreateStripeAccount = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ business_type, country }: { business_type: string; country?: string }) => {
      const { data, error } = await supabase.functions.invoke('create-stripe-account', {
        body: { business_type, country },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      window.open(data.onboarding_url, '_blank');
      toast({
        title: 'Stripe account created',
        description: 'Complete your onboarding to start selling',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating seller account',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useCreatePaymentIntent = () => {
  const { toast } = useToast();
  const { startPayment, completePayment } = usePaymentPerformance();

  return useMutation({
    mutationFn: async ({ 
      listing_id, 
      shipping_address, 
      payment_method_id, 
      save_payment_method 
    }: { 
      listing_id: string; 
      shipping_address: ShippingAddress;
      payment_method_id?: string;
      save_payment_method?: boolean;
    }) => {
      // Start performance tracking
      const paymentId = `payment_${Date.now()}`;
      startPayment(paymentId, payment_method_id ? 'saved_card' : 'new_card', 0);

      try {
        const { data, error } = await supabase.functions.invoke('create-payment-intent', {
          body: { 
            listing_id, 
            shipping_address, 
            payment_method_id,
            save_payment_method 
          },
        });

        if (error) throw error;

        // Complete performance tracking
        completePayment(
          paymentId, 
          'success', 
          undefined, 
          undefined,
          data.platform_fee * 100
        );

        return data;
      } catch (error) {
        // Complete performance tracking with error
        completePayment(
          paymentId,
          'failed',
          error.code || 'unknown_error',
          error.message
        );
        throw error;
      }
    },
    onError: (error) => {
      toast({
        title: 'Error processing payment',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useConfirmPayment = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ payment_intent_id, tracking_number }: { 
      payment_intent_id: string; 
      tracking_number?: string;
    }) => {
      const { data, error } = await supabase.functions.invoke('confirm-payment', {
        body: { payment_intent_id, tracking_number },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Payment confirmed',
        description: 'Transaction completed successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error confirming payment',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const usePaymentMethods = () => {
  return useQuery({
    queryKey: ['payment-methods'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('manage-payment-methods', {
        body: { action: 'list' }
      });

      if (error) throw error;
      return data.payment_methods || [];
    },
  });
};

export const useManagePaymentMethods = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      action, 
      payment_method_id, 
      set_default 
    }: {
      action: 'delete' | 'set_default' | 'create_setup_intent';
      payment_method_id?: string;
      set_default?: boolean;
    }) => {
      const { data, error } = await supabase.functions.invoke('manage-payment-methods', {
        body: { action, payment_method_id, set_default }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      if (variables.action === 'delete') {
        toast({
          title: 'Payment method removed',
          description: 'Payment method has been successfully removed',
        });
      } else if (variables.action === 'set_default') {
        toast({
          title: 'Default payment method updated',
          description: 'Your default payment method has been changed',
        });
      }
    },
    onError: (error) => {
      toast({
        title: 'Error managing payment method',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
