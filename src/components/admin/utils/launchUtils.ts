
import { LaunchCriteria, LaunchStats } from '../types/launchTypes';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Bug,
  TrendingUp,
  MessageSquare,
  Database
} from 'lucide-react';

export const getStatusIcon = (status: LaunchCriteria['status']) => {
  switch (status) {
    case 'completed':
      return CheckCircle2;
    case 'failed':
      return AlertTriangle;
    case 'in_progress':
      return Clock;
    default:
      return Clock;
  }
};

export const getPriorityColor = (priority: LaunchCriteria['priority']) => {
  switch (priority) {
    case 'critical': return 'destructive';
    case 'high': return 'default';
    case 'medium': return 'secondary';
    case 'low': return 'outline';
  }
};

export const getCategoryIcon = (category: LaunchCriteria['category']) => {
  switch (category) {
    case 'testing': return Bug;
    case 'monitoring': return TrendingUp;
    case 'support': return MessageSquare;
    case 'infrastructure': return Database;
  }
};

export const calculateStats = (criteria: LaunchCriteria[]): LaunchStats => {
  return {
    total: criteria.length,
    completed: criteria.filter(c => c.status === 'completed').length,
    failed: criteria.filter(c => c.status === 'failed').length,
    critical: criteria.filter(c => c.priority === 'critical').length,
    criticalCompleted: criteria.filter(c => c.priority === 'critical' && c.status === 'completed').length
  };
};
