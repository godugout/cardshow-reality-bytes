
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCollectionMutations } from '@/hooks/useCollections';

interface CreateCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  title: string;
  description: string;
  visibility: 'public' | 'private' | 'shared';
  template_id?: string;
}

const CreateCollectionDialog = ({ open, onOpenChange }: CreateCollectionDialogProps) => {
  const { createCollection } = useCollectionMutations();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      visibility: 'private'
    }
  });

  const visibility = watch('visibility');

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await createCollection.mutateAsync(data);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating collection:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Collection</DialogTitle>
          <DialogDescription className="text-gray-400">
            Organize your cards into a personalized collection
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Collection Title</Label>
            <Input
              id="title"
              {...register('title', { 
                required: 'Title is required',
                minLength: { value: 2, message: 'Title must be at least 2 characters' }
              })}
              placeholder="My Awesome Collection"
              className="bg-gray-800 border-gray-600 text-white"
            />
            {errors.title && (
              <p className="text-red-400 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Describe your collection..."
              className="bg-gray-800 border-gray-600 text-white min-h-[80px]"
            />
          </div>

          {/* Visibility */}
          <div className="space-y-3">
            <Label>Collection Visibility</Label>
            <RadioGroup 
              value={visibility} 
              onValueChange={(value) => setValue('visibility', value as any)}
              className="space-y-2"
            >
              <div className="flex items-start space-x-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
                <RadioGroupItem value="private" id="private" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="private" className="font-medium">Private</Label>
                  <p className="text-sm text-gray-400 mt-1">
                    Only you can see this collection
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
                <RadioGroupItem value="shared" id="shared" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="shared" className="font-medium">Shared</Label>
                  <p className="text-sm text-gray-400 mt-1">
                    Anyone with the link can view
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
                <RadioGroupItem value="public" id="public" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="public" className="font-medium">Public</Label>
                  <p className="text-sm text-gray-400 mt-1">
                    Anyone can discover and view
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Template Selection */}
          <div className="space-y-2">
            <Label htmlFor="template">Collection Template (Optional)</Label>
            <Select onValueChange={(value) => setValue('template_id', value)}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Choose a template..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="starter">Starter Collection</SelectItem>
                <SelectItem value="complete">Complete Set</SelectItem>
                <SelectItem value="legendary">Legendary Cards</SelectItem>
                <SelectItem value="custom">Custom Collection</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-gray-600 text-gray-300 hover:text-white"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#00C851] hover:bg-[#00a844] text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Collection'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCollectionDialog;
