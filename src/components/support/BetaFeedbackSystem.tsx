
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  MessageSquare, 
  Bug, 
  Lightbulb, 
  Star,
  Send,
  Camera
} from 'lucide-react';

interface FeedbackData {
  type: 'bug' | 'feature' | 'improvement' | 'question';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  steps?: string;
  expected?: string;
  actual?: string;
  rating?: number;
  category: string;
}

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
      // Capture additional context
      const browserInfo = {
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      };

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

  const captureScreenshot = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { 
          displaySurface: 'browser'
        } as any
      });
      
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      video.addEventListener('loadedmetadata', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'screenshot.png', { type: 'image/png' });
            setScreenshot(file);
          }
        });
        
        stream.getTracks().forEach(track => track.stop());
      });
      
    } catch (error) {
      toast({
        title: 'Screenshot Failed',
        description: 'Could not capture screenshot. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case 'bug': return <Bug className="w-4 h-4" />;
      case 'feature': return <Lightbulb className="w-4 h-4" />;
      case 'improvement': return <Star className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Feedback Type
              </label>
              <Select 
                value={feedback.type} 
                onValueChange={(value: any) => setFeedback(prev => ({ ...prev, type: value }))}
              >
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
              <Select 
                value={feedback.priority} 
                onValueChange={(value: any) => setFeedback(prev => ({ ...prev, priority: value }))}
              >
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

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title *
            </label>
            <Input
              value={feedback.title}
              onChange={(e) => setFeedback(prev => ({ ...prev, title: e.target.value }))}
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
              value={feedback.description}
              onChange={(e) => setFeedback(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Provide detailed information about your feedback"
              className="bg-gray-800 border-gray-700 text-white min-h-[120px]"
              required
            />
          </div>

          {feedback.type === 'bug' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Steps to Reproduce
                </label>
                <Textarea
                  value={feedback.steps || ''}
                  onChange={(e) => setFeedback(prev => ({ ...prev, steps: e.target.value }))}
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
                    value={feedback.expected || ''}
                    onChange={(e) => setFeedback(prev => ({ ...prev, expected: e.target.value }))}
                    placeholder="What should have happened?"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Actual Behavior
                  </label>
                  <Textarea
                    value={feedback.actual || ''}
                    onChange={(e) => setFeedback(prev => ({ ...prev, actual: e.target.value }))}
                    placeholder="What actually happened?"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={captureScreenshot}
              className="border-gray-700"
            >
              <Camera className="w-4 h-4 mr-2" />
              Capture Screenshot
            </Button>
            
            {screenshot && (
              <Badge variant="secondary">
                Screenshot captured: {screenshot.name}
              </Badge>
            )}
          </div>

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
