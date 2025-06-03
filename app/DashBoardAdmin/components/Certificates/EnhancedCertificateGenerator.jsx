'use client';
import { useState } from 'react';
import { Stepper, Button } from '@nextui-org/react';
import StudentSelector from './StudentSelector';
import CourseDetailsForm from './CourseDetailsForm';
import CertificatePreview from './CertificatePreview';
import PaymentOptions from './PaymentOptions';

export default function EnhancedCertificateGenerator() {
  const [activeStep, setActiveStep] = useState(0);
  const [certificateData, setCertificateData] = useState({});
  
  const steps = [
    { title: 'اختيار الطالب' },
    { title: 'تفاصيل الدورة' },
    { title: 'خيارات الدفع' },
    { title: 'مراجعة النهائية' }
  ];

  const handleSubmit = () => {
    // Submit logic with API integration
  };

  return (
    <div className="space-y-8">
      <Stepper activeStep={activeStep}>
        {steps.map((step) => (
          <Step key={step.title} title={step.title} />
        ))}
      </Stepper>

      {activeStep === 0 && <StudentSelector onSelect={updateData} />}
      {activeStep === 1 && <CourseDetailsForm onSubmit={updateData} />}
      {activeStep === 2 && <PaymentOptions onSelect={updateData} />}
      {activeStep === 3 && <CertificatePreview data={certificateData} />}

      <div className="flex justify-between">
        <Button 
          isDisabled={activeStep === 0}
          onPress={() => setActiveStep(prev => prev - 1)}
        >
          السابق
        </Button>
        <Button
          color="primary"
          onPress={() => activeStep === 3 ? handleSubmit() : setActiveStep(prev => prev + 1)}
        >
          {activeStep === 3 ? 'إصدار الشهادة' : 'التالي'}
        </Button>
      </div>
    </div>
  );
}