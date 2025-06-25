
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail } from 'lucide-react';

interface PasswordResetDialogProps {
  trigger: React.ReactNode;
}

const PasswordResetDialog = ({ trigger }: PasswordResetDialogProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handlePasswordReset = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to reset your password.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`
      });

      if (error) {
        toast({
          title: "Reset Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Reset email sent!",
          description: "Check your email for password reset instructions."
        });
        setOpen(false);
        setEmail('');
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-gray-900 border-gray-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Reset Password</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            Enter your email address and we'll send you a link to reset your password.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <Label htmlFor="reset-email" className="text-white">Email</Label>
          <div className="relative mt-2">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white pl-10"
              placeholder="Enter your email"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handlePasswordReset}
            disabled={loading}
            className="bg-[#00C851] hover:bg-[#00A543] text-white"
          >
            {loading ? 'Sending...' : 'Send Reset Email'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PasswordResetDialog;
