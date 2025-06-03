'use client';
import { useState } from 'react';
import { useLicenseStore } from './LicenseContext';

export default function ModuleLicensing({ client }) {
  const [selectedModule, setSelectedModule] = useState('');
  const [duration, setDuration] = useState(30);
  const { activateModule } = useLicenseStore();
  const modules = ['Module1', 'Module2', 'Module3']; // Example values
  const handleActivation = () => {
    activateModule(client.id, selectedModule, duration);
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-xl font-bold mb-4">تفعيل الوحدات النمطية</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <select 
          className="select select-bordered"
          value={selectedModule}
          onChange={(e) => setSelectedModule(e.target.value)}
        >
          <option value="">اختر وحدة</option>
          {modules.map(module => (
            <option key={module} value={module}>{module}</option>
          ))}
        </select>

        <div className="form-control">
          <label className="label">
            <span className="label-text">المدة (أيام)</span>
          </label>
          <input
            type="number"
            className="input input-bordered"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
      </div>

      <button 
        className="btn btn-primary mt-4"
        onClick={handleActivation}
        disabled={!selectedModule}
      >
        تفعيل الوحدة
      </button>
    </div>
  );
}