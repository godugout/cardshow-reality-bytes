
import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import PaymentMethodSelector from './PaymentMethodSelector';
import ShippingForm from './ShippingForm';
import OrderSummary from './OrderSummary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, Truck, CheckCircle } from 'lucide-react';
import type { MarketplaceListing } from '@/types/marketplace';

const stripePromise = loadStripe('pk_test_51OLUiLFOZjNdKx5wH8zRqNGdY8D8GzSQzWGk7x9RGp3QPGC4K8nKGzQ8GzH9F1vT1kA1KGz8N8RzG1QPGC4K8nKGzQ8GzH9F1vT1kA1KGz8N8RzG');

interface CheckoutFlowProps {
  listing: MarketplaceListing;
  onBack: () => void;
  onSuccess: (transactionId: string) => void;
}

type CheckoutStep = 'payment_method' | 'shipping' | 'review' | 'processing' | 'complete';

interface ShippingAddress {
  name: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

const CheckoutFlow = ({ listing, onBack, onSuccess }: CheckoutFlowProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('payment_method');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [savePaymentMethod, setSavePaymentMethod] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>('');

  const totalAmount = listing.price + (listing.shipping_cost || 0);
  const platformFee = Math.round(totalAmount * 0.05 * 100) / 100;

  const handlePaymentMethodSelected = (paymentMethodId: string, shouldSave: boolean) => {
    setSelectedPaymentMethod(paymentMethodId);
    setSavePaymentMethod(shouldSave);
    setCurrentStep('shipping');
  };

  const handleShippingComplete = (address: ShippingAddress) => {
    setShippingAddress(address);
    setCurrentStep('review');
  };

  const handleConfirmOrder = async () => {
    if (!selectedPaymentMethod || !shippingAddress) {
      toast({
        title: 'Missing Information',
        description: 'Please complete all checkout steps',
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(true);
    setCurrentStep('processing');

    try {
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: {
          listing_id: listing.id,
          shipping_address: shippingAddress,
          payment_method_id: selectedPaymentMethod,
          save_payment_method: savePaymentMethod
        }
      });

      if (error) throw error;

      if (data.payment_intent.status === 'succeeded') {
        setCurrentStep('complete');
        onSuccess(data.payment_intent.id);
      } else if (data.payment_intent.requires_action) {
        setClientSecret(data.payment_intent.client_secret);
        // Handle additional authentication if needed
      }
    } catch (error) {
      console.error('Payment failed:', error);
      toast({
        title: 'Payment Failed',
        description: error.message || 'Unable to process payment',
        variant: 'destructive'
      });
      setCurrentStep('review');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'payment_method':
        return (
          <PaymentMethodSelector
            onPaymentMethodSelected={handlePaymentMethodSelected}
            onBack={onBack}
          />
        );
      
      case 'shipping':
        return (
          <ShippingForm
            onShippingComplete={handleShippingComplete}
            onBack={() => setCurrentStep('payment_method')}
          />
        );
      
      case 'review':
        return (
          <div className="space-y-6">
            <OrderSummary
              listing={listing}
              shippingAddress={shippingAddress!}
              totalAmount={totalAmount}
              platformFee={platformFee}
            />
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep('shipping')}
                disabled={isProcessing}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleConfirmOrder}
                disabled={isProcessing}
                className="flex-1 bg-[#00C851]"
              >
                {isProcessing ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
              </Button>
            </div>
          </div>
        );
      
      case 'processing':
        return (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C851] mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
            <p className="text-gray-400">Please wait while we process your payment...</p>
          </div>
        );
      
      case 'complete':
        return (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-[#00C851] mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Payment Successful!</h3>
            <p className="text-gray-400 mb-4">Your order has been confirmed and will be processed shortly.</p>
            <Button onClick={() => onSuccess('completed')} className="bg-[#00C851]">
              Continue
            </Button>
          </div>
        );
      
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'payment_method': return 'Payment Method';
      case 'shipping': return 'Shipping Information';
      case 'review': return 'Review Order';
      case 'processing': return 'Processing Payment';
      case 'complete': return 'Order Complete';
      default: return 'Checkout';
    }
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="max-w-4xl mx-auto p-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              {currentStep === 'payment_method' && <CreditCard className="w-5 h-5" />}
              {currentStep === 'shipping' && <Truck className="w-5 h-5" />}
              {currentStep === 'complete' && <CheckCircle className="w-5 h-5" />}
              {getStepTitle()}
            </CardTitle>
            
            {/* Progress indicator */}
            <div className="flex items-center gap-2 mt-4">
              {['payment_method', 'shipping', 'review'].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                    currentStep === step ? 'bg-[#00C851] text-white' : 
                    ['payment_method', 'shipping', 'review'].indexOf(currentStep) > index ? 'bg-green-600 text-white' : 
                    'bg-gray-700 text-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  {index < 2 && <div className={`w-12 h-1 ${
                    ['payment_method', 'shipping', 'review'].indexOf(currentStep) > index ? 'bg-green-600' : 'bg-gray-700'
                  }`} />}
                </div>
              ))}
            </div>
          </CardHeader>
          
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>
      </div>
    </Elements>
  );
};

export default CheckoutFlow;
