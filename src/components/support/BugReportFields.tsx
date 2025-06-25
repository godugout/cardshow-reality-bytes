
import { Textarea } from '@/components/ui/textarea';

interface BugReportFieldsProps {
  steps?: string;
  expected?: string;
  actual?: string;
  onStepsChange: (value: string) => void;
  onExpectedChange: (value: string) => void;
  onActualChange: (value: string) => void;
}

const BugReportFields = ({ steps, expected, actual, onStepsChange, onExpectedChange, onActualChange }: BugReportFieldsProps) => {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Steps to Reproduce
        </label>
        <Textarea
          value={steps || ''}
          onChange={(e) => onStepsChange(e.target.value)}
          placeholder="1. Go to... 2. Click on... 3. See error..."
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Expected Behavior
          </label>
          <Textarea
            value={expected || ''}
            onChange={(e) => onExpectedChange(e.target.value)}
            placeholder="What should have happened?"
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Actual Behavior
          </label>
          <Textarea
            value={actual || ''}
            onChange={(e) => onActualChange(e.target.value)}
            placeholder="What actually happened?"
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>
      </div>
    </>
  );
};

export default BugReportFields;
