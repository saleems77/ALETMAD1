// selfDashboard.js
"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreateAssessmentForm from './CreateAssessmentForm';
import InvitationsPage from './InvitationsPage';
import ResultsPage from './ResultsPage';
import ProtectedRoute from '../../../DashBoardAdmin/components/ProtectedRoute';
import { FilePlus, Send, BarChart3 } from 'lucide-react';

const SelfDashboard = () => {
  return (
    <ProtectedRoute>
      <div className="bg-white min-h-screen">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-black mb-2">لوحة تحكم المدرب</h1>
            <p className="text-lg text-gray">
              أداتك المركزية لإنشاء التقييمات، تتبع الدعوات، وتحليل النتائج بكفاءة.
            </p>
          </header>
          
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger value="create" className="flex items-center gap-2 data-[state=active]:bg-blue data-[state=active]:text-white rounded-md">
                <FilePlus size={18} />
                <span>إنشاء تقييم</span>
              </TabsTrigger>
              <TabsTrigger value="invitations" className="flex items-center gap-2 data-[state=active]:bg-blue data-[state=active]:text-white rounded-md">
                <Send size={18} />
                <span>الدعوات</span>
              </TabsTrigger>
              <TabsTrigger value="results" className="flex items-center gap-2 data-[state=active]:bg-blue data-[state=active]:text-white rounded-md">
                <BarChart3 size={18} />
                <span>النتائج</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="create" className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <CreateAssessmentForm />
            </TabsContent>
            
            <TabsContent value="invitations" className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <InvitationsPage />
            </TabsContent>
            
            <TabsContent value="results" className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <ResultsPage />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default SelfDashboard;
