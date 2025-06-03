"use client";
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const InviteLinkGenerator = () => {
  const [generatedLink, setGeneratedLink] = useState('');

  const handleGenerate = () => {
    const newLinkId = uuidv4();
    setGeneratedLink(`${window.location.origin}/register?invite=${newLinkId}`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">مولد روابط الدعوات [[2]]</h3>
      <div className="flex space-x-4">
        <button 
          onClick={handleGenerate}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          إنشاء رابط دعوة
        </button>
        {generatedLink && (
          <input 
            type="text" 
            value={generatedLink}
            readOnly
            className="p-3 border rounded-lg flex-1"
          />
        )}
      </div>
    </div>
  );
};

export default InviteLinkGenerator;