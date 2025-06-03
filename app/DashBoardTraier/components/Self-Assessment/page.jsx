import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreateAssessmentForm from './CreateAssessmentForm';
import InvitationsPage from './InvitationsPage';
import ResultsPage from './ResultsPage';

const selfDashboard = () => {
  return (
    <Tabs defaultValue="create">
      <TabsList>
        <TabsTrigger value="create">إنشاء تقييم</TabsTrigger>
        <TabsTrigger value="invitations">الدعوات</TabsTrigger>
        <TabsTrigger value="results">النتائج</TabsTrigger>
      </TabsList>
      <TabsContent value="create">
        <CreateAssessmentForm />
      </TabsContent>
      <TabsContent value="invitations">
        <InvitationsPage />
      </TabsContent>
      <TabsContent value="results">
        <ResultsPage />
      </TabsContent>
    </Tabs>
  );
};

export default selfDashboard;