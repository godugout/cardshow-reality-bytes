
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card/90 backdrop-blur-xl border-0 rounded-3xl">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-foreground">Complete Purchase</DialogTitle>
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
