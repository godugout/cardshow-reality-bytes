
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PasswordResetDialogProps {
  trigger: React.ReactNode;
  email?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const PasswordResetDialog = ({ trigger, email = '', open, onOpenChange }: PasswordResetDialogProps) => {
  const [resetEmail, setResetEmail] = useState(email);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth`
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Reset email sent",
          description: "Check your email for password reset instructions."
        });
        if (onOpenChange) onOpenChange(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Reset Password</DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter your email address and we'll send you a link to reset your password.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handlePasswordReset} className="space-y-4">
          <div>
            <Label htmlFor="reset-email" className="text-white">Email</Label>
            <Input
              id="reset-email"
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Enter your email"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00C851] hover:bg-[#00A543] text-white"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordResetDialog;
