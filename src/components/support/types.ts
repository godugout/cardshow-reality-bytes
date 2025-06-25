
export interface FeedbackData {
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
