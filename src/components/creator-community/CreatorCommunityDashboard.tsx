
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Trophy, GraduationCap, Users, TrendingUp, Calendar, Award, Zap } from 'lucide-react';
import CreatorForums from './CreatorForums';
import CreatorChallenges from './CreatorChallenges';
import { useCreatorActivityFeed, useCreatorFollows } from '@/hooks/creator-community/useCreatorFollows';
import { useCreatorCourses } from '@/hooks/creator-community/useCreatorCourses';
import { formatDistanceToNow } from 'date-fns';

export default function CreatorCommunityDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { activities, isLoading: isLoadingActivities } = useCreatorActivityFeed();
  const { following, followers } = useCreatorFollows();
  const { courses } = useCreatorCourses();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'card_created': return <Zap className="w-4 h-4 text-blue-500" />;
      case 'challenge_participated': return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 'course_completed': return <GraduationCap className="w-4 h-4 text-green-500" />;
      default: return <Users className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatActivityMessage = (activity: any) => {
    switch (activity.activity_type) {
      case 'card_created':
        return `created a new ${activity.activity_data.card_rarity} card "${activity.activity_data.card_title}"`;
      case 'challenge_participated':
        return 'participated in a challenge';
      case 'course_completed':
        return 'completed a course';
      default:
        return 'had some activity';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Creator Community</h1>
        <p className="text-muted-foreground">
          Connect, learn, and grow with fellow creators in the Cardshow community
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="forums">Forums</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Following</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{following.length}</div>
                <p className="text-xs text-muted-foreground">Creators you follow</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Followers</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{followers.length}</div>
                <p className="text-xs text-muted-foreground">Creators following you</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Courses</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{courses.length}</div>
                <p className="text-xs text-muted-foreground">Available courses</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Activity</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activities.length}</div>
                <p className="text-xs text-muted-foreground">Recent activities</p>
              </CardContent>
            </Card>
          </div>

          {/* Activity Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Community Activity</CardTitle>
                  <CardDescription>Latest updates from creators you follow</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoadingActivities ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  ) : activities.length > 0 ? (
                    activities.slice(0, 10).map((activity) => (
                      <div key={activity.activity_id} className="flex items-start gap-3">
                        <div className="mt-1">
                          {getActivityIcon(activity.activity_type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">
                            <span className="font-medium">{activity.creator_username}</span>{' '}
                            {formatActivityMessage(activity)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No recent activity. Start following creators to see their updates!
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Start Forum Discussion
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Trophy className="w-4 h-4 mr-2" />
                    Join Challenge
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Browse Courses
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Find Collaborators
                  </Button>
                </CardContent>
              </Card>

              {/* Featured Courses */}
              <Card>
                <CardHeader>
                  <CardTitle>Featured Courses</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {courses.slice(0, 3).map((course) => (
                    <div key={course.id} className="space-y-2">
                      <h4 className="font-medium text-sm">{course.title}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {course.skill_level}
                        </Badge>
                        {course.is_free && (
                          <Badge variant="outline" className="text-xs">Free</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {course.description}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="forums">
          <CreatorForums />
        </TabsContent>

        <TabsContent value="challenges">
          <CreatorChallenges />
        </TabsContent>

        <TabsContent value="courses">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <GraduationCap className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Course Platform Coming Soon</h3>
              <p className="text-muted-foreground text-center">
                Interactive tutorials and skill development courses will be available here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Creator Network Coming Soon</h3>
              <p className="text-muted-foreground text-center">
                Advanced networking and collaboration tools will be available here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
