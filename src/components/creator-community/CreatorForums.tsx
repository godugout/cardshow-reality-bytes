
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { MessageSquare, Users, Clock, Pin, Lock, Plus } from 'lucide-react';
import { useCreatorForums } from '@/hooks/creator-community/useCreatorForums';
import { formatDistanceToNow } from 'date-fns';

export default function CreatorForums() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<string>('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newForumData, setNewForumData] = useState({
    title: '',
    description: '',
    category: '',
    skill_level: 'all'
  });

  const { forums, isLoading, createForum, isCreating } = useCreatorForums(selectedCategory, selectedSkillLevel);

  const categories = [
    'Design Techniques',
    'Software & Tools',
    'Business & Marketing',
    'Collaboration',
    'Feedback & Critique',
    'Industry News',
    'General Discussion'
  ];

  const skillLevels = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ];

  const handleCreateForum = () => {
    if (!newForumData.title || !newForumData.category) return;

    createForum(newForumData);
    setNewForumData({ title: '', description: '', category: '', skill_level: 'all' });
    setIsCreateDialogOpen(false);
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Creator Forums</h2>
          <p className="text-muted-foreground">Connect with fellow creators and share knowledge</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Topic
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Forum Topic</DialogTitle>
              <DialogDescription>
                Start a new discussion in the creator community
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newForumData.title}
                  onChange={(e) => setNewForumData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter topic title..."
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newForumData.category} onValueChange={(value) => setNewForumData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="skill_level">Skill Level</Label>
                <Select value={newForumData.skill_level} onValueChange={(value) => setNewForumData(prev => ({ ...prev, skill_level: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {skillLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newForumData.description}
                  onChange={(e) => setNewForumData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide more details about your topic..."
                  rows={3}
                />
              </div>
              <Button onClick={handleCreateForum} disabled={isCreating} className="w-full">
                {isCreating ? 'Creating...' : 'Create Topic'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedSkillLevel} onValueChange={setSelectedSkillLevel}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Skill Levels" />
          </SelectTrigger>
          <SelectContent>
            {skillLevels.map((level) => (
              <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Forums List */}
      <div className="space-y-4">
        {forums.map((forum) => (
          <Card key={forum.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {forum.is_pinned && <Pin className="w-4 h-4 text-primary" />}
                    {forum.is_locked && <Lock className="w-4 h-4 text-muted-foreground" />}
                    <CardTitle className="text-lg">{forum.title}</CardTitle>
                  </div>
                  {forum.description && (
                    <CardDescription>{forum.description}</CardDescription>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary">{forum.category}</Badge>
                    <Badge className={getSkillLevelColor(forum.skill_level)}>
                      {forum.skill_level}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{forum.reply_count} replies</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{forum.view_count} views</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDistanceToNow(new Date(forum.last_activity), { addSuffix: true })}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <img
                    src={forum.creator?.user_profile?.avatar_url || '/placeholder.svg'}
                    alt={forum.creator?.user_profile?.username || 'Creator'}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm text-muted-foreground">
                    by {forum.creator?.user_profile?.username || 'Unknown'}
                  </span>
                </div>
                <Button variant="outline" size="sm">
                  View Discussion
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {forums.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No forum topics found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Be the first to start a discussion in this category!
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Create First Topic
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
