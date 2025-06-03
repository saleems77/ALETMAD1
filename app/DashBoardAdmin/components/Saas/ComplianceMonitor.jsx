'use client';
import { useLicenseStore } from './LicenseContext';
import { useState } from 'react';
export default function ComplianceMonitor() {
  const { clients, suspendClient } = useLicenseStore();
  const [suspensionReason, setSuspensionReason] = useState('');

  const handleSuspension = (clientId) => {
    if(suspensionReason) {
      suspendClient(clientId, suspensionReason);
      setSuspensionReason('');
    }
  };

  return (
    <div className="card bg-base-100 p-4">
      <h3 className="text-xl font-bold mb-4">إدارة الانتهاكات</h3>
      
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>المركز</th>
              <th>الحالة</th>
              <th>آخر نشاط</th>
              <th>الإجراء</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>
                  <span className={`badge ${client.status === 'active' ? 'badge-success' : 'badge-error'}`}>
                    {client.status}
                  </span>
                </td>
                <td>{client.lastActivity}</td>
                <td>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="سبب الإيقاف"
                      className="input input-bordered input-sm"
                      value={suspensionReason}
                      onChange={(e) => setSuspensionReason(e.target.value)}
                    />
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => handleSuspension(client.id)}
                    >
                      تعليق
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}