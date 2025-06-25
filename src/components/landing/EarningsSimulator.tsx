
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { DollarSign, TrendingUp, Users } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

const EarningsSimulator = () => {
  const [cardsPerMonth, setCardsPerMonth] = useState([5]);
  const [avgPrice, setAvgPrice] = useState([25]);
  const [followers, setFollowers] = useState([100]);

  const monthlyEarnings = cardsPerMonth[0] * avgPrice[0] * 0.7; // 70% revenue share
  const yearlyEarnings = monthlyEarnings * 12;
  const bonusFromFollowers = Math.floor(followers[0] / 100) * 50;

  return (
    <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-green-400" />
          Earnings Simulator
        </CardTitle>
        <p className="text-gray-400 text-sm">
          Adjust the sliders to see your potential earnings
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 mb-2 block">
              Cards sold per month: {cardsPerMonth[0]}
            </label>
            <Slider
              value={cardsPerMonth}
              onValueChange={setCardsPerMonth}
              max={50}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-2 block">
              Average price: ${avgPrice[0]}
            </label>
            <Slider
              value={avgPrice}
              onValueChange={setAvgPrice}
              max={100}
              min={5}
              step={5}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-2 block">
              Followers: {followers[0]}
            </label>
            <Slider
              value={followers}
              onValueChange={setFollowers}
              max={5000}
              min={10}
              step={10}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
            <div className="flex items-center text-green-400 mb-2">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm">Monthly</span>
            </div>
            <div className="text-2xl font-bold text-white">
              $<AnimatedCounter end={monthlyEarnings} />
            </div>
          </div>

          <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
            <div className="flex items-center text-purple-400 mb-2">
              <Users className="w-4 h-4 mr-1" />
              <span className="text-sm">Yearly</span>
            </div>
            <div className="text-2xl font-bold text-white">
              $<AnimatedCounter end={yearlyEarnings} />
            </div>
          </div>
        </div>

        {bonusFromFollowers > 0 && (
          <div className="bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20">
            <p className="text-yellow-400 text-sm">
              🎉 Follower bonus: +${bonusFromFollowers}/month
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EarningsSimulator;
