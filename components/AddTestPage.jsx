"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Trash2, Check, X, Type, List, ToggleRight } from 'lucide-react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuth } from '@/store/slices/authSlice';

const AddTestPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');
  const courseName = searchParams.get('courseName');
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading: authLoading } = useSelector((state) => state.auth);
  
  // Component states
  const [questions, setQuestions] = useState([{
    id: 1,
    type: 'multiple-choice',
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    blankAnswer: '',
    trueFalseAnswer: true
  }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testSaved, setTestSaved] = useState(false);

  // Question types configuration
  const questionTypes = [
    { value: 'multiple-choice', label: 'اختيار متعدد', icon: <List className="w-4 h-4" /> },
    { value: 'fill-blank', label: 'املأ الفراغ', icon: <Type className="w-4 h-4" /> },
    { value: 'true-false', label: 'صح/خطأ', icon: <ToggleRight className="w-4 h-4" /> }
  ];

  // Initialize authentication check
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Validate form before submission
  const validateForm = () => {
    if (!questions.length) {
      setError('يرجى إضافة سؤال واحد على الأقل');
      return false;
    }
    
    for (const [index, q] of questions.entries()) {
      if (!q.text.trim()) {
        setError(`السؤال ${index + 1}: نص السؤال مطلوب`);
        return false;
      }
      
      if (q.type === 'multiple-choice') {
        const validOptions = q.options.filter(opt => opt.trim() !== '');
        if (validOptions.length < 2) {
          setError(`السؤال ${index + 1}: يحتاج إلى خيارين صالحين على الأقل`);
          return false;
        }
        if (q.correctAnswer < 0 || q.correctAnswer >= validOptions.length) {
          setError(`السؤال ${index + 1}: اختر إجابة صحيحة صالحة`);
          return false;
        }
      }
      
      if (q.type === 'fill-blank' && !q.blankAnswer.trim()) {
        setError(`السؤال ${index + 1}: الإجابة الصحيحة مطلوبة`);
        return false;
      }
    }
    
    setError(null);
    return true;
  };

  // Handle option changes for multiple choice questions
  const handleOptionChange = (questionId, optionIndex, value) => {
    setQuestions(prev =>
      prev.map(q =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, i) =>
                i === optionIndex ? value : opt
              ),
            }
          : q
      )
    );
  };

  // Get correct answer based on question type
  const getCorrectAnswer = (question) => {
    switch(question.type) {
      case 'multiple-choice':
        return question.options[question.correctAnswer] || '';
      case 'fill-blank':
        return question.blankAnswer || '';
      case 'true-false':
        return question.trueFalseAnswer.toString();
      default:
        return '';
    }
  };

  // Add new question
  const addQuestion = (type) => {
  setQuestions(prev => [...prev, {
    id: prev.length + 1,
    type,
    text: '',
    options: type === 'multiple-choice' ? ['', '', '', ''] : [],
    correctAnswer: 0,
    blankAnswer: '',
    trueFalseAnswer: true
  }]);
};

  // Remove question
  const removeQuestion = (id) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  // Handle question field changes
  const handleQuestionChange = (questionId, field, value) => {
  setQuestions(prev => 
    prev.map(q => 
      q.id === questionId ? { ...q, [field]: value } : q
    )
  );
};
  // Handle form submission
  const handleSubmit = async () => {
   
    try {
      setLoading(true);
      setError('');
      
      // Validate form
      if (!validateForm()) {
        setLoading(false);
        return;
      }

      // Check authentication
      const token = localStorage.getItem('jwt');
      if (!token) {
        setError('يرجى تسجيل الدخول مجددًا');
        router.push('/login');
        return;
      }

      // Create entry test
      const testResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/entry-tests`,
        {
          data: {
            title: `اختبار ${courseName}`,
            course: courseId,
            description: null
          }
        },
        {
          headers: {
Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Create questions
      await Promise.all(questions.map(async (question) => {
        
        const questionData = {
          type: question.type,
          text: question.text.trim(),
          options: question.type === 'multiple-choice' 
            ? question.options.filter(opt => opt.trim()).map(opt => opt.trim()) 
            : [],
          correctAnswer: getCorrectAnswer(question),
          entry_test: testResponse.data.data.id
        };
        
        await axios.post(
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/questions`,
          { data: questionData },
          {
            headers: {
             Authorization: `Bearer ${localStorage.getItem('jwt')}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }));
      
      // Set test saved flag and redirect
      setTestSaved(true);
      setTimeout(() => {
        router.push("/DashBoardTraier/Courses");
      }, 2000);
      
    } catch (error) {
      console.error('Error saving test:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 401) {
        setError('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجددًا');
        router.push('/login');
      } else {
        const errorMessage = error.response?.data?.error?.message || 
                           error.message || 
                           'حدث خطأ أثناء حفظ الاختبار';
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
    console.log("Question data:", {
  type: question.type,
  text: question.text,
  options: question.options,
  correctAnswer: getCorrectAnswer(question)
});
  };

  // Component rendering functions
  const QuestionInput = ({ question }) => {
  if (!question) return null; // منع الوصول إلى خاصيات غير معرفة

  return (
    <div className="space-y-6">
      <div className="flex gap-3 items-start">
        <select
          value={question.type}
          onChange={(e) => handleQuestionChange(question.id, 'type', e.target.value)}
          className="w-40 px-3 py-2 border-2 border-purple-200 rounded-xl bg-white text-purple-600 font-semibold"
        >
          {questionTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => removeQuestion(question.id)}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      <div>
        <label className="block text-gray-700 text-lg font-semibold mb-3">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-lg mr-2">
            {question.id}
          </span>
          نص السؤال
        </label>
        <textarea
          required
          value={question.text}
          onChange={(e) => handleQuestionChange(question.id, 'text', e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all resize-none"
          placeholder="أدخل نص السؤال هنا..."
          rows="2"
        />
      </div>
    </div>
  );
};

  const MultipleChoiceOptions = ({ question }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {question.options.map((option, index) => (
        <div key={index} className="flex items-center gap-3">
          <input
            type="text"
            required
            value={option}
            onChange={(e) => handleOptionChange(question.id, index, e.target.value)}
            className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-300 transition-all"
            placeholder={`الاختيار ${index + 1}`}
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => handleQuestionChange(question.id, 'correctAnswer', index)}
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all
              ${question.correctAnswer === index 
                ? 'bg-green-500 text-white shadow-lg'
                : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
            disabled={loading}
          >
            {question.correctAnswer === index ? <Check /> : index + 1}
          </button>
        </div>
      ))}
    </div>
  );

  const FillBlankOption = ({ question }) => (
    <div className="bg-yellow-50 p-4 rounded-xl border-2 border-yellow-200">
      <label className="block text-yellow-800 font-semibold mb-2">الإجابة الصحيحة:</label>
      <input
        type="text"
        required
        value={question.blankAnswer}
        onChange={(e) => handleQuestionChange(question.id, 'blankAnswer', e.target.value)}
        className="w-full px-4 py-2 border-2 border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
        placeholder="أدخل الإجابة الصحيحة..."
        disabled={loading}
      />
    </div>
  );

  const TrueFalseOption = ({ question }) => (
    <div className="flex gap-4 justify-center">
      {[true, false].map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => handleQuestionChange(question.id, 'trueFalseAnswer', value)}
          className={`px-8 py-3 rounded-xl text-lg font-semibold flex items-center gap-2 transition-all
            ${question.trueFalseAnswer === value
              ? 'bg-green-500 text-white shadow-lg'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
          disabled={loading}
        >
          {value ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
          {value ? 'صح' : 'خطأ'}
        </button>
      ))}
    </div>
  );

  // Render component
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
              <PlusCircle className="w-12 h-12 text-blue-600" />
              اختبار جديد - {courseName}
            </h1>
            
            {/* Success message */}
            {testSaved && (
              <div className="text-green-600 bg-green-100 p-3 rounded-lg mt-4">
                تم حفظ الاختبار بنجاح!
              </div>
            )}
            
            {/* Error message */}
            {error && (
              <div className="text-red-600 bg-red-100 p-3 rounded-lg mt-4">
                {error}
              </div>
            )}
          </div>
          
          {/* Questions list */}
         <AnimatePresence>
  {questions.map((question) => (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-8 p-6 rounded-2xl border-2 border-gray-100 hover:border-blue-200 transition-all"
    >
      <QuestionInput question={question} />
      {question.type === 'multiple-choice' && <MultipleChoiceOptions question={question} />}
      {question.type === 'fill-blank' && <FillBlankOption question={question} />}
      {question.type === 'true-false' && <TrueFalseOption question={question} />}
    </motion.div>
  ))}
</AnimatePresence>
          
          {/* Add question buttons */}
          <div className="flex flex-wrap gap-4 mt-8">
            {questionTypes.map((type) => (
              <motion.button
                key={type.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => addQuestion(type.value)}
                disabled={loading}
                className="px-6 py-3 bg-blue-100 text-blue-600 rounded-xl flex items-center gap-2 hover:bg-blue-200"
              >
                {type.icon}
                {type.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
        
        {/* Save button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 px-8 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              جاري الحفظ...
            </div>
          ) : (
            'حفظ الاختبار النهائي'
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default AddTestPage;