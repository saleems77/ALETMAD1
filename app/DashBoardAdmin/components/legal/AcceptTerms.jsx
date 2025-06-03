'use client';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';

export default function AcceptTerms() {
  const [cookies, setCookie] = useCookies(['terms_accepted']);
  const [accepted, setAccepted] = useState(cookies.terms_accepted === 'true');

  const handleAccept = () => {
    setAccepted(true);
    setCookie('terms_accepted', 'true', {
      path: '/',
      maxAge: 31536000 // سنة واحدة
    });
  };

  return (
    <div className="mt-8 p-6 bg-green-50 rounded-lg">
      {!accepted ? (
        <div className="flex items-center gap-4">
          <DocumentArrowUpIcon className="w-8 h-8 text-green-600" />
          <div>
            <p className="font-medium">يجب الموافقة على الشروط</p>
            <button 
              onClick={handleAccept}
              className="mt-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              أوافق على الشروط والأحكام
            </button>
          </div>
        </div>
      ) : (
        <div className="text-green-600 font-medium flex items-center gap-2">
          <CheckCircleIcon className="w-5 h-5" />
          <span>تم قبول الشروط بنجاح</span>
        </div>
      )}
    </div>
  );
}