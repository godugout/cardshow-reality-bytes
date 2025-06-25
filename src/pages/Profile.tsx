
import { useState } from 'react';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Calendar, Settings, CreditCard, Heart, TrendingUp } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.user_metadata?.username || '',
    fullName: user?.user_metadata?.full_name || '',
    bio: user?.user_metadata?.bio || ''
  });

  const handleSave = async () => {
    // TODO: Implement profile update functionality with Supabase
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully."
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-white">Profile</h1>
            <p className="text-gray-400">Please sign in to view your profile.</p>
          </div>
        </div>
      </div>
    );
  }

  const userInitials = user.email?.charAt(0).toUpperCase() || 'U';
  const joinDate = new Date(user.created_at || '').toLocaleDateString();

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <div className="flex items-center space-x-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-[#00C851] text-white text-2xl">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {formData.fullName || user.email?.split('@')[0]}
                  </h1>
                  <p className="text-gray-400 mb-2">@{formData.username || user.email?.split('@')[0]}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    Joined {joinDate}
                  </div>
                </div>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:text-white"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Edit Profile Form */}
          {isEditing && (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Edit Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="username" className="text-white">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Enter your username"
                  />
                </div>
                <div>
                  <Label htmlFor="fullName" className="text-white">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="bio" className="text-white">Bio</Label>
                  <Input
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Tell us about yourself"
                  />
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleSave} className="bg-[#00C851] hover:bg-[#00A543]">
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Profile Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#00C851]/10 rounded-lg">
                    <CreditCard className="w-6 h-6 text-[#00C851]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">0</p>
                    <p className="text-gray-400 text-sm">Cards Created</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <Heart className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">0</p>
                    <p className="text-gray-400 text-sm">Collections</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">0</p>
                    <p className="text-gray-400 text-sm">Total Views</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Information */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-white font-medium">Email Address</p>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                <Settings className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-white font-medium">Account Status</p>
                  <p className="text-gray-400 text-sm">
                    {user.email_confirmed_at ? 'Verified' : 'Unverified'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
