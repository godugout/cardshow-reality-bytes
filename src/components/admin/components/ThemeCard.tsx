
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';
import type { CardTheme } from '../data/cardThemesData';

interface ThemeCardProps {
  theme: string;
  data: CardTheme;
  onGenerate: (theme: string) => void;
  isLoading: boolean;
}

export const ThemeCard = ({ theme, data, onGenerate, isLoading }: ThemeCardProps) => {
  return (
    <Card className="bg-gray-800 border-gray-600">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-white font-semibold">{theme}</h3>
          <Badge variant="secondary">{data.cards.length} cards</Badge>
        </div>
        <p className="text-gray-400 text-sm mb-4">
          {data.cards.map(card => card.title).join(', ')}
        </p>
        <Button
          onClick={() => onGenerate(theme)}
          disabled={isLoading}
          className="w-full bg-[#00C851] hover:bg-[#00a844]"
          size="sm"
        >
          <Download className="w-4 h-4 mr-2" />
          Generate {theme} Cards
        </Button>
      </CardContent>
    </Card>
  );
};
