"use client";
import { useState } from 'react';
import { generateInvitationLink } from '../../../../services/couponData';
import { MdContentCopy, MdLink } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import InvitationLinkList from './InvitationLinkList';
import { FaLink, FaPlus } from 'react-icons/fa';

const InvitationLink = ({ courseDocumentId }) => {
  const [link, setLink] = useState('');
  const [linkCode, setLinkCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const newLink = await generateInvitationLink(courseDocumentId);
      setLinkCode(newLink.data.linkCode);
      setLink(`${window.location.origin}/join?code=${newLink.data.linkCode}`);
      toast.success('تم إنشاء الرابط بنجاح', {
        icon: '🔗',
        style: {
          background: '#f0fdf4',
          color: '#166534',
          border: '1px solid #bbf7d0'
        },
        duration: 3000
      });
    } catch (error) {
      toast.error('فشل إنشاء الرابط', {
        style: {
          background: '#fef2f2',
          color: '#b91c1c',
          border: '1px solid #fecaca'
        }
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!link) return;
    
    navigator.clipboard.writeText(link);
    toast('تم نسخ الرابط', { 
      icon: '📋',
      style: {
        background: '#f0f9ff',
        color: '#0369a1',
        border: '1px solid #bae6fd'
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* نموذج إنشاء رابط جديد */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <FaLink className="text-blue-500" />
          إنشاء رابط دعوة جديد
        </h3>
        
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              جاري الإنشاء...
            </>
          ) : (
            <>
              <FaPlus />
              إنشاء رابط دعوة
            </>
          )}
        </button>
        
        {link && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">رابط الدعوة</label>
            <div className="flex rounded-lg shadow-sm">
              <span className="px-4 inline-flex items-center min-w-fit rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                <MdLink />
              </span>
              <input
                type="text"
                readOnly
                value={link}
                className="py-3 px-4 block w-full border-gray-300 border-y rounded-l-none rounded-r-lg focus:z-10 focus:border-blue-500 focus:ring-blue-500"
              />
              <button 
                onClick={handleCopy} 
                className="ml-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:pointer-events-none"
              >
                <MdContentCopy className="text-xl" />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* قائمة روابط الدعوة الحالية */}
      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
          <FaLink className="text-blue-500" />
          روابط الدعوة الحالية
        </h3>
        <InvitationLinkList courseDocumentId={courseDocumentId} />
      </div>
    </div>
  );
};

export default InvitationLink;