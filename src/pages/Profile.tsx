
import { Suspense } from 'react';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Settings, Trophy, FileText, Eye, Crown, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch user's cards (drafts and published)
  const { data: userCards, isLoading } = useQuery({
    queryKey: ['user-cards', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const drafts = userCards?.filter(card => !card.is_public) || [];
  const published = userCards?.filter(card => card.is_public) || [];

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <CardContent>
            <h2 className="text-2xl font-bold text-foreground mb-4">Please Sign In</h2>
            <p className="text-muted-foreground mb-4">You need to be signed in to view your profile.</p>
            <Button onClick={() => navigate('/auth')}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <Header />
      <div className="container mx-auto px-4 py-8 relative">
        <div className="text-center max-w-4xl mx-auto mb-12">
          {/* Stats Badge */}
          <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30">
            <User className="w-3 h-3 mr-1" />
            {published.length} Published • {drafts.length} Drafts
          </Badge>

          {/* Enhanced Header */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight font-display">
            <span className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
              My
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Cards
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Manage your card collection, continue working on drafts, and track your publishing success.
          </p>
        </div>

        <Suspense fallback={<ProfileSkeleton />}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Drafts Section */}
            <Card className="bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <FileText className="w-5 h-5 text-primary" />
                  Drafts ({drafts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : drafts.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground mb-4">No drafts yet</p>
                    <Button onClick={() => navigate('/creator')} size="sm">
                      Create Your First Card
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {drafts.slice(0, 5).map((card) => (
                      <div
                        key={card.id}
                        className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border hover:border-primary/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {card.image_url && (
                            <img
                              src={card.image_url}
                              alt={card.title}
                              className="w-10 h-10 rounded object-cover"
                            />
                          )}
                          <div>
                            <h4 className="font-medium text-foreground">{card.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(card.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Edit3 className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    ))}
                    {drafts.length > 5 && (
                      <p className="text-sm text-muted-foreground text-center pt-2">
                        +{drafts.length - 5} more drafts
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Published Cards Section */}
            <Card className="bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Crown className="w-5 h-5 text-primary" />
                  Published Cards ({published.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : published.length === 0 ? (
                  <div className="text-center py-8">
                    <Crown className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground mb-4">No published cards yet</p>
                    <Button onClick={() => navigate('/creator')} size="sm">
                      Create & Publish
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {published.slice(0, 5).map((card) => (
                      <div
                        key={card.id}
                        className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border hover:border-primary/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {card.image_url && (
                            <img
                              src={card.image_url}
                              alt={card.title}
                              className="w-10 h-10 rounded object-cover"
                            />
                          )}
                          <div>
                            <h4 className="font-medium text-foreground">{card.title}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{new Date(card.created_at).toLocaleDateString()}</span>
                              {card.series_one_number && (
                                <Badge variant="secondary" className="text-xs">
                                  CRD #{card.series_one_number}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>
                    ))}
                    {published.length > 5 && (
                      <p className="text-sm text-muted-foreground text-center pt-2">
                        +{published.length - 5} more published
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </Suspense>
      </div>
    </div>
  );
};

const ProfileSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center space-x-6">
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-full p-6 animate-pulse">
        <Skeleton className="h-16 w-16 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 animate-pulse">
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  </div>
);

export default Profile;
