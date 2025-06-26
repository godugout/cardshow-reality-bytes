import { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { CreditCard, Plus, ArrowLeft } from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: string;
  card: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

interface PaymentMethodSelectorProps {
  onPaymentMethodSelected: (paymentMethodId: string, shouldSave: boolean) => void;
  onBack: () => void;
}

const PaymentMethodSelector = ({ onPaymentMethodSelected, onBack }: PaymentMethodSelectorProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>('new');
  const [saveNewMethod, setSaveNewMethod] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMethods, setLoadingMethods] = useState(true);

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-payment-methods', {
        body: { action: 'list' }
      });

      if (error) throw error;
      setPaymentMethods(data.payment_methods || []);
    } catch (error) {
      console.error('Error loading payment methods:', error);
    } finally {
      setLoadingMethods(false);
    }
  };

  const handleNewPaymentMethod = async () => {
    if (!stripe || !elements) {
      toast({
        title: 'Stripe not loaded',
        description: 'Please wait for Stripe to load and try again',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Card element not found');

      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (paymentMethodError) throw paymentMethodError;

      if (saveNewMethod && paymentMethod) {
        // Create setup intent for saving the payment method
        try {
          const { data: setupData } = await supabase.functions.invoke('manage-payment-methods', {
            body: { action: 'create_setup_intent' }
          });

          if (setupData?.client_secret) {
            await stripe.confirmSetup(setupData.client_secret, {
              payment_method: paymentMethod.id
            });
          }
        } catch (setupError) {
          console.warn('Could not save payment method:', setupError);
        }
      }

      onPaymentMethodSelected(paymentMethod.id, saveNewMethod);
    } catch (error: any) {
      toast({
        title: 'Payment Method Error',
        description: error.message || 'Could not create payment method',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExistingPaymentMethod = () => {
    if (selectedMethod && selectedMethod !== 'new') {
      onPaymentMethodSelected(selectedMethod, false);
    }
  };

  const handleContinue = () => {
    if (selectedMethod === 'new') {
      handleNewPaymentMethod();
    } else {
      handleExistingPaymentMethod();
    }
  };

  const handleSaveMethodChange = (checked: boolean | 'indeterminate') => {
    setSaveNewMethod(checked === true);
  };

  const getCardBrandIcon = (brand: string) => {
    // Return appropriate card brand icon based on brand
    return <CreditCard className="w-5 h-5" />;
  };

  if (loadingMethods) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00C851] mx-auto"></div>
        <p className="text-gray-400 mt-2">Loading payment methods...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
        {/* Existing payment methods */}
        {paymentMethods.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-300">Saved Payment Methods</h3>
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center space-x-3">
                <RadioGroupItem value={method.id} id={method.id} />
                <Label
                  htmlFor={method.id}
                  className="flex items-center gap-3 p-3 border border-gray-700 rounded-lg cursor-pointer hover:border-gray-600 flex-1"
                >
                  {getCardBrandIcon(method.card.brand)}
                  <div>
                    <div className="font-medium">
                      {method.card.brand.toUpperCase()} •••• {method.card.last4}
                    </div>
                    <div className="text-sm text-gray-400">
                      Expires {method.card.exp_month}/{method.card.exp_year}
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </div>
        )}

        {/* New payment method */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-300">
            {paymentMethods.length > 0 ? 'Add New Payment Method' : 'Payment Method'}
          </h3>
          <div className="flex items-start space-x-3">
            <RadioGroupItem value="new" id="new" className="mt-3" />
            <div className="flex-1 space-y-3">
              <Label htmlFor="new" className="flex items-center gap-2 cursor-pointer">
                <Plus className="w-4 h-4" />
                New Credit/Debit Card
              </Label>
              
              {selectedMethod === 'new' && (
                <div className="space-y-4">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <CardElement
                        options={{
                          style: {
                            base: {
                              fontSize: '16px',
                              color: '#ffffff',
                              '::placeholder': {
                                color: '#9ca3af',
                              },
                            },
                          },
                        }}
                      />
                    </CardContent>
                  </Card>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="save-method"
                      checked={saveNewMethod}
                      onCheckedChange={handleSaveMethodChange}
                    />
                    <Label htmlFor="save-method" className="text-sm text-gray-300">
                      Save this payment method for future purchases
                    </Label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </RadioGroup>

      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isLoading}
          className="flex-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={isLoading || !selectedMethod}
          className="flex-1 bg-[#00C851]"
        >
          {isLoading ? 'Processing...' : 'Continue'}
        </Button>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
