// src/components/AutoSuspensionSystem.jsx
'use client';
import { useLicenseStore } from '../context/LicenseContext';
import { Button, Slider } from '@nextui-org/react';

export default function AutoSuspensionSystem() {
  const { systemSettings, updateSystemSettings } = useLicenseStore();
  
  const updateRules = (rule, value) => {
    updateSystemSettings({
      autoSuspension: {
        ...systemSettings.autoSuspension,
        [rule]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-bold mb-4">قواعد التعليق التلقائي</h3>
        
        <div className="space-y-4">
          <div>
            <label>أيام تأخر الدفع:</label>
            <Slider 
              value={systemSettings.autoSuspension.paymentDelay}
              onChange={(v) => updateRules('paymentDelay', v)}
              min={1}
              max={30}
              marks={[
                { value: 7, label: '7 أيام' },
                { value: 15, label: '15 يوم' },
                { value: 30, label: '30 يوم' }
              ]}
            />
          </div>

          <div>
            <label>حد الانتهاكات الشهرية:</label>
            <Slider
              value={systemSettings.autoSuspension.maxViolations}
              onChange={(v) => updateRules('maxViolations', v)}
              min={1}
              max={10}
              marks={[
                { value: 3, label: '3 انتهاكات' },
                { value: 5, label: '5 انتهاكات' }
              ]}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button color="primary">حفظ الإعدادات</Button>
        <Button>استعادة الإعدادات الافتراضية</Button>
      </div>
    </div>
  );
}