'use client';
import { useState, useEffect } from 'react';
import LicenseFormModal from './LicenseFormModal';
import LicenseBadge from './LicenseBadge'; // تأكد من المسار الصحيح

const LicenseManager = ({ courseId }) => {
  const [licenses, setLicenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState(null);

  useEffect(() => {
    const savedLicenses = JSON.parse(
      localStorage.getItem(`licenses-${courseId}`) || '[]'
    );
    setLicenses(savedLicenses);
  }, [courseId]);

  const handleSubmit = (licenseData) => {
    const updated = licenseData.id 
      ? licenses.map(l => l.id === licenseData.id ? licenseData : l)
      : [...licenses, { ...licenseData, id: Date.now() }];
    
    localStorage.setItem(`licenses-${courseId}`, JSON.stringify(updated));
    setLicenses(updated);
    setShowForm(false);
  };

  const deleteLicense = (id) => {
    const filtered = licenses.filter(l => l.id !== id);
    localStorage.setItem(`licenses-${courseId}`, JSON.stringify(filtered));
    setLicenses(filtered);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 flex justify-between items-center">
        <h3 className="text-lg font-semibold">إدارة التراخيص</h3>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
          onClick={() => {
            setSelectedLicense(null);
            setShowForm(true);
          }}
        >
          إضافة ترخيص
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right">النوع</th>
              <th className="px-6 py-3 text-right">الرقم المرجعي</th>
              <th className="px-6 py-3 text-right">تاريخ الإصدار</th>
              <th className="px-6 py-3 text-right">تاريخ الانتهاء</th>
              <th className="px-6 py-3 text-right">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {licenses.map(license => (
              <tr key={license.id}>
                <td className="px-6 py-4">
                  <LicenseBadge type={license.type} />
                </td>
                <td className="px-6 py-4">{license.referenceNumber}</td>
                <td className="px-6 py-4">{license.issueDate}</td>
                <td className="px-6 py-4">{license.expiryDate}</td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      setSelectedLicense(license);
                      setShowForm(true);
                    }}
                  >
                    تعديل
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => {
                      if(window.confirm('هل أنت متأكد من الحذف؟')) {
                        deleteLicense(license.id);
                      }
                    }}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <LicenseFormModal
        show={showForm}
        onClose={() => setShowForm(false)}
        license={selectedLicense}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default LicenseManager;