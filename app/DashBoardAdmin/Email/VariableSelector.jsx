'use client';
import { systemVariables } from '@/data/templateVariables';

export default function VariableSelector({ onSelect }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="font-semibold mb-4">متغيرات النظام</h3>
      <div className="grid grid-cols-2 gap-2">
        {systemVariables.map(varItem => (
          <button
            key={varItem.key}
            onClick={() => onInsert(`{${varItem.key}}`)}
            className="p-2 border rounded hover:bg-gray-50 text-sm text-right"
          >
            {varItem.label}
          </button>
        ))}
      </div>
    </div>
  );
}