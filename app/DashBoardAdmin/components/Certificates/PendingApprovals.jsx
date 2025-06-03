'use client';
import '@ant-design/v5-patch-for-react-19';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Switch, Avatar, Tag, Table, Button } from 'antd';
const PendingApprovals = () => {
  const requests = [
    {
      id: '1',
      student: 'محمد أحمد',
      course: 'تطوير الويب المتقدم',
      completedAt: '2024-03-20',
      status: 'pending',
    },
    // ... بيانات أخرى
  ];

  const columns = [
    {
      title: 'الطالب',
      dataIndex: 'student',
      render: (text) => (
        <div className="flex items-center gap-2">
          <Avatar>{text[0]}</Avatar>
          {text}
        </div>
      ),
    },
    {
      title: 'الدورة',
      dataIndex: 'course',
    },
    {
      title: 'تاريخ الإكمال',
      dataIndex: 'completedAt',
    },
    {
      title: 'الإجراءات',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button type="primary" size="small">معاينة الطلب</Button>
          <Switch checkedChildren="موافقة" unCheckedChildren="رفض" />
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
    <Table 
      columns={columns} 
      dataSource={requests} 
      pagination={false}
      rowKey="id"
    />
  </div>
  );
};
export default PendingApprovals;