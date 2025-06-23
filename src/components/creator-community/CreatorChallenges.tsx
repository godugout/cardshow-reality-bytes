
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Trophy, Calendar, Users, DollarSign, Clock, Target } from 'lucide-react';
import { useCreatorChallenges, useChallengeSubmissions } from '@/hooks/creator-community/useCreatorChallenges';
import { formatDistanceToNow, format } from 'date-fns';

export default function CreatorChallenges() {
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedChallenge, setSelectedChallenge] = useState<string>('');
  const [isSubmissionDialogOpen, setIsSubmissionDialogOpen] = useState(false);
  const [submissionData, setSubmissionData] = useState({
    submission_title: '',
    submission_description: '',
    card_id: ''
  });

  const { challenges, isLoading } = useCreatorChallenges(selectedStatus);
  const { submissions, submitToChallenge, isSubmitting } = useChallengeSubmissions(selectedChallenge);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'judging': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = (challenge: any) => {
    if (!challenge.max_participants) return 0;
    return (challenge.current_participants / challenge.max_participants) * 100;
  };

  const handleSubmitToChallenge = () => {
    if (!submissionData.submission_title) return;

    submitToChallenge(submissionData);
    setSubmissionData({ submission_title: '', submission_description: '', card_id: '' });
    setIsSubmissionDialogOpen(false);
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
          <h2 className="text-2xl font-bold">Creator Challenges</h2>
          <p className="text-muted-foreground">Compete with other creators and win prizes</p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        {['', 'upcoming', 'active', 'judging', 'completed'].map((status) => (
          <Button
            key={status}
            variant={selectedStatus === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedStatus(status)}
          >
            {status === '' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => (
          <Card key={challenge.id} className="relative overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg mb-2">{challenge.title}</CardTitle>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge className={getStatusColor(challenge.status)}>
                      {challenge.status}
                    </Badge>
                    <Badge className={getDifficultyColor(challenge.difficulty_level)}>
                      {challenge.difficulty_level}
                    </Badge>
                  </div>
                </div>
                {challenge.prize_pool && (
                  <div className="flex items-center gap-1 text-green-600">
                    <Trophy className="w-4 h-4" />
                    <span className="font-semibold">${challenge.prize_pool}</span>
                  </div>
                )}
              </div>
              <CardDescription className="line-clamp-3">
                {challenge.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Timeline */}
              <div className="space-y-2 text-sm">
                {challenge.start_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Starts: {format(new Date(challenge.start_date), 'MMM d, yyyy')}</span>
                  </div>
                )}
                {challenge.submission_deadline && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>Deadline: {format(new Date(challenge.submission_deadline), 'MMM d, yyyy')}</span>
                  </div>
                )}
              </div>

              {/* Participants */}
              {challenge.max_participants && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>Participants</span>
                    </div>
                    <span>{challenge.current_participants}/{challenge.max_participants}</span>
                  </div>
                  <Progress value={getProgressPercentage(challenge)} className="h-2" />
                </div>
              )}

              {/* Entry Fee */}
              {challenge.entry_fee > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span>Entry Fee: ${challenge.entry_fee}</span>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2">
                {challenge.status === 'active' ? (
                  <Dialog open={isSubmissionDialogOpen} onOpenChange={setIsSubmissionDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full" 
                        onClick={() => setSelectedChallenge(challenge.id)}
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Submit Entry
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Submit to Challenge</DialogTitle>
                        <DialogDescription>
                          Submit your entry for "{challenge.title}"
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="submission_title">Submission Title</Label>
                          <Input
                            id="submission_title"
                            value={submissionData.submission_title}
                            onChange={(e) => setSubmissionData(prev => ({ ...prev, submission_title: e.target.value }))}
                            placeholder="Enter your submission title..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="submission_description">Description</Label>
                          <Textarea
                            id="submission_description"
                            value={submissionData.submission_description}
                            onChange={(e) => setSubmissionData(prev => ({ ...prev, submission_description: e.target.value }))}
                            placeholder="Describe your submission..."
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="card_id">Card ID (Optional)</Label>
                          <Input
                            id="card_id"
                            value={submissionData.card_id}
                            onChange={(e) => setSubmissionData(prev => ({ ...prev, card_id: e.target.value }))}
                            placeholder="Link a card to your submission..."
                          />
                        </div>
                        <Button onClick={handleSubmitToChallenge} disabled={isSubmitting} className="w-full">
                          {isSubmitting ? 'Submitting...' : 'Submit Entry'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : challenge.status === 'upcoming' ? (
                  <Button variant="outline" className="w-full" disabled>
                    <Clock className="w-4 h-4 mr-2" />
                    Starts {formatDistanceToNow(new Date(challenge.start_date!), { addSuffix: true })}
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full">
                    View Results
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {challenges.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Trophy className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No challenges found</h3>
            <p className="text-muted-foreground text-center">
              Check back later for new challenges and competitions!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
