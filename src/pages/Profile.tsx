
import { Suspense } from 'react';
import Navigation from '@/components/layout/Navigation';
import { Skeleton } from '@/components/ui/skeleton';

const Profile = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container-xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-display-lg text-foreground mb-2">My Profile</h1>
          <p className="text-body-lg text-muted-foreground">
            Manage your account settings and view your activity
          </p>
        </div>

        <Suspense fallback={
          <div className="space-y-6">
            <div className="flex items-center space-x-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        }>
          <div className="bg-card rounded-lg border border-border p-6">
            <p className="text-muted-foreground text-center">
              Profile management coming soon...
            </p>
          </div>
        </Suspense>
      </div>
    </div>
  );
};

export default Profile;
