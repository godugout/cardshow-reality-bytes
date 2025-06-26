
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { MarketplaceListing } from '@/types/marketplace';

interface OrderSummaryProps {
  listing: MarketplaceListing;
  shippingAddress: {
    name: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  totalAmount: number;
  platformFee: number;
}

const OrderSummary = ({ listing, shippingAddress, totalAmount, platformFee }: OrderSummaryProps) => {
  return (
    <div className="space-y-6">
      {/* Order Items */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={listing.card?.image_url || '/placeholder.svg'}
              alt={listing.card?.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-white">{listing.card?.title}</h3>
              <p className="text-sm text-gray-400">
                {listing.card?.rarity} • {listing.condition}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-white">${listing.price.toFixed(2)}</p>
            </div>
          </div>

          <Separator className="bg-gray-700" />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Item Price</span>
              <span className="text-white">${listing.price.toFixed(2)}</span>
            </div>
            
            {listing.shipping_cost && listing.shipping_cost > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Shipping</span>
                <span className="text-white">${listing.shipping_cost.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Platform Fee</span>
              <span className="text-white">${platformFee.toFixed(2)}</span>
            </div>

            <Separator className="bg-gray-700" />

            <div className="flex justify-between font-semibold">
              <span className="text-white">Total</span>
              <span className="text-[#00C851]">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Shipping Address</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-300 space-y-1">
            <div className="font-semibold">{shippingAddress.name}</div>
            <div>{shippingAddress.address_line_1}</div>
            {shippingAddress.address_line_2 && (
              <div>{shippingAddress.address_line_2}</div>
            )}
            <div>
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}
            </div>
            <div>{shippingAddress.country}</div>
          </div>
        </CardContent>
      </Card>

      {/* Seller Information */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Seller Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <img
              src={listing.profiles?.avatar_url || '/placeholder.svg'}
              alt={listing.profiles?.username}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="font-semibold text-white">
                {listing.profiles?.username}
              </div>
              {listing.seller_profiles?.rating && (
                <div className="text-sm text-gray-400">
                  ⭐ {listing.seller_profiles.rating.toFixed(1)} rating
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSummary;
