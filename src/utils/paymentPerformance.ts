
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';

interface PaymentTracker {
  paymentId: string;
  startTime: number;
  method: string;
  amount: number;
}

class PaymentPerformanceTracker {
  private activePayments = new Map<string, PaymentTracker>();
  private logPaymentMetrics: any;

  constructor(logPaymentMetrics: any) {
    this.logPaymentMetrics = logPaymentMetrics;
  }

  // Start tracking a payment
  startPayment(paymentId: string, method: string, amountCents: number): void {
    this.activePayments.set(paymentId, {
      paymentId,
      startTime: performance.now(),
      method,
      amount: amountCents
    });
  }

  // Complete payment tracking
  completePayment(
    paymentId: string, 
    status: 'success' | 'failed' | 'cancelled',
    errorCode?: string,
    errorMessage?: string,
    stripeFeeCents?: number
  ): void {
    const payment = this.activePayments.get(paymentId);
    if (!payment) return;

    const processingTime = performance.now() - payment.startTime;

    this.logPaymentMetrics({
      paymentIntentId: paymentId,
      paymentMethod: payment.method,
      amountCents: payment.amount,
      processingTimeMs: processingTime,
      status,
      errorCode,
      errorMessage,
      stripeFeeCents
    });

    this.activePayments.delete(paymentId);
  }

  // Get current payment stats
  getPaymentStats() {
    return {
      activePayments: this.activePayments.size,
      averageProcessingTime: this.calculateAverageProcessingTime()
    };
  }

  private calculateAverageProcessingTime(): number {
    const now = performance.now();
    const activeTimes = Array.from(this.activePayments.values())
      .map(payment => now - payment.startTime);
    
    return activeTimes.length > 0 
      ? activeTimes.reduce((sum, time) => sum + time, 0) / activeTimes.length 
      : 0;
  }
}

export const createPaymentTracker = (logPaymentMetrics: any) => {
  return new PaymentPerformanceTracker(logPaymentMetrics);
};

// Hook to use payment tracking
export const usePaymentPerformance = () => {
  const { logPaymentMetrics } = usePerformanceMonitoring();
  const tracker = createPaymentTracker(logPaymentMetrics);

  return {
    startPayment: tracker.startPayment.bind(tracker),
    completePayment: tracker.completePayment.bind(tracker),
    getPaymentStats: tracker.getPaymentStats.bind(tracker)
  };
};
