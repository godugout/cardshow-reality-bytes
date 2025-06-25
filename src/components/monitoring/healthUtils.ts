
import { CheckCircle, AlertTriangle, Clock } from 'lucide-react';

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'healthy': return 'text-green-400';
    case 'degraded': return 'text-yellow-400';
    case 'down': return 'text-red-400';
    default: return 'text-gray-400';
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'healthy': return CheckCircle;
    case 'degraded': return AlertTriangle;
    case 'down': return AlertTriangle;
    default: return Clock;
  }
};

export const getOverallHealth = (metrics: any) => {
  return Object.values(metrics).every((service: any) => service.status === 'healthy') 
    ? 'healthy' 
    : Object.values(metrics).some((service: any) => service.status === 'down')
    ? 'down'
    : 'degraded';
};
