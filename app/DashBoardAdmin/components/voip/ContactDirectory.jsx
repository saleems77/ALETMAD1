// components/ContactDirectory.jsx
"use client"
import { useState, useEffect } from 'react';
import { Search, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const ContactDirectory = () => {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // جلب بيانات جهات الاتصال الوهمية
  useEffect(() => {
    fetch('/api/contacts')
      .then(res => res.json())
      .then(data => setContacts(data));
  }, []);

  // فلترة جهات الاتصال بناءً على البحث
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold">
        <UserPlus className="text-green-500" /> دليل جهات الاتصال
      </h3>
      <div className="mb-4">
        <Input
          placeholder="ابحث عن جهة اتصال..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full"
          icon={<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />}
        />
      </div>
      <div className="space-y-2">
        {filteredContacts.map(contact => (
          <div
            key={contact.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded"
          >
            <div className="flex items-center gap-3">
              <User className="text-gray-400" />
              <div>
                <p>{contact.name}</p>
                <small className="text-gray-500">{contact.status}</small>
              </div>
            </div>
            <Button
              variant="secondary"
              className="px-3 py-1 bg-blue-500 text-white hover:bg-blue-600"
            >
              اتصال
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactDirectory;