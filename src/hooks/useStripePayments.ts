
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
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

  return useMutation({
    mutationFn: async ({ listing_id, shipping_address }: { 
      listing_id: string; 
      shipping_address: ShippingAddress;
    }) => {
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: { listing_id, shipping_address },
      });

      if (error) throw error;
      return data;
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
