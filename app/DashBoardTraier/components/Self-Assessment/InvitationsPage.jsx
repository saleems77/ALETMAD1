"use client";

import { useState } from 'react';
import { DataTable } from './DataTable';
import { getInvitations } from './mocks/invitations';

const InvitationsPage = () => {
  const [invitations, setInvitations] = useState(getInvitations());

  const sendInvitation = (email) => {
    // إرسال دعوة عبر البريد الإلكتروني (واجهة أمامية فقط)
    console.log('تم إرسال الدعوة إلى:', email);
  };

  return (
    <div className="p-6">
      <DataTable
        columns={[
          { accessorKey: 'email', header: 'البريد الإلكتروني' },
          { accessorKey: 'assessmentTitle', header: 'عنوان التقييم' },
          {
            accessorKey: 'actions',
            header: 'الإجراءات',
            cell: ({ row }) => (
              <button
                onClick={() => sendInvitation(row.original.email)}
                className="btn btn-primary"
              >
                إعادة الإرسال
              </button>
            ),
          },
        ]}
        data={invitations}
      />
    </div>
  );
};

export default InvitationsPage;