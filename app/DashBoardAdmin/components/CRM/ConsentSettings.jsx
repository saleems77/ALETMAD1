import {useState} from 'react'
const ConsentSettings = ({ onSettingsChange }) => {
    const [analyticsConsent, setAnalyticsConsent] = useState(true);
    const [marketingConsent, setMarketingConsent] = useState(false);
  
    const handleSave = () => {
      onSettingsChange({
        analytics: analyticsConsent,
        marketing: marketingConsent
      });
    };
  
    return (
      <div className="consent-settings bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4">إدارة التفضيلات</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label>الموافقة على التحليلات</label>
            <input
              type="checkbox"
              checked={analyticsConsent}
              onChange={(e) => setAnalyticsConsent(e.target.checked)}
              className="toggle-checkbox"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label>الموافقة على التسويق</label>
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
              className="toggle-checkbox"
            />
          </div>
        </div>
  
        <button
          onClick={handleSave}
          className="mt-6 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
        >
          حفظ الإعدادات
        </button>
      </div>
    );
  };
  
  export default ConsentSettings;