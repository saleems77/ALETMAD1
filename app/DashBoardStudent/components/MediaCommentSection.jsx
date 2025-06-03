'use client';
import { useState, useEffect } from 'react';
import MediaRecorder from './MediaRecorder';
import CommentGallery from './CommentGallery';
import { generateMockComments } from './mockData';

const MediaCommentSection = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // تحميل البيانات الوهمية عند التحميل
  useEffect(() => {
    const loadComments = () => {
      const savedComments = JSON.parse(localStorage.getItem('mediaComments') || []);
      const mockData = generateMockComments(3); // إنشاء 3 تعليقات وهمية
      setComments([...mockData, ...savedComments]);
      setLoading(false);
    };
    
    loadComments();
  }, []);

  const handleNewComment = (newComment) => {
    const updated = [newComment, ...comments];
    setComments(updated);
    localStorage.setItem('mediaComments', JSON.stringify(updated));
  };

  const handleDelete = (id) => {
    const filtered = comments.filter(c => c.id !== id);
    setComments(filtered);
    localStorage.setItem('mediaComments', JSON.stringify(filtered));
  };

  return (
    <section className="max-w-4xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        التعليقات الصوتية والمرئية
      </h2>
      
      <MediaRecorder onSave={handleNewComment} />
      
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-xl" />
          ))}
        </div>
      ) : (
        <CommentGallery comments={comments} onDelete={handleDelete} />
      )}
    </section>
  );
};

export default MediaCommentSection;