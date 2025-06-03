'use client';
import { Card, Checkbox, Button } from 'antd';

const CertificateUpgrades = ({ onSelect }) => {
  const upgrades = [
    {
      id: 'physical',
      title: 'نسخة ورقية مطبوعة',
      description: 'شهادة ورقية فاخرة مع إطار خشبي',
      price: 99,
    },
    {
      id: 'verification',
      title: 'خدمة التحقق المتقدمة',
      description: 'تأكيد صحة الشهادة عبر منصة خارجية',
      price: 49,
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">الترقيات الإضافية</h3>
      {upgrades.map((upgrade) => (
        <Card key={upgrade.id} className="shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">{upgrade.title}</h4>
              <p className="text-gray-600">{upgrade.description}</p>
              <p className="text-blue-600 mt-2">{upgrade.price} ر.س</p>
            </div>
            <Checkbox onChange={(e) => onSelect(upgrade.id, e.target.checked)} />
          </div>
        </Card>
      ))}
    </div>
  );
};
export default CertificateUpgrades ;