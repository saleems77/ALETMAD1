'use client';
import { useState } from 'react';
import { toast } from 'react-toastify';

// دالة بديلة لتوليد UUID
const generateToken = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0,
    v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export default function InviteLinkGenerator() {
  const [selectedRole, setSelectedRole] = useState('trainee');
  const [generatedLinks, setGeneratedLinks] = useState([]);

  const generateInviteLink = () => {
    try {
      const token = generateToken().replace(/-/g, '');
      
      const newLink = {
        token,
        role: selectedRole,
        url: `${
          typeof window !== 'undefined' 
            ? window.location.origin 
            : 'http://localhost:3000'
        }/register/${token}?role=${selectedRole}`,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      };

      // معالجة التخزين المحلي بشكل آمن
      const existingLinks = 
        JSON.parse(localStorage.getItem('inviteLinks') || '[]');
      
      const updatedLinks = [...existingLinks, newLink];
      localStorage.setItem('inviteLinks', JSON.stringify(updatedLinks));
      
      setGeneratedLinks([newLink, ...existingLinks]);
      toast.success('تم إنشاء رابط الدعوة بنجاح!');
    } catch (error) {
      toast.error('حدث خطأ أثناء إنشاء الرابط');
      console.error('Invite generation error:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">مولد روابط الدعوة</h2>
        <div className="mt-4 flex gap-4 items-center">
          <select 
            className="p-2 border rounded-lg w-48"
            onChange={(e) => setSelectedRole(e.target.value)}
            value={selectedRole}
          >
            <option value="trainee">متدرب</option>
            <option value="assistant">مساعد دورة</option>
            <option value="staff">فريق إداري</option>
          </select>

          <button
            onClick={generateInviteLink}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            توليد رابط
          </button>
        </div>
      </div>

      {generatedLinks.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">الروابط المولدة:</h3>
          <div className="space-y-2">
            {generatedLinks.map((link, index) => (
              <div 
                key={index}
                className="p-3 bg-gray-50 rounded-lg border flex flex-col md:flex-row justify-between items-start md:items-center gap-2"
              >
                <div className="flex-1">
                  <code className="text-blue-600 break-all">{link.url}</code>
                </div>
                <div className="text-sm text-gray-500 whitespace-nowrap">
                  صلاحية حتى: {new Date(link.expires).toLocaleDateString('ar-EG')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}