
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  MessageCircle, 
  Book, 
  Ticket, 
  Video,
  FileText,
  HelpCircle
} from 'lucide-react';
import { useSupportTickets, useKnowledgeBase } from '@/hooks/enterprise/useSupportSystem';

const SupportCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    description: '',
    category: '',
    priority: 'medium'
  });

  const { tickets, createTicket, isCreating } = useSupportTickets();
  const { articles, incrementView } = useKnowledgeBase(searchTerm);

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticketForm.subject && ticketForm.description && ticketForm.category) {
      createTicket(ticketForm);
      setTicketForm({ subject: '', description: '', category: '', priority: 'medium' });
    }
  };

  const handleArticleClick = (articleId: string) => {
    incrementView(articleId);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Support Center</h1>
        <p className="text-gray-400 text-lg">
          Get help, find answers, and connect with our support team
        </p>
      </div>

      {/* Quick Search */}
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for help articles, guides, or FAQs..."
              className="pl-10 bg-gray-800 border-gray-600 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="knowledge-base" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-gray-900">
          <TabsTrigger value="knowledge-base">Knowledge Base</TabsTrigger>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="tutorials">Video Tutorials</TabsTrigger>
          <TabsTrigger value="live-chat">Live Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="knowledge-base" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Categories */}
            <div className="space-y-4">
              <h3 className="font-semibold text-white">Categories</h3>
              {['Getting Started', 'Card Creation', 'Trading', 'Account', 'Billing', 'Technical'].map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setSearchTerm(category)}
                >
                  <Book className="h-4 w-4 mr-2" />
                  {category}
                </Button>
              ))}
            </div>

            {/* Articles */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="font-semibold text-white">
                {searchTerm ? `Search Results for "${searchTerm}"` : 'Popular Articles'}
              </h3>
              <div className="space-y-3">
                {articles.map((article) => (
                  <Card
                    key={article.id}
                    className="bg-gray-800 border-gray-600 hover:border-gray-500 cursor-pointer transition-colors"
                    onClick={() => handleArticleClick(article.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h4 className="font-medium text-white">{article.title}</h4>
                          <p className="text-sm text-gray-400 line-clamp-2">
                            {article.content.substring(0, 150)}...
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>{article.view_count} views</span>
                            <span>•</span>
                            <span>{article.helpful_count} helpful</span>
                          </div>
                        </div>
                        <Badge variant="secondary">{article.category}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create Ticket */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Ticket className="h-5 w-5 mr-2" />
                  Create Support Ticket
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTicketSubmit} className="space-y-4">
                  <Input
                    placeholder="Subject"
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="bg-gray-800 border-gray-600"
                  />
                  
                  <Select
                    value={ticketForm.category}
                    onValueChange={(value) => setTicketForm(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-600">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="account">Account</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={ticketForm.priority}
                    onValueChange={(value) => setTicketForm(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-600">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>

                  <Textarea
                    placeholder="Describe your issue in detail..."
                    rows={4}
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-gray-800 border-gray-600"
                  />

                  <Button type="submit" className="w-full" disabled={isCreating}>
                    {isCreating ? 'Creating...' : 'Create Ticket'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* My Tickets */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">My Support Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tickets.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">No tickets found</p>
                  ) : (
                    tickets.map((ticket) => (
                      <div key={ticket.id} className="p-3 border border-gray-700 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-white">{ticket.subject}</h4>
                            <p className="text-sm text-gray-400">{ticket.category}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(ticket.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            <Badge
                              variant={
                                ticket.status === 'open' ? 'destructive' :
                                ticket.status === 'pending' ? 'secondary' :
                                'default'
                              }
                            >
                              {ticket.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {ticket.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tutorials" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Getting Started with Cardshow', duration: '5:30', category: 'Basics' },
              { title: 'Creating Your First Card', duration: '8:15', category: 'Creation' },
              { title: 'Trading Cards Safely', duration: '6:45', category: 'Trading' },
              { title: 'Building Collections', duration: '7:20', category: 'Collections' },
              { title: 'Advanced Card Effects', duration: '12:10', category: 'Advanced' },
              { title: 'Marketplace Best Practices', duration: '9:30', category: 'Marketplace' }
            ].map((tutorial, index) => (
              <Card key={index} className="bg-gray-900 border-gray-700 hover:border-gray-600 cursor-pointer transition-colors">
                <CardContent className="p-4">
                  <div className="aspect-video bg-gray-800 rounded-lg mb-3 flex items-center justify-center">
                    <Video className="h-8 w-8 text-gray-400" />
                  </div>
                  <h4 className="font-medium text-white mb-2">{tutorial.title}</h4>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>{tutorial.duration}</span>
                    <Badge variant="outline">{tutorial.category}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="live-chat" className="space-y-4">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Live Chat Support
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-gray-400">
                Get instant help from our support team
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Chat with Support</h3>
                <p className="text-gray-400 mb-4">
                  Our support team is available 24/7 to help you with any questions
                </p>
                <Button className="w-full max-w-sm">
                  Start Live Chat
                </Button>
              </div>
              <div className="text-xs text-gray-500">
                Average response time: 2 minutes
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupportCenter;
