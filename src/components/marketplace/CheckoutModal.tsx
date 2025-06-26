
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CheckoutFlow from './checkout/CheckoutFlow';
import type { MarketplaceListing } from '@/types/marketplace';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: MarketplaceListing;
}

const CheckoutModal = ({ isOpen, onClose, listing }: CheckoutModalProps) => {
  const handleSuccess = (transactionId: string) => {
    console.log('Payment successful:', transactionId);
    onClose();
    // Could trigger a success modal or redirect here
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Complete Purchase</DialogTitle>
        </DialogHeader>
        
        <CheckoutFlow
          listing={listing}
          onBack={onClose}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
