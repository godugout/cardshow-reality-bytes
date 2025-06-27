
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface PriceChartProps {
  data: Array<{
    date: string;
    avg_price: number;
    card_id?: string;
  }>;
  timeframe: number;
}

const PriceChart = ({ data, timeframe }: PriceChartProps) => {
  const chartData = data.map(item => ({
    date: format(new Date(item.date), timeframe <= 7 ? 'MMM dd' : 'MMM dd'),
    price: item.avg_price,
  }));

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
            📈
          </div>
          <p>No price data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Average Price']}
            labelFormatter={(label) => `Date: ${label}`}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
            }}
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
            activeDot={{ r: 4, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
