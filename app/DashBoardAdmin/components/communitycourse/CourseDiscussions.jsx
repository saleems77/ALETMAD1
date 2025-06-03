import { useState } from 'react';
import { getCourseDiscussions } from '@/mocks/communityData';
import { DiscussionThread } from './DiscussionThread';

const CourseDiscussions = ({ courseId }) => {
  const [threads, setThreads] = useState([]);
  const [newThread, setNewThread] = useState('');

  useEffect(() => {
    // جلب بيانات النقاشات الخاصة بالدورة
    setThreads(getCourseDiscussions(courseId));
  }, [courseId]);

  const handleAddThread = () => {
    if (newThread.trim()) {
      const newThreadId = Date.now();
      setThreads([...threads, { 
        id: newThreadId, 
        title: newThread,
        author: "مستخدم جديد",
        replies: []
      }]);
      setNewThread('');
    }
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <input 
          type="text" 
          value={newThread}
          onChange={(e) => setNewThread(e.target.value)}
          placeholder="أضف موضوع نقاش جديد..."
          className="p-3 border rounded-lg w-full"
        />
        <button 
          onClick={handleAddThread} 
          className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          إضافة
        </button>
      </div>

      {threads.map(thread => (
        <DiscussionThread key={thread.id} thread={thread} />
      ))}
    </div>
  );
};

export default CourseDiscussions;