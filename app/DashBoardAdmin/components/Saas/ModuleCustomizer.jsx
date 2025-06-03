// src/components/ModuleCustomizer.jsx
'use client';
import { ToggleGroup, ToggleGroupItem } from '@nextui-org/react';
import { useLicenseStore } from '../context/LicenseContext';

const modules = [
  { id: 'marketing', name: 'وحدة التسويق', tiers: ['basic', 'pro', 'enterprise'] },
  { id: 'finance', name: 'وحدة المحاسبة', tiers: ['pro', 'enterprise'] },
  { id: 'crm', name: 'وحدة إدارة العملاء', tiers: ['enterprise'] },
];

export default function ModuleCustomizer({ institution }) {
  const { updateLicense } = useLicenseStore();

  const handleModuleChange = (moduleId, tier) => {
    const updatedModules = institution.modules.map(m => 
      m.id === moduleId ? { ...m, tier, status: tier ? 'active' : 'inactive' } : m
    );
    updateLicense(institution.id, { modules: updatedModules });
  };

  return (
    <div className="space-y-6">
      {modules.map(module => (
        <div key={module.id} className="card p-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">{module.name}</h4>
            <ToggleGroup 
              value={institution.modules.find(m => m.id === module.id)?.tier}
              onChange={(tier) => handleModuleChange(module.id, tier)}
            >
              {module.tiers.map(tier => (
                <ToggleGroupItem key={tier} value={tier}>
                  {tier === 'basic' && 'أساسي'}
                  {tier === 'pro' && 'محترف'}
                  {tier === 'enterprise' && 'متقدم'}
                </ToggleGroupItem>
              ))}
              <ToggleGroupItem value="">تعطيل</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      ))}
    </div>
  );
}