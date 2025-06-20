"use client";
import { useState, useEffect } from 'react';
import { DataTable } from './DataTable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, MailCheck, MailX, Loader2, RefreshCw } from 'lucide-react';

const InvitationsPage = () => {
  const [invitations, setInvitations] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessmentDocumentId, setSelectedAssessmentDocumentId] = useState('');
  const [assessmentLoading, setAssessmentLoading] = useState(true);

  useEffect(() => {
    fetchInvitations();
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    setAssessmentLoading(true);
    try {
      const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
      const token = localStorage.getItem('jwt');
      
      const res = await fetch(`${strapiUrl}/assessments?fields[0]=title&fields[1]=documentId`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) throw new Error('فشل جلب التقييمات');
      
      const { data } = await res.json();
      
      setAssessments(data.map(assess => ({
        documentId: assess.documentId,
        title: assess.title
      })));
    } catch (error) {
      console.error('Error fetching assessments:', error);
    } finally {
      setAssessmentLoading(false);
    }
  };

  const fetchInvitations = async () => {
    setFetching(true);
    try {
      const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
      const token = localStorage.getItem('jwt');
      const res = await fetch(`${strapiUrl}/invitations?populate[assessment][fields][0]=title`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const { data } = await res.json();
      
      const formattedData = data.map(inv => ({
        id: inv.documentId,
        email: inv.student_email,
        status: inv.statu,
        assessmentTitle: inv.assessment?.data?.title || 'N/A',
      }));
      
      setInvitations(formattedData);
    } catch (error) {
      console.error('Error fetching invitations:', error);
    } finally {
      setFetching(false);
    }
  };

  const sendInvitation = async () => {
  if (!newEmail || !/^\S+@\S+\.\S+$/.test(newEmail)) {
    alert('الرجاء إدخال بريد إلكتروني صحيح.');
    return;
  }

  if (!selectedAssessmentDocumentId) {
    alert('الرجاء اختيار تقييم من القائمة.');
    return;
  }

  setLoading(true);
  try {
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const token = localStorage.getItem('jwt');

    // التحقق من وجود البريد الإلكتروني
    const checkRes = await fetch(
      `${strapiUrl}/invitations?filters[student_email][$eq]=${newEmail}`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );

    const checkData = await checkRes.json();
    
    if (checkData.data && checkData.data.length > 0) {
      alert('البريد الإلكتروني موجود بالفعل');
      return;
    }

    // إرسال الدعوة مع تحديد التقييم باستخدام documentId
    const response = await fetch(`${strapiUrl}/invitations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          student_email: newEmail,
          statu: "'pending'", // تم إضافة علامات الاقتباس المفردة هنا
          assessment: selectedAssessmentDocumentId
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'فشل إنشاء الدعوة');
    }

    setNewEmail('');
    setSelectedAssessmentDocumentId('');
    fetchInvitations();
    alert('✅ تم إرسال الدعوة بنجاح!');
  } catch (error) {
    console.error('Error sending invitation:', error);
    alert(`❌ خطأ: ${error.message || 'فشل إرسال الدعوة'}`);
  } finally {
    setLoading(false);
  }
};

  const resendInvitation = async (email) => {
    console.log('Resending invitation to:', email);
    alert(`إعادة إرسال الدعوة إلى ${email}`);
  };

  const columns = [
    { accessorKey: 'email', header: 'البريد الإلكتروني' },
    { accessorKey: 'assessmentTitle', header: 'عنوان التقييم' },
    { 
      accessorKey: 'status', 
      header: 'الحالة',
      cell: ({ row }) => {
        const status = row.original.status;
        const statusConfig = {
          completed: { text: 'مكتمل', color: 'blue', icon: <MailCheck size={14} /> },
          sent: { text: 'تم الإرسال', color: 'green', icon: <MailCheck size={14} /> },
          pending: { text: 'في الانتظار', color: 'yellow', icon: <Loader2 size={14} className="animate-spin" /> },
          default: { text: status, color: 'gray', icon: <MailX size={14} /> }
        };
        const config = statusConfig[status] || statusConfig.default;
        
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
            {config.icon}
            {config.text}
          </span>
        );
      }
    },
    {
      id: 'actions',
      header: 'الإجراءات',
      cell: ({ row }) => (
        <Button
          onClick={() => resendInvitation(row.original.email)}
          variant="ghost"
          size="sm"
          className="text-blue hover:bg-blue/10"
        >
          <RefreshCw size={14} className="mr-2" />
          إعادة الإرسال
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="p-4 border rounded-lg bg-white">
        <h3 className="text-lg font-medium text-black mb-2">إرسال دعوة جديدة</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="assessment" className="text-sm font-medium text-gray-700">اختر التقييم</label>
            {assessmentLoading ? (
              <div className="text-center py-2">
                <Loader2 size={18} className="animate-spin text-blue-600 mx-auto" />
              </div>
            ) : (
              <select
                id="assessment"
                value={selectedAssessmentDocumentId}
                onChange={(e) => setSelectedAssessmentDocumentId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- اختر تقييماً --</option>
                {assessments.map(assess => (
                  <option key={assess.documentId} value={assess.documentId}>
                    {assess.title}
                  </option>
                ))}
              </select>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="البريد الإلكتروني للطالب"
              className="flex-grow border-gray-300 focus:border-blue focus:ring-blue"
            />
            <Button 
              onClick={sendInvitation} 
              disabled={loading || !selectedAssessmentDocumentId} 
              className="bg-blue hover:bg-blue/90 text-white"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              <span className="ml-2">{loading ? 'جاري الإرسال...' : 'إرسال'}</span>
            </Button>
          </div>
        </div>
      </div>

      {fetching ? (
        <div className="text-center py-10 text-gray">
          <Loader2 size={24} className="mx-auto animate-spin mb-2" />
          جاري تحميل الدعوات...
        </div>
      ) : (
        <DataTable columns={columns} data={invitations} />
      )}
    </div>
  );
};

export default InvitationsPage;