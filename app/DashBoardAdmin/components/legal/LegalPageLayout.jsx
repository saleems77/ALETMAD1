'use client';
import LegalHeader from './LegalHeader';
import LegalFooter from './LegalFooter';
import NavigationTabs from './NavigationTabs';
import ConsentManager from './ConsentManager';

export default function LegalPageLayout({ children, title }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <LegalHeader />
      
      <main className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
            <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
            <NavigationTabs />
          </div>

          <div className="prose lg:prose-xl max-w-none">
            {children}
          </div>

          <ConsentManager />
        </div>
      </main>

      <LegalFooter />
    </div>
  );
}