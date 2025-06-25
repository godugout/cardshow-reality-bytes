
import { LaunchCriteria } from '../types/launchTypes';

export const launchCriteria: LaunchCriteria[] = [
  // Critical Testing
  {
    id: 'test-user-flows',
    category: 'testing',
    title: 'End-to-End User Flow Testing',
    description: 'Complete testing of user onboarding, card creation, trading, and marketplace flows',
    status: 'pending',
    priority: 'critical'
  },
  {
    id: 'test-load-performance',
    category: 'testing',
    title: 'Load Testing Under Realistic Traffic',
    description: 'Simulate 100+ concurrent users across all major features',
    status: 'pending',
    priority: 'critical'
  },
  {
    id: 'test-payment-security',
    category: 'testing',
    title: 'Payment Security and PCI Compliance',
    description: 'Verify secure payment processing and compliance with PCI DSS',
    status: 'pending',
    priority: 'critical'
  },

  // Monitoring Systems
  {
    id: 'monitoring-errors',
    category: 'monitoring',
    title: 'Error Tracking and Alerting',
    description: 'Real-time error monitoring with automated alerts for critical issues',
    status: 'pending',
    priority: 'critical'
  },
  {
    id: 'monitoring-performance',
    category: 'monitoring',
    title: 'Performance Monitoring Dashboard',
    description: 'Track key performance metrics and user experience indicators',
    status: 'pending',
    priority: 'high'
  },
  {
    id: 'monitoring-uptime',
    category: 'monitoring',
    title: 'Uptime Monitoring and Health Checks',
    description: 'Monitor all critical services with automatic failover',
    status: 'pending',
    priority: 'critical'
  },

  // Support Infrastructure
  {
    id: 'support-documentation',
    category: 'support',
    title: 'User Documentation and FAQ',
    description: 'Comprehensive help system and troubleshooting guides',
    status: 'pending',
    priority: 'high'
  },
  {
    id: 'support-feedback',
    category: 'support',
    title: 'Beta Feedback Collection System',
    description: 'In-app feedback tools and bug reporting system',
    status: 'pending',
    priority: 'high'
  },
  {
    id: 'support-onboarding',
    category: 'support',
    title: 'User Onboarding Tutorial',
    description: 'Interactive tutorial for new beta users',
    status: 'pending',
    priority: 'medium'
  },

  // Infrastructure
  {
    id: 'infra-backup',
    category: 'infrastructure',
    title: 'Backup and Recovery Procedures',
    description: 'Automated backups with tested recovery procedures',
    status: 'pending',
    priority: 'critical'
  },
  {
    id: 'infra-rollback',
    category: 'infrastructure',
    title: 'Rollback and Emergency Procedures',
    description: 'Feature flags and emergency rollback capabilities',
    status: 'pending',
    priority: 'critical'
  },
  {
    id: 'infra-scaling',
    category: 'infrastructure',
    title: 'Auto-scaling Configuration',
    description: 'Automatic scaling for database and server resources',
    status: 'pending',
    priority: 'high'
  }
];
