
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface BasicFeedbackFieldsProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

const BasicFeedbackFields = ({ title, description, onTitleChange, onDescriptionChange }: BasicFeedbackFieldsProps) => {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Title *
        </label>
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Brief description of the issue or suggestion"
          className="bg-gray-800 border-gray-700 text-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Description *
        </label>
        <Textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Provide detailed information about your feedback"
          className="bg-gray-800 border-gray-700 text-white min-h-[120px]"
          required
        />
      </div>
    </>
  );
};

export default BasicFeedbackFields;
