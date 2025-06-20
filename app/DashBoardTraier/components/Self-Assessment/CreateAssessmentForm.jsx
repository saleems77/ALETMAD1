// CreateAssessmentForm.js
"use client";
import { useState , useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2, Loader2 } from 'lucide-react';

const CreateAssessmentForm = () => {
  const [questions, setQuestions] = useState([{ id: 1, text: '' }]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userDocumentId, setUserDocumentId] = useState(null);

  const addQuestion = () => {
    setQuestions([...questions, { id: Date.now(), text: '' }]);
  };
useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.documentId) {
      setUserDocumentId(user.documentId);
    }
  }, []);
  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleQuestionChange = (id, text) => {
    const newQuestions = questions.map(q => q.id === id ? { ...q, text } : q);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('jwt');
      const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      // التحقق من وجود documentId للمستخدم
      if (!userDocumentId) {
        throw new Error('User documentId not found. Please log in again.');
      }
      
      // إنشاء التقييم مع documentId المستخدم الفعلي
      const assessmentRes = await fetch(`${strapiUrl}/assessments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            title,
            description,
            users_permissions_user: userDocumentId // استخدام documentId الفعلي
          }
        })
      });
      
      if (!assessmentRes.ok) {
        const errorData = await assessmentRes.json();
        throw new Error(errorData.error?.message || 'Failed to create assessment');
      }
      
      const assessmentData = await assessmentRes.json();
      const assessmentDocumentId = assessmentData.data.documentId;

      if (!assessmentDocumentId) {
        throw new Error('Failed to get assessment documentId');
      }

      // إنشاء الأسئلة
      const questionPromises = questions.map(question => 
        fetch(`${strapiUrl}/question-assessments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              title: question.text,
              assessment: assessmentDocumentId
            }
          })
        })
      );

      const questionResponses = await Promise.all(questionPromises);
      
      // التحقق من الأخطاء في إنشاء الأسئلة
      for (const res of questionResponses) {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error?.message || 'Failed to create question');
        }
      }

      alert('✅ تم إنشاء التقييم بنجاح!');
      setTitle('');
      setDescription('');
      setQuestions([{ id: 1, text: '' }]);
      
    } catch (err) {
      console.error('Error creating assessment:', err);
      setError(err.message || 'فشل إنشاء التقييم');
      alert(`❌ خطأ: ${err.message || 'فشل إنشاء التقييم'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-black mb-4">إنشاء تقييم جديد</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium text-gray-700">عنوان التقييم</label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثال: تقييم مهارات التواصل"
            required
            className="w-full px-4 py-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium text-gray-700">وصف التقييم (اختياري)</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="أضف وصفًا موجزًا لمساعدة الطلاب على فهم الغرض من هذا التقييم."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 min-h-[100px]"
          />
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700">الأسئلة</label>
          
          {questions.map((q, index) => (
            <div key={q.id} className="flex items-center gap-2 bg-white p-3 rounded-md border">
              <span className="text-gray-500">{index + 1}.</span>
              <Input
                value={q.text}
                onChange={(e) => handleQuestionChange(q.id, e.target.value)}
                placeholder={`السؤال ${index + 1}`}
                required
                className="flex-grow border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <Button
                type="button"
                onClick={() => removeQuestion(q.id)}
                variant="ghost"
                size="icon"
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                aria-label="حذف السؤال"
              >
                <Trash2 size={18} />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6">
          <Button 
            type="button" 
            onClick={addQuestion} 
            variant="outline" 
            className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
          >
            <PlusCircle size={18} className="mr-2" />
            إضافة سؤال
          </Button>
          
          <Button 
            type="submit" 
            disabled={loading} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors duration-200"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                جاري الإنشاء...
              </>
            ) : (
              'إنشاء التقييم'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateAssessmentForm;