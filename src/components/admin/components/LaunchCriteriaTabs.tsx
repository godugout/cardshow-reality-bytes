
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LaunchCriteria } from '../types/launchTypes';
import LaunchCriteriaCard from './LaunchCriteriaCard';

interface LaunchCriteriaTabsProps {
  criteria: LaunchCriteria[];
}

const LaunchCriteriaTabs = ({ criteria }: LaunchCriteriaTabsProps) => {
  const tabs = ['all', 'testing', 'monitoring', 'support', 'infrastructure'] as const;

  return (
    <Tabs defaultValue="all" className="space-y-4">
      <TabsList className="grid w-full grid-cols-5 bg-gray-900 border-gray-800">
        <TabsTrigger value="all">All Criteria</TabsTrigger>
        <TabsTrigger value="testing">Testing</TabsTrigger>
        <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        <TabsTrigger value="support">Support</TabsTrigger>
        <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
      </TabsList>

      {tabs.map(tab => (
        <TabsContent key={tab} value={tab} className="space-y-4">
          {criteria
            .filter(criterion => tab === 'all' || criterion.category === tab)
            .map(criterion => (
              <LaunchCriteriaCard key={criterion.id} criterion={criterion} />
            ))}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default LaunchCriteriaTabs;
