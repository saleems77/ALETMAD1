// components/Email/TemplateFilters.jsx
import { FiSearch, FiX } from 'react-icons/fi';

export default function TemplateFilters({ 
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory 
}) {
  const categories = ['الكل', 'ترحيبية', 'تسويقية', 'تذكير', 'إشعارات نظام'];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* حقل البحث */}
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث في القوالب..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FiSearch className="absolute top-3 right-3 text-gray-400" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute top-3 left-3 text-gray-400 hover:text-gray-600"
            >
              <FiX />
            </button>
          )}
        </div>

        {/* فلاتر الفئات */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedCategory === category 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}