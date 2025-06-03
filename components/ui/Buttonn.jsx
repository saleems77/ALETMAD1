export const Button = ({ variant = "primary", children, className = "", ...props }) => {
    const variantClasses = {
      primary: "bg-blue-600 hover:bg-blue-700 text-white",
      secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
      success: "bg-green-600 hover:bg-green-700 text-white",
      danger: "bg-red-600 hover:bg-red-700 text-white",
      warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
      outline: "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100"
    };
    
    return (
      <button 
        className={`px-4 py-2 rounded transition-all ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  };