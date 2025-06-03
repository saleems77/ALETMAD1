import LegalPageLayout from '../LegalPageLayout';
import { termsContent } from '@/data/legalContent';
import AcceptTerms from './AcceptTerms';

export default function TermsOfService() {
  return (
    <LegalPageLayout title="شروط وأحكام الاستخدام">
      <div className="space-y-8">
        {termsContent.sections.map((section, index) => (
          <section key={index} className="border-b pb-8">
            <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
            <ul className="list-decimal list-outside space-y-3 pl-6">
              {section.clauses.map((clause, cIndex) => (
                <li key={cIndex} className="text-gray-600">
                  {clause.text}
                  {clause.subclauses && (
                    <ul className="list-disc pl-6 mt-2">
                      {clause.subclauses.map((sub, sIndex) => (
                        <li key={sIndex}>{sub}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
        
        <AcceptTerms />
      </div>
    </LegalPageLayout>
  );
}