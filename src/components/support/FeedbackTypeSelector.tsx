
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Bug, Lightbulb, Star, MessageSquare } from 'lucide-react';

interface FeedbackTypeSelectorProps {
  type: string;
  priority: string;
  onTypeChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
}

const FeedbackTypeSelector = ({ type, priority, onTypeChange, onPriorityChange }: FeedbackTypeSelectorProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Feedback Type
        </label>
        <Select value={type} onValueChange={onTypeChange}>
          <SelectTrigger className="bg-gray-800 border-gray-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bug">
              <div className="flex items-center gap-2">
                <Bug className="w-4 h-4" />
                Bug Report
              </div>
            </SelectItem>
            <SelectItem value="feature">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Feature Request
              </div>
            </SelectItem>
            <SelectItem value="improvement">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                Improvement
              </div>
            </SelectItem>
            <SelectItem value="question">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Question
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Priority
        </label>
        <Select value={priority} onValueChange={onPriorityChange}>
          <SelectTrigger className="bg-gray-800 border-gray-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">
              <Badge variant="outline">Low</Badge>
            </SelectItem>
            <SelectItem value="medium">
              <Badge variant="secondary">Medium</Badge>
            </SelectItem>
            <SelectItem value="high">
              <Badge variant="default">High</Badge>
            </SelectItem>
            <SelectItem value="critical">
              <Badge variant="destructive">Critical</Badge>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FeedbackTypeSelector;
