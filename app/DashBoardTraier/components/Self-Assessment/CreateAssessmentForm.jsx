"use client";

import { useState } from 'react';
import {Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const CreateAssessmentForm = () => {
  const [questions, setQuestions] = useState([{ id: 1, text: '' }]);
  const [title, setTitle] = useState('');

  const addQuestion = () => {
    setQuestions([...questions, { id: questions.length + 1, text: '' }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // إرسال البيانات إلى الـ API الوهمي
    console.log('تقييم جديد:', { title, questions });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="عنوان التقييم"
        required
      />
      {questions.map((q, index) => (
        <div key={q.id} className="flex gap-2">
          <Input
            value={q.text}
            onChange={(e) => {
              const newQuestions = [...questions];
              newQuestions[index].text = e.target.value;
              setQuestions(newQuestions);
            }}
            placeholder={`السؤال ${index + 1}`}
            required
          />
          <Button
            type="button"
            onClick={() => setQuestions(questions.filter(qq => qq.id !== q.id))}
            variant="destructive"
          >
            حذف
          </Button>
        </div>
      ))}
      <Button type="button" onClick={addQuestion} variant="secondary">
        إضافة سؤال
      </Button>
      <Button type="submit">إنشاء التقييم</Button>
    </form>
  );
};

export default CreateAssessmentForm;