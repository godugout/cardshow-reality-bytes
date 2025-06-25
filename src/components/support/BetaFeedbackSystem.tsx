
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { MessageSquare, Send } from 'lucide-react';
import { FeedbackData } from './types';
import { captureBrowserInfo } from './feedbackUtils';
import FeedbackTypeSelector from './FeedbackTypeSelector';
import BasicFeedbackFields from './BasicFeedbackFields';
import BugReportFields from './BugReportFields';
import ScreenshotCapture from './ScreenshotCapture';

const BetaFeedbackSystem = () => {
  const [feedback, setFeedback] = useState<FeedbackData>({
    type: 'bug',
    priority: 'medium',
    title: '',
    description: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      const browserInfo = captureBrowserInfo();

      const { error } = await supabase
        .from('beta_feedback')
        .insert({
          user_id: user.id,
          feedback_type: feedback.type,
          priority: feedback.priority,
          title: feedback.title,
          description: feedback.description,
          steps_to_reproduce: feedback.steps,
          expected_behavior: feedback.expected,
          actual_behavior: feedback.actual,
          user_rating: feedback.rating,
          category: feedback.category,
          browser_info: browserInfo,
          status: 'new'
        });

      if (error) throw error;

      toast({
        title: 'Feedback Submitted',
        description: 'Thank you for your feedback! Our team will review it shortly.',
      });

      // Reset form
      setFeedback({
        type: 'bug',
        priority: 'medium',
        title: '',
        description: '',
        category: 'general'
      });
      setScreenshot(null);

    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: 'Submission Failed',
        description: 'Please try again or contact support directly.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-800 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#00C851]" />
          Beta Feedback & Bug Report
        </CardTitle>
        <p className="text-gray-400 text-sm">
          Help us improve Cardshow by sharing your experience, reporting bugs, or suggesting features.
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FeedbackTypeSelector
            type={feedback.type}
            priority={feedback.priority}
            onTypeChange={(value: any) => setFeedback(prev => ({ ...prev, type: value }))}
            onPriorityChange={(value: any) => setFeedback(prev => ({ ...prev, priority: value }))}
          />

          <BasicFeedbackFields
            title={feedback.title}
            description={feedback.description}
            onTitleChange={(value) => setFeedback(prev => ({ ...prev, title: value }))}
            onDescriptionChange={(value) => setFeedback(prev => ({ ...prev, description: value }))}
          />

          {feedback.type === 'bug' && (
            <BugReportFields
              steps={feedback.steps}
              expected={feedback.expected}
              actual={feedback.actual}
              onStepsChange={(value) => setFeedback(prev => ({ ...prev, steps: value }))}
              onExpectedChange={(value) => setFeedback(prev => ({ ...prev, expected: value }))}
              onActualChange={(value) => setFeedback(prev => ({ ...prev, actual: value }))}
            />
          )}

          <ScreenshotCapture
            screenshot={screenshot}
            onScreenshotCapture={setScreenshot}
          />

          <Button 
            type="submit" 
            disabled={isSubmitting || !feedback.title || !feedback.description}
            className="w-full bg-[#00C851] hover:bg-[#00a844]"
          >
            {isSubmitting ? (
              'Submitting...'
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Feedback
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BetaFeedbackSystem;
