'use client';
import { useEffect, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

 function GroupSearch({ onSearch }) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // محاكاة اقتراحات البحث
  const mockSuggestions = [
    'React',
    'Node.js',
    'TypeScript',
    'التعلم الآلي',
    'أمن المعلومات'
  ];

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (inputValue.length > 0) {
        const filtered = mockSuggestions.filter(suggestion =>
          suggestion.toLowerCase().includes(inputValue.toLowerCase())
        );
        setSuggestions(filtered);
        onSearch(inputValue);
      } else {
        setSuggestions([]);
        onSearch('');
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [inputValue]);

  return (
    <div className="relative flex-1">
      <div className="relative">
        <input
          type="text"
          placeholder="ابحث عن مجموعات..."
          className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
<MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-4 text-gray-400" />
</div>

      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-lg">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => {
                setInputValue(suggestion);
                setSuggestions([]);
              }}
              className="p-3 cursor-pointer hover:bg-gray-100 border-b last:border-0"
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default GroupSearch;