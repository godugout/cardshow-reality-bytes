
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categories } from './types';

interface CreateFlagFormProps {
  onSubmit: (flagData: {
    name: string;
    description: string;
    category: string;
    is_enabled: boolean;
    rollout_percentage: number;
  }) => void;
  onCancel: () => void;
}

const CreateFlagForm = ({ onSubmit, onCancel }: CreateFlagFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'general',
    is_enabled: false,
    rollout_percentage: 0
  });

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      return;
    }
    onSubmit(formData);
  };

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Create New Feature Flag</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-white mb-2 block">Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="feature_name"
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-white mb-2 block">Category</label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-white mb-2 block">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe what this feature flag controls"
            className="bg-gray-800 border-gray-600 text-white"
          />
        </div>
        <div className="flex gap-4">
          <Button onClick={handleSubmit} className="bg-primary text-black">
            Create Flag
          </Button>
          <Button onClick={onCancel} variant="outline">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreateFlagForm;
