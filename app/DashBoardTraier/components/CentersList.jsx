'use client';
import { FiTrash2, FiEdit } from 'react-icons/fi';

export default function CentersList({ centers, onEdit, onDelete }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-xl font-semibold mb-4">المراكز المسجلة</h3>
      
      {centers.length === 0 ? (
        <p className="text-gray-500">لا توجد مراكز مسجلة حالياً</p>
      ) : (
        <div className="grid gap-3">
          {centers.map(center => (
            <div key={center.id} className="flex justify-between items-center p-3 border rounded-lg">
              <div className="flex-1">
                <p className="font-medium">{center.name}</p>
                <p className="text-sm text-gray-500">{center.location}</p>
                <div className="flex gap-2 mt-1">
                  <span className={`px-2 py-1 text-sm rounded-full ${
                    center.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {center.status === 'active' ? 'نشط' : 'غير نشط'}
                  </span>
                  {center.capacity && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 text-sm rounded-full">
                      السعة: {center.capacity}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(center)}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                >
                  <FiEdit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete(center.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}