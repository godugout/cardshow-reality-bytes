
import { Suspense } from 'react';
import Navigation from '@/components/layout/Navigation';
import CardSourcingTool from '@/components/admin/CardSourcingTool';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Star, BookOpen, Zap } from 'lucide-react';

const AdminContentGenerator = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container-xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-display-lg text-foreground mb-2 flex items-center gap-3">
            <Database className="w-8 h-8 text-primary" />
            Content Generator
          </h1>
          <p className="text-body-lg text-muted-foreground">
            Populate your catalog with themed collections and test content
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-body-md flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" />
                Featured Cards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-display-sm font-bold">0</div>
              <div className="text-body-xs text-muted-foreground">High-quality showcase cards</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-body-md flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                Collections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-display-sm font-bold">0</div>
              <div className="text-body-xs text-muted-foreground">Themed collections created</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-body-md flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-500" />
                Total Cards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-display-sm font-bold">0</div>
              <div className="text-body-xs text-muted-foreground">Cards in catalog</div>
            </CardContent>
          </Card>
        </div>

        <Suspense fallback={
          <div className="flex justify-center py-8">
            <div className="text-muted-foreground">Loading content generator...</div>
          </div>
        }>
          <CardSourcingTool />
        </Suspense>
      </div>
    </div>
  );
};

export default AdminContentGenerator;
