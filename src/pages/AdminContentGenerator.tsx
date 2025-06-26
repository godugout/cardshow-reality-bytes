
import { Suspense } from 'react';
import Header from '@/components/Header';
import CardSourcingTool from '@/components/admin/CardSourcingTool';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Star, BookOpen, Zap } from 'lucide-react';

const AdminContentGenerator = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Database className="w-8 h-8 text-[#00C851]" />
            Content Generator
          </h1>
          <p className="text-gray-400 text-lg">
            Populate your catalog with themed collections and test content
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Star className="w-4 h-4 text-[#00C851]" />
                Featured Cards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-gray-400 text-xs">High-quality showcase cards</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                Collections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-gray-400 text-xs">Themed collections created</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-500" />
                Total Cards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-gray-400 text-xs">Cards in catalog</div>
            </CardContent>
          </Card>
        </div>

        <Suspense fallback={
          <div className="flex justify-center py-8">
            <div className="text-gray-400">Loading content generator...</div>
          </div>
        }>
          <CardSourcingTool />
        </Suspense>
      </div>
    </div>
  );
};

export default AdminContentGenerator;
