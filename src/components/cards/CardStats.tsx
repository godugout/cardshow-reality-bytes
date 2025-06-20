
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { CardStats as CardStatsType } from '@/types/card';

interface CardStatsProps {
  stats: CardStatsType;
  compact?: boolean;
}

const CardStats = ({ stats, compact = false }: CardStatsProps) => {
  const { power, toughness, mana_cost, abilities } = stats;

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        {power !== undefined && toughness !== undefined && (
          <Badge variant="outline" className="font-mono">
            {power}/{toughness}
          </Badge>
        )}
        {mana_cost && Object.keys(mana_cost).length > 0 && (
          <div className="flex gap-1">
            {Object.entries(mana_cost).map(([type, cost]) => (
              <Badge key={type} variant="secondary" className="text-xs">
                {cost} {type}
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className="p-4 bg-gray-900 border-gray-800">
      <div className="space-y-4">
        {/* Power/Toughness */}
        {power !== undefined && toughness !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Power/Toughness</span>
            <Badge variant="outline" className="font-mono text-lg">
              {power}/{toughness}
            </Badge>
          </div>
        )}

        {/* Mana Cost */}
        {mana_cost && Object.keys(mana_cost).length > 0 && (
          <>
            <Separator className="bg-gray-800" />
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Mana Cost</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(mana_cost).map(([type, cost]) => (
                  <Badge key={type} variant="secondary" className="capitalize">
                    {cost} {type}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Abilities */}
        {abilities && abilities.length > 0 && (
          <>
            <Separator className="bg-gray-800" />
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Abilities</h4>
              <div className="flex flex-wrap gap-2">
                {abilities.map((ability, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {ability}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default CardStats;
