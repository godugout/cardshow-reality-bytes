
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface VolumeChartProps {
  data: Array<{
    date: string;
    volume: number;
    transactions: number;
  }>;
  timeframe: number;
}

const VolumeChart = ({ data, timeframe }: VolumeChartProps) => {
  const chartData = data.map(item => ({
    date: format(new Date(item.date), timeframe <= 7 ? 'MMM dd' : 'MMM dd'),
    volume: item.volume,
    transactions: item.transactions,
  }));

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
            📊
          </div>
          <p>No volume data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
          />
          <Tooltip 
            formatter={(value: number, name: string) => [
              value.toLocaleString(), 
              name === 'volume' ? 'Volume' : 'Transactions'
            ]}
            labelFormatter={(label) => `Date: ${label}`}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
            }}
          />
          <Bar 
            dataKey="volume" 
            fill="hsl(var(--primary))" 
            opacity={0.8}
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VolumeChart;
