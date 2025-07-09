// components/PolicyManager.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaSave, FaPlus, FaLink, FaGlobe, FaBell, FaInfoCircle, FaToggleOn, FaToggleOff, FaCheck, FaTimes } from "react-icons/fa";

export default function PolicyManager() {
  const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const [policies, setPolicies] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    is_active: false,
    sociallink: "",
    notification: "",
    instruction: "",
    platform: {
      platform: "",
      url: ""
    }
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("form");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // جلب السياسات من Strapi حسب التوثيق الأكاديمي
  const fetchPolicies = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/policies?populate[platform][fields][0]=platform&populate[platform][fields][1]=url`
      );
      
      // استخدام البيانات مباشرة بدون attributes
      setPolicies(res.data.data || []);
    } catch (err) {
      setError("فشل جلب السياسات: " + (err.response?.data?.error?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  // التعامل مع تغييرات الحقول
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // التعامل مع تغييرات الحقول الداخلية
  const handleComponentChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      platform: {
        ...prev.platform,
        [name]: value
      }
    }));
  };

  // إضافة أو تحديث سياسة باستخدام documentId
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const payload = {
      data: {
        // باقي الحقول
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        is_active: formData.is_active,
        sociallink: formData.sociallink,
        notification: formData.notification,
        instruction: formData.instruction,
        
        // ✅ تعديل هيكلية المكوّن
        platform: formData.platform.platform && formData.platform.url 
          ? {
               
                platform: formData.platform.platform,
                url: formData.platform.url
              
            }
          : undefined
      }
    };

      let res;
      if (editingId) {
        // استخدام documentId في عنوان URL للتحديث
        res = await axios.put(`${API_URL}/policies/${editingId}`, payload);
      } else {
        res = await axios.post(`${API_URL}/policies`, payload);
      }

      setSuccess(editingId ? "تم تحديث السياسة بنجاح" : "تم إضافة السياسة بنجاح");
      resetForm();
      fetchPolicies();
    } catch (err) {
      setError("فشل العملية: " + (err.response?.data?.error?.message || err.message));
    }
  };

  // تحميل بيانات السياسة للتعديل
  const handleEdit = (policy) => {
    setFormData({
      title: policy.title,
      slug: policy.slug,
      content: policy.content,
      is_active: policy.is_active,
      sociallink: policy.sociallink,
      notification: policy.notification,
      instruction: policy.instruction,
      platform: policy.platform || { platform: "", url: "" }
    });
    setEditingId(policy.documentId);
    setActiveTab("form");
  };

  // حذف سياسة باستخدام documentId
  const handleDelete = async (documentId) => {
    try {
      await axios.delete(`${API_URL}/policies/${documentId}`);
      setSuccess("تم حذف السياسة بنجاح");
      setDeleteConfirm(null);
      fetchPolicies();
    } catch (err) {
      setError("فشل في حذف السياسة: " + (err.response?.data?.error?.message || err.message));
    }
  };

  // إعادة تعيين النموذج
  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      content: "",
      is_active: false,
      sociallink: "",
      notification: "",
      instruction: "",
      platform: { platform: "", url: "" }
    });
    setEditingId(null);
  };

  // إلغاء التعديل
  const handleCancel = () => {
    resetForm();
    setSuccess("");
    setError("");
  };

  // تأكيد الحذف
  const confirmDelete = (documentId) => {
    setDeleteConfirm(documentId);
  };

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-SA', options);
  };

  return (
    <div className="policy-manager bg-white rounded-xl shadow-lg p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <FaGlobe className="mr-2 text-primary-600" />
          إدارة سياسات الخصوصية والشروط
        </h1>
        
        <div className="flex space-x-2">
          <button
            onClick={() => {
              resetForm();
              setActiveTab("form");
            }}
            className={`px-4 py-2 rounded-md flex items-center ${
              activeTab === "form" 
                ? "bg-primary-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaPlus className="mr-2" />
            إضافة سياسة
          </button>
          
          <button
            onClick={() => setActiveTab("list")}
            className={`px-4 py-2 rounded-md flex items-center ${
              activeTab === "list" 
                ? "bg-primary-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            قائمة السياسات
          </button>
        </div>
      </div>

      {/* عرض الأخطاء/النجاح */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
          <FaInfoCircle className="mr-2" />
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center">
          <FaInfoCircle className="mr-2" />
          {success}
        </div>
      )}

      {/* نموذج الإضافة/التحديث */}
      {activeTab === "form" && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl mb-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
            {editingId ? 
              <><FaEdit className="mr-2 text-yellow-500" /> تعديل السياسة</> : 
              <><FaPlus className="mr-2 text-primary-600" /> إضافة سياسة جديدة</>
            }
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان السياسة *
              </label>
              <input
                name="title"
                placeholder="مثال: سياسة الخصوصية"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الرابط الثابت (Slug) *
              </label>
              <input
                name="slug"
                placeholder="مثال: privacy-policy"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              محتوى السياسة *
            </label>
            <textarea
              name="content"
              placeholder="اكتب محتوى السياسة هنا..."
              value={formData.content}
              onChange={handleChange}
              required
              rows={8}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                إشعار
              </label>
              <textarea
                name="notification"
                placeholder="رسالة إشعار للمستخدمين"
                value={formData.notification}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تعليمات
              </label>
              <textarea
                name="instruction"
                placeholder="تعليمات إضافية"
                value={formData.instruction}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رابط وسائل التواصل
              </label>
              <input
                name="sociallink"
                placeholder="رابط صفحة التواصل الاجتماعي"
                value={formData.sociallink}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${formData.is_active ? 'bg-primary-600' : 'bg-gray-300'}`}>
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${formData.is_active ? 'left-7 transform translate-x-1' : 'left-1'}`}></div>
                </div>
                <span className="ml-3 text-gray-700 font-medium">
                  {formData.is_active ? 'نشط' : 'غير نشط'}
                </span>
              </label>
            </div>
          </div>
          
          {/* مكون الروابط الاجتماعية */}
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-700">
              <FaLink className="mr-2 text-primary-600" />
              رابط منصة التواصل الاجتماعي
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المنصة
                </label>
                <select
                  name="platform"
                  value={formData.platform.platform}
                  onChange={handleComponentChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                >
                  <option value="">اختر منصة</option>
                  <option value="facebook">Facebook</option>
                  <option value="telegram">Telegram</option>
                  <option value="instagram">Instagram</option>
                  <option value="twitter">Twitter</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="youtube">YouTube</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رابط URL
                </label>
                <input
                  name="url"
                  placeholder="https://example.com/profile"
                  value={formData.platform.url}
                  onChange={handleComponentChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2.5 bg-gray-300 text-gray-700 rounded-lg flex items-center hover:bg-gray-400 transition-colors"
            >
              إلغاء
            </button>
            
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary-600 text-white rounded-lg flex items-center hover:bg-primary-700 transition-colors"
            >
              <FaSave className="mr-2" />
              {editingId ? "تحديث السياسة" : "حفظ السياسة"}
            </button>
          </div>
        </form>
      )}

      {/* قائمة السياسات */}
      {activeTab === "list" && (
        <div className="bg-gray-50 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            قائمة السياسات ({policies.length})
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              <span className="ml-3 text-gray-600">جاري تحميل البيانات...</span>
            </div>
          ) : policies.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">لا توجد سياسات متاحة</div>
              <button
                onClick={() => {
                  resetForm();
                  setActiveTab("form");
                }}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary-700"
              >
                <FaPlus className="mr-2" />
                إضافة سياسة جديدة
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">العنوان</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">الحالة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">الرابط الثابت</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">آخر تحديث</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {policies.map((policy) => (
                    <tr key={policy.documentId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{policy.title}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {policy.content.substring(0, 50)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          policy.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {policy.is_active ? 
                            <><FaCheck className="inline mr-1" /> نشط</> : 
                            <><FaTimes className="inline mr-1" /> غير نشط</>
                          }
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        /{policy.slug}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(policy.updatedAt || policy.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(policy)}
                            className="text-primary-600 hover:text-primary-800 flex items-center px-3 py-1 border border-primary-600 rounded-lg"
                          >
                            <FaEdit className="mr-1" /> تعديل
                          </button>
                          <button
                            onClick={() => confirmDelete(policy.documentId)}
                            className="text-danger-500 hover:text-danger-700 flex items-center px-3 py-1 border border-danger-500 rounded-lg"
                          >
                            <FaTrash className="mr-1" /> حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* تأكيد الحذف */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">تأكيد الحذف</h3>
            <p className="text-gray-600 mb-6">هل أنت متأكد من رغبتك في حذف هذه السياسة؟ لا يمكن التراجع عن هذا الإجراء.</p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-5 py-2.5 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                إلغاء
              </button>
              
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-5 py-2.5 bg-danger-500 text-white rounded-lg hover:bg-danger-600 transition-colors flex items-center"
              >
                <FaTrash className="mr-2" />
                حذف نهائي
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}