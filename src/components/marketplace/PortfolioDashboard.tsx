
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TrendingUp, TrendingDown, DollarSign, Package, PieChart, Plus } from 'lucide-react';
import { usePortfolio, usePortfolioStats } from '@/hooks/usePortfolioTracking';
import { formatDistanceToNow } from 'date-fns';

const PortfolioDashboard = () => {
  const { portfolio, isLoading } = usePortfolio();
  const stats = usePortfolioStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-800 rounded w-1/2" />
                  <div className="h-8 bg-gray-800 rounded w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const isProfit = stats.profitLoss >= 0;

  return (
    <div className="space-y-6">
      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Value</p>
                <p className="text-2xl font-bold text-[#00C851]">
                  ${stats.totalValue.toFixed(2)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-[#00C851]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Cost</p>
                <p className="text-2xl font-bold">
                  ${stats.totalCost.toFixed(2)}
                </p>
              </div>
              <Package className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">P&L</p>
                <p className={`text-2xl font-bold ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
                  {isProfit ? '+' : ''}${stats.profitLoss.toFixed(2)}
                </p>
                <p className={`text-sm ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
                  ({stats.profitLossPercentage.toFixed(1)}%)
                </p>
              </div>
              {isProfit ? (
                <TrendingUp className="w-8 h-8 text-green-500" />
              ) : (
                <TrendingDown className="w-8 h-8 text-red-500" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Cards</p>
                <p className="text-2xl font-bold">
                  {stats.totalCards}
                </p>
              </div>
              <PieChart className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Holdings */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Portfolio Holdings</CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Card
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {portfolio.length > 0 ? (
            <div className="space-y-4">
              {portfolio.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={item.card?.image_url} />
                      <AvatarFallback>
                        {item.card?.title?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{item.card?.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Badge variant="outline" className="text-xs">
                          {item.card?.rarity}
                        </Badge>
                        <span>Qty: {item.quantity}</span>
                        <span>•</span>
                        <span>
                          Added {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Purchase Price</p>
                        <p className="font-medium">
                          ${(item.purchase_price || 0).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Current Value</p>
                        <p className="font-medium text-[#00C851]">
                          ${(item.current_value || 0).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">P&L</p>
                        {(() => {
                          const pl = (item.current_value || 0) - (item.purchase_price || 0);
                          const plPercent = item.purchase_price 
                            ? (pl / item.purchase_price) * 100 
                            : 0;
                          const isProfitable = pl >= 0;
                          
                          return (
                            <div className={`font-medium ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>
                              <p>{isProfitable ? '+' : ''}${pl.toFixed(2)}</p>
                              <p className="text-xs">({plPercent.toFixed(1)}%)</p>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No cards in portfolio</h3>
              <p className="text-gray-400 mb-4">
                Start tracking your card investments by adding cards to your portfolio
              </p>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Card
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioDashboard;
