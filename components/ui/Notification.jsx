export default function Notification({ message, type = 'success', onClose }) {
    const typeClasses = {
      success: "bg-green-100 text-green-800",
      error: "bg-red-100 text-red-800",
      warning: "bg-yellow-100 text-yellow-800",
      info: "bg-blue-100 text-blue-800",
      loading: "bg-blue-100 text-blue-800 animate-pulse"
    };
  
    return (
      <div className={`fixed bottom-4 right-4 p-4 rounded shadow-lg ${typeClasses[type]} flex items-center justify-between min-w-[250px] max-w-md z-50`}>
        <span>{message}</span>
        <button 
          onClick={onClose} 
          className="ml-2 text-gray-500 hover:text-gray-700"
          aria-label="Close notification"
        >
          &times;
        </button>
      </div>
    );
  };