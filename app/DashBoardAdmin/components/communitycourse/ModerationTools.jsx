import React from 'react';

const ModerationTools = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
      <h3 className="text-lg font-semibold mb-4">أدوات المراجعة [[6]]</h3>
      <div className="space-y-4">
        <button className="btn btn-error">حذف المشاركات المخالفة</button>
        <button className="btn btn-warning">حظر المستخدمين</button>
        <button className="btn btn-success">تثبيت المواضيع</button>
      </div>
    </div>
  );
};

export default ModerationTools;