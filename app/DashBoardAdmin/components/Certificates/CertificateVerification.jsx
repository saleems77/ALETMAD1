'use client';
import { Form, Input, Button } from 'antd';

const CertificateVerification = () => {
  const [form] = Form.useForm();

  const handleVerify = async (values) => {
    const response = await fetch(`/api/verify/${values.certificateId}`);
    const data = await response.json();
    // عرض نتيجة التحقق
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow">
      <Form form={form} onFinish={handleVerify}>
        <Form.Item
          name="certificateId"
          label="رقم الشهادة"
          rules={[{ required: true }]}
        >
          <Input placeholder="أدخل الرقم المرجعي للشهادة" />
        </Form.Item>
        
        <Button 
          type="primary" 
          htmlType="submit"
          className="w-full"
        >
          التحقق من صحة الشهادة
        </Button>
      </Form>
    </div>
  );
};