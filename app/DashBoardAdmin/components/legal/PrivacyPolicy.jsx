"use client"
import LegalPageLayout from './LegalPageLayout';
import { privacyContent } from './legalContent';
import DataConsent from './DataConsent';

export default function PrivacyPolicy() {
  return (
    <LegalPageLayout title="سياسة الخصوصية">
      <div className="space-y-8">
        {/* المحتوى الديناميكي */}
        {privacyContent.sections.map((section, index) => (
          <section key={index} className="border-b pb-8">
            <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
            <div className="space-y-4 text-gray-600">
              {section.content.map((paragraph, pIndex) => (
                <p key={pIndex}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
        
        {/* مكون إدارة الموافقة */}
        <DataConsent />
      </div>
    </LegalPageLayout>
  );
}