
import { Suspense } from 'react';
import Header from '@/components/Header';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { User, Settings, Trophy } from 'lucide-react';

const Profile = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00C851]/10 via-transparent to-[#00A543]/5" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <Header />
      <div className="container mx-auto px-4 py-8 relative">
        <div className="text-center max-w-4xl mx-auto mb-12">
          {/* Announcement Badge */}
          <Badge className="mb-6 bg-[#00C851]/20 text-[#00C851] border-[#00C851]/30 hover:bg-[#00C851]/30">
            <User className="w-3 h-3 mr-1" />
            Personal Dashboard
          </Badge>

          {/* Enhanced Header */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight font-display">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              My
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#00C851] to-[#00A543] bg-clip-text text-transparent">
              Profile
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Manage your account settings, view your activity, and track your collection progress. 
            Customize your profile and showcase your achievements.
          </p>
        </div>

        <Suspense fallback={<ProfileSkeleton />}>
          <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-[#00C851]/50 transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-[#00C851] to-[#00A543] rounded-full mx-auto mb-6 flex items-center justify-center">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Profile Dashboard Coming Soon</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                We're building an amazing profile experience with detailed analytics, 
                achievement tracking, and collection management tools.
              </p>
              <div className="flex justify-center items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  <span>Account Settings</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  <span>Achievement System</span>
                </div>
              </div>
            </CardContent>
          </Card>
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
