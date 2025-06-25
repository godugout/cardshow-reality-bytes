
export interface LaunchCriteria {
  id: string;
  category: 'testing' | 'monitoring' | 'support' | 'infrastructure';
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending' | 'failed';
  priority: 'critical' | 'high' | 'medium' | 'low';
  dependencies?: string[];
  testResults?: any;
  lastChecked?: Date;
}

export interface LaunchStats {
  total: number;
  completed: number;
  failed: number;
  critical: number;
  criticalCompleted: number;
}
