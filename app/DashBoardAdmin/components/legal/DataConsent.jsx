'use client';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function DataConsent() {
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    const consent = Cookies.get('data_consent');
    setConsentGiven(consent === 'true');
  }, []);

  const handleConsent = (value) => {
    setConsentGiven(value);
    Cookies.set('data_consent', value.toString(), {
      expires: 365, // عدد الأيام (سنة واحدة)
      path: '/',
    });
  };

  return (
    <div className="mt-8 p-6 bg-blue-50 rounded-lg">
      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          checked={consentGiven}
          onChange={(e) => handleConsent(e.target.checked)}
          className="mt-1 h-5 w-5 text-blue-600"
        />
        <div>
          <p className="font-medium">موافقة على معالجة البيانات</p>
          <p className="text-sm text-gray-600 mt-1">
            أوافق على جمع ومعالجة بياناتي الشخصية وفقًا لسياسة الخصوصية المذكورة أعلاه.
          </p>
        </div>
      </div>
    </div>
  );
}
