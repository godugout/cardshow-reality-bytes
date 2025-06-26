
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';

const shippingSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address_line_1: z.string().min(1, 'Address is required'),
  address_line_2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postal_code: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

interface ShippingFormProps {
  onShippingComplete: (address: ShippingFormData) => void;
  onBack: () => void;
}

const ShippingForm = ({ onShippingComplete, onBack }: ShippingFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      country: 'US'
    }
  });

  const onSubmit = async (data: ShippingFormData) => {
    setIsLoading(true);
    try {
      // Validate shipping address if needed
      onShippingComplete(data);
    } finally {
      setIsLoading(false);
    }
  };

  const US_STATES = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            {...register('name')}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="address_line_1">Address Line 1</Label>
          <Input
            id="address_line_1"
            {...register('address_line_1')}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="123 Main St"
          />
          {errors.address_line_1 && (
            <p className="text-red-400 text-sm mt-1">{errors.address_line_1.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="address_line_2">Address Line 2 (Optional)</Label>
          <Input
            id="address_line_2"
            {...register('address_line_2')}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Apt, Suite, etc."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              {...register('city')}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="New York"
            />
            {errors.city && (
              <p className="text-red-400 text-sm mt-1">{errors.city.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="state">State</Label>
            <Select onValueChange={(value) => setValue('state', value)}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.state && (
              <p className="text-red-400 text-sm mt-1">{errors.state.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="postal_code">Postal Code</Label>
            <Input
              id="postal_code"
              {...register('postal_code')}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="10001"
            />
            {errors.postal_code && (
              <p className="text-red-400 text-sm mt-1">{errors.postal_code.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="country">Country</Label>
            <Select defaultValue="US" onValueChange={(value) => setValue('country', value)}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
                <SelectItem value="GB">United Kingdom</SelectItem>
                <SelectItem value="AU">Australia</SelectItem>
              </SelectContent>
            </Select>
            {errors.country && (
              <p className="text-red-400 text-sm mt-1">{errors.country.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isLoading}
          className="flex-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-[#00C851]"
        >
          {isLoading ? 'Validating...' : 'Continue'}
        </Button>
      </div>
    </form>
  );
};

export default ShippingForm;
