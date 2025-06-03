'use client';
import { RadioGroup, Radio, Accordion, AccordionItem} from '@nextui-org/react';

export default function PaymentOptions({ onSelect }) {
  const [paymentMethod, setPaymentMethod] = useState('free');
  const [additionalOptions, setAdditionalOptions] = useState({
    hardCopy: false,
    expressDelivery: false,
    frameOption: 'basic'
  });

  return (
    <div className="space-y-6">
      <RadioGroup 
        label="اختر نوع الشهادة"
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        <Radio value="free">شهادة رقمية مجانية</Radio>
        <Radio value="premium">شهادة مميزة (25 ر.س)</Radio>
        <Radio value="physical">شهادة مطبوعة + رقمية (50 ر.س)</Radio>
      </RadioGroup>

      {paymentMethod !== 'free' && (
        <Accordion>
          <AccordionItem title="خيارات إضافية">
            <div className="space-y-4">
              <Checkbox isSelected={additionalOptions.hardCopy}>
                نسخة ورقية فاخرة (15 ر.س إضافية)
              </Checkbox>
              <Checkbox isSelected={additionalOptions.expressDelivery}>
                توصيل سريع (10 ر.س إضافية)
              </Checkbox>
              <Select 
                label="إطار الشهادة"
                options={[
                  {label: 'إطار أساسي', value: 'basic'},
                  {label: 'إطار ذهبي', value: 'gold'},
                  {label: 'إطار فضي', value: 'silver'}
                ]}
              />
            </div>
          </AccordionItem>
        </Accordion>
      )}

      {paymentMethod !== 'free' && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <PaymentGatewayIntegration 
            amount={calculateTotal()}
            onSuccess={handlePaymentSuccess}
          />
        </div>
      )}
    </div>
  );
}