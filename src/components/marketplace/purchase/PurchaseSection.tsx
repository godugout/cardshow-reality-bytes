
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Package, Clock, CheckCircle, XCircle } from 'lucide-react';

const PurchaseSection = () => {
  const [activeOrderTab, setActiveOrderTab] = useState('recent');

  // Mock data - in a real app, this would come from an API
  const mockOrders = [
    {
      id: '1',
      cardTitle: 'Legendary Dragon Card',
      seller: 'CardMaster Pro',
      price: 299.99,
      status: 'completed',
      date: '2024-01-15',
      image: '/placeholder.svg'
    },
    {
      id: '2',
      cardTitle: 'Rare Phoenix Edition',
      seller: 'Epic Collections',
      price: 149.99,
      status: 'shipped',
      date: '2024-01-12',
      image: '/placeholder.svg'
    },
    {
      id: '3',
      cardTitle: 'Mythic Warrior Set',
      seller: 'Pro Trader',
      price: 89.99,
      status: 'processing',
      date: '2024-01-10',
      image: '/placeholder.svg'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'shipped':
        return <Package className="w-4 h-4 text-blue-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'shipped':
        return 'bg-blue-500';
      case 'processing':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Purchase Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">
              +23 this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,847</div>
            <p className="text-xs text-muted-foreground">
              +$439 this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              2 processing, 1 shipped
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Management */}
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeOrderTab} onValueChange={setActiveOrderTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value={activeOrderTab} className="mt-6">
              <div className="space-y-4">
                {mockOrders.map((order) => (
                  <Card key={order.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={order.image} 
                          alt={order.cardTitle}
                          className="w-16 h-20 object-cover rounded border"
                        />
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold">{order.cardTitle}</h4>
                              <p className="text-sm text-muted-foreground">
                                Sold by {order.seller}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">${order.price}</p>
                              <p className="text-sm text-muted-foreground">
                                {order.date}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Badge className={`${getStatusColor(order.status)} text-white`}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(order.status)}
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </div>
                            </Badge>
                            
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                              {order.status === 'completed' && (
                                <Button variant="outline" size="sm">
                                  Leave Review
                                </Button>
                              )}
                              {order.status === 'shipped' && (
                                <Button variant="outline" size="sm">
                                  Track Package
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {mockOrders.length === 0 && (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h4 className="text-lg font-medium mb-2">No Orders Found</h4>
                    <p className="text-muted-foreground">
                      Your order history will appear here once you make a purchase
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Package className="w-4 h-4 mr-2" />
              Track All Packages
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Reorder Previous Items
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <CheckCircle className="w-4 h-4 mr-2" />
              Pending Reviews
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Purchase Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Favorite Category:</span>
              <Badge variant="secondary">Legendary Cards</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Average Order:</span>
              <span className="font-medium">$87.50</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Member Since:</span>
              <span className="font-medium">Jan 2023</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PurchaseSection;
