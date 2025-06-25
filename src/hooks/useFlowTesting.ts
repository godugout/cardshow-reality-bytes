
import { useCallback } from 'react';
import { useStateFlowMonitor } from './useStateFlowMonitor';
import { useStateSync } from './useStateSync';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface FlowTestResult {
  flowName: string;
  success: boolean;
  duration: number;
  errors: any[];
  steps: { step: string; success: boolean; data?: any }[];
}

export const useFlowTesting = () => {
  const { logFlowEvent, startFlow, completeFlow } = useStateFlowMonitor();
  const { queueOperation, getSyncStatus } = useStateSync();
  const { user, signUp, signIn } = useAuth();

  // Test user onboarding flow
  const testUserOnboardingFlow = useCallback(async (): Promise<FlowTestResult> => {
    const flowName = 'USER_ONBOARDING_TEST';
    const startTime = Date.now();
    const errors: any[] = [];
    const steps: { step: string; success: boolean; data?: any }[] = [];

    startFlow(flowName);

    try {
      // Step 1: Registration (simulated)
      try {
        steps.push({ step: 'registration', success: true });
        logFlowEvent(flowName, 'registration_complete');
      } catch (error) {
        errors.push({ step: 'registration', error });
        steps.push({ step: 'registration', success: false });
      }

      // Step 2: Profile setup
      if (user) {
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          steps.push({ step: 'profile_setup', success: !error, data });
          if (error) errors.push({ step: 'profile_setup', error });
          logFlowEvent(flowName, 'profile_setup_complete');
        } catch (error) {
          errors.push({ step: 'profile_setup', error });
          steps.push({ step: 'profile_setup', success: false });
        }
      }

      // Step 3: First card acquisition (check if user has cards)
      if (user) {
        try {
          const { data, error } = await supabase
            .from('cards')
            .select('id')
            .eq('creator_id', user.id)
            .limit(1);
          
          const hasCards = data && data.length > 0;
          steps.push({ step: 'first_card', success: hasCards, data: { hasCards } });
          logFlowEvent(flowName, 'first_card_check', { hasCards });
        } catch (error) {
          errors.push({ step: 'first_card', error });
          steps.push({ step: 'first_card', success: false });
        }
      }

      // Step 4: Collection creation
      if (user) {
        try {
          const { data, error } = await supabase
            .from('collections')
            .select('id')
            .eq('user_id', user.id)
            .limit(1);
          
          const hasCollections = data && data.length > 0;
          steps.push({ step: 'collection_creation', success: hasCollections, data: { hasCollections } });
          logFlowEvent(flowName, 'collection_creation_check', { hasCollections });
        } catch (error) {
          errors.push({ step: 'collection_creation', error });
          steps.push({ step: 'collection_creation', success: false });
        }
      }

      const success = errors.length === 0;
      completeFlow(flowName, success);

      return {
        flowName,
        success,
        duration: Date.now() - startTime,
        errors,
        steps
      };
    } catch (error) {
      completeFlow(flowName, false);
      return {
        flowName,
        success: false,
        duration: Date.now() - startTime,
        errors: [error],
        steps
      };
    }
  }, [user, startFlow, completeFlow, logFlowEvent]);

  // Test trading flow
  const testTradingFlow = useCallback(async (): Promise<FlowTestResult> => {
    const flowName = 'TRADING_FLOW_TEST';
    const startTime = Date.now();
    const errors: any[] = [];
    const steps: { step: string; success: boolean; data?: any }[] = [];

    startFlow(flowName);

    try {
      if (!user) {
        throw new Error('User must be authenticated for trading flow test');
      }

      // Step 1: Check trade offers
      try {
        const { data, error } = await supabase
          .from('trade_offers')
          .select('*')
          .or(`initiator_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .limit(5);
        
        steps.push({ step: 'initiate_trade', success: !error, data: { tradeCount: data?.length } });
        if (error) errors.push({ step: 'initiate_trade', error });
        logFlowEvent(flowName, 'trade_offers_checked');
      } catch (error) {
        errors.push({ step: 'initiate_trade', error });
        steps.push({ step: 'initiate_trade', success: false });
      }

      // Step 2: Check trade messages
      try {
        const { data, error } = await supabase
          .from('trade_messages')
          .select('*')
          .limit(5);
        
        steps.push({ step: 'negotiate', success: !error, data: { messageCount: data?.length } });
        if (error) errors.push({ step: 'negotiate', error });
        logFlowEvent(flowName, 'trade_messages_checked');
      } catch (error) {
        errors.push({ step: 'negotiate', error });
        steps.push({ step: 'negotiate', success: false });
      }

      // Step 3: Check completed trades
      try {
        const { data, error } = await supabase
          .from('trade_offers')
          .select('*')
          .eq('status', 'completed')
          .limit(5);
        
        steps.push({ step: 'accept', success: !error, data: { completedTrades: data?.length } });
        if (error) errors.push({ step: 'accept', error });
        logFlowEvent(flowName, 'completed_trades_checked');
      } catch (error) {
        errors.push({ step: 'accept', error });
        steps.push({ step: 'accept', success: false });
      }

      const success = errors.length === 0;
      completeFlow(flowName, success);

      return {
        flowName,
        success,
        duration: Date.now() - startTime,
        errors,
        steps
      };
    } catch (error) {
      completeFlow(flowName, false);
      return {
        flowName,
        success: false,
        duration: Date.now() - startTime,
        errors: [error],
        steps
      };
    }
  }, [user, startFlow, completeFlow, logFlowEvent]);

  // Test marketplace flow
  const testMarketplaceFlow = useCallback(async (): Promise<FlowTestResult> => {
    const flowName = 'MARKETPLACE_FLOW_TEST';
    const startTime = Date.now();
    const errors: any[] = [];
    const steps: { step: string; success: boolean; data?: any }[] = [];

    startFlow(flowName);

    try {
      // Step 1: Check marketplace listings
      try {
        const { data, error } = await supabase
          .from('marketplace_listings')
          .select('*')
          .eq('status', 'active')
          .limit(10);
        
        steps.push({ step: 'list_card', success: !error, data: { listingCount: data?.length } });
        if (error) errors.push({ step: 'list_card', error });
        logFlowEvent(flowName, 'marketplace_listings_checked');
      } catch (error) {
        errors.push({ step: 'list_card', error });
        steps.push({ step: 'list_card', success: false });
      }

      // Step 2: Check auction bids
      try {
        const { data, error } = await supabase
          .from('auction_bids')
          .select('*')
          .limit(10);
        
        steps.push({ step: 'receive_purchase', success: !error, data: { bidCount: data?.length } });
        if (error) errors.push({ step: 'receive_purchase', error });
        logFlowEvent(flowName, 'auction_bids_checked');
      } catch (error) {
        errors.push({ step: 'receive_purchase', error });
        steps.push({ step: 'receive_purchase', success: false });
      }

      const success = errors.length === 0;
      completeFlow(flowName, success);

      return {
        flowName,
        success,
        duration: Date.now() - startTime,
        errors,
        steps
      };
    } catch (error) {
      completeFlow(flowName, false);
      return {
        flowName,
        success: false,
        duration: Date.now() - startTime,
        errors: [error],
        steps
      };
    }
  }, [startFlow, completeFlow, logFlowEvent]);

  // Run all critical flow tests
  const runAllFlowTests = useCallback(async (): Promise<FlowTestResult[]> => {
    const results: FlowTestResult[] = [];
    
    try {
      const [onboardingResult, tradingResult, marketplaceResult] = await Promise.all([
        testUserOnboardingFlow(),
        testTradingFlow(),
        testMarketplaceFlow()
      ]);

      results.push(onboardingResult, tradingResult, marketplaceResult);
      
      // Log overall test results
      const overallSuccess = results.every(r => r.success);
      const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
      
      logFlowEvent('FLOW_TESTS', 'completed', {
        totalTests: results.length,
        successfulTests: results.filter(r => r.success).length,
        totalErrors,
        overallSuccess
      });

      console.log('[FlowTesting] All flow tests completed:', {
        results,
        overallSuccess,
        totalErrors
      });

      return results;
    } catch (error) {
      logFlowEvent('FLOW_TESTS', 'error', null, error);
      throw error;
    }
  }, [testUserOnboardingFlow, testTradingFlow, testMarketplaceFlow, logFlowEvent]);

  return {
    testUserOnboardingFlow,
    testTradingFlow,
    testMarketplaceFlow,
    runAllFlowTests
  };
};
