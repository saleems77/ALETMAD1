// components/ui/ProgressBar.jsx
export const ProgressBar = ({ value }) => (
    <div className="w-full bg-gray-200 rounded-full h-3">
      <div 
        className="bg-indigo-600 h-3 rounded-full transition-all duration-500" 
        style={{ width: `${value}%` }}
      />
    </div>
  );