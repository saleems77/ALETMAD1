'use client';
import { useCRM } from '@/hooks/useCRM';
import Link from 'next/link';

export default function ContactList() {
  const { contacts } = useCRM();

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 text-right">الاسم</th>
            <th className="p-3">البريد الإلكتروني</th>
            <th className="p-3">الحالة</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map(contact => (
            <tr key={contact.id} className="border-t hover:bg-gray-50">
              <td className="p-3">
                <Link href={`/crm/contacts/${contact.id}`} className="text-blue-600">
                  {contact.name}
                </Link>
              </td>
              <td className="p-3">{contact.email}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded-full ${contact.status === 'active' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {contact.status === 'active' ? 'نشط' : 'غير نشط'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}