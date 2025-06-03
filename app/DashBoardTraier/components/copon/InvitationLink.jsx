"use client"
import { useState } from 'react';
import { generateInvitationLink } from './mocks/couponData';
import { MdContentCopy } from 'react-icons/md';
import { toast } from 'react-hot-toast';

const InvitationLink = () => {
  const [link, setLink] = useState('');

  const handleGenerate = () => {
    const newLink = generateInvitationLink();
    setLink(newLink);
    toast.success('تم إنشاء الرابط بنجاح');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    toast('تم نسخ الرابط', { icon: '📋' });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm space-y-4">
      <button
        onClick={handleGenerate}
        className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
      >
        إنشاء رابط دعوة
      </button>
      {link && (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            readOnly
            value={link}
            className="p-3 border rounded-lg flex-1 bg-gray-100"
          />
          <button onClick={handleCopy} className="p-2 bg-gray-200 rounded-lg">
            <MdContentCopy size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default InvitationLink;