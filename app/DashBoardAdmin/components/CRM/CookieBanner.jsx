const CookieBanner = ({ onAccept }) => {
    return (
      <div className="cookie-banner fixed bottom-4 left-4 right-4 bg-white p-6 rounded-lg shadow-xl max-w-md mx-auto">
        <div className="text-center">
          <h3 className="font-bold mb-2">إعدادات الخصوصية</h3>
          <p className="text-gray-600 mb-4">
            نستخدم ملفات تعريف الارتباط لتحسين تجربتك. هل توافق على استخدامها؟
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => onAccept(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              أوافق
            </button>
            <button
              onClick={() => onAccept(false)}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
            >
              أرفض
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default CookieBanner;