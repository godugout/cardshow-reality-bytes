
import { useCallback } from 'react';
import { useMetricLogger } from './useMetricLogger';
import type { PaymentMetrics } from './types';

export const usePaymentMonitoring = (sessionId?: string) => {
  const { logMetric } = useMetricLogger(sessionId);

  const logPaymentMetrics = useCallback(async (payment: PaymentMetrics) => {
    try {
      await logMetric({
        metricType: 'payment',
        metricName: 'processing_time',
        metricValue: payment.processingTimeMs,
        metadata: {
          status: payment.status,
          paymentMethod: payment.paymentMethod,
          amountCents: payment.amountCents,
          paymentIntentId: payment.paymentIntentId,
          errorCode: payment.errorCode,
          errorMessage: payment.errorMessage,
          stripeFeeCents: payment.stripeFeeCents
        }
      });
    } catch (error) {
      console.warn('Failed to log payment performance:', error);
    }
  }, [logMetric]);

  return { logPaymentMetrics };
};
