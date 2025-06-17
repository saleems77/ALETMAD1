"use client";
import { useState, useEffect } from 'react';
import { getInvitationLinks } from '../../../../services/couponData';
import { FaSearch, FaCopy, FaLink, FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const InvitationLinkList = ({ courseDocumentId }) => {
  const [links, setLinks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filteredLinks, setFilteredLinks] = useState([]);

  useEffect(() => {
    const fetchLinks = async () => {
      setIsLoading(true);
      try {
        const linksData = await getInvitationLinks(courseDocumentId);
        setLinks(linksData);
        setFilteredLinks(linksData);
      } catch (error) {
        console.error('فشل جلب روابط الدعوة:', error);
        setLinks([]);
        setFilteredLinks([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (courseDocumentId) {
      fetchLinks();
    }
  }, [courseDocumentId]);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredLinks(links);
    } else {
      const filtered = links.filter(link =>
        link?.linkCode?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLinks(filtered);
    }
  }, [searchTerm, links]);

  const handleCopy = (linkCode) => {
    const fullLink = `${window.location.origin}/join?code=${linkCode}`;
    navigator.clipboard.writeText(fullLink);
    toast.success('تم نسخ الرابط', {
      icon: '📋',
      style: {
        background: '#f0fdf4',
        color: '#166534',
        border: '1px solid #bbf7d0'
      }
    });
  };

  return (
    <div>
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث عن رابط دعوة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10 py-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
          />
          <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">جاري تحميل روابط الدعوة...</p>
        </div>
      ) : filteredLinks.length === 0 ? (
        <div className="text-center py-8">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaLink className="text-gray-400 text-2xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">لا توجد روابط دعوة</h3>
          <p className="text-gray-600">
            {searchTerm ? 'لم يتم العثور على روابط دعوة مطابقة للبحث' : 'لم يتم إنشاء أي روابط دعوة لهذه الدورة بعد'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  كود الرابط
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  نسخ الرابط
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLinks.map(link => (
                <tr key={link.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-end">
                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-mono">
                        {link.linkCode}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button 
                      onClick={() => handleCopy(link.linkCode)}
                      className="text-gray-400 hover:text-blue-500 p-2 rounded-full hover:bg-blue-50 transition-colors"
                    >
                      <FaCopy />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {filteredLinks.length > 0 && (
        <div className="mt-4 text-sm text-gray-500">
          عرض {filteredLinks.length} من {links.length} رابط دعوة
        </div>
      )}
    </div>
  );
};

export default InvitationLinkList;