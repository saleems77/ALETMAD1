import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  HandThumbUpIcon,
  GlobeEuropeAfricaIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

// مكون غلاف لتوفير السياق
const FacebookProvider = ({ children }) => {
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);

  useEffect(() => {
    if (window.FB) return;

    window.fbAsyncInit = () => {
      window.FB.init({
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });
      setIsSdkLoaded(true);
    };

    if (!document.getElementById('facebook-jssdk')) {
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      document.body.appendChild(script);
    }
  }, []);

  return isSdkLoaded ? children : <div>جاري تحميل موديل فيسبوك...</div>;
};

const MetaLoginButton = ({ onLoginSuccess, onLogout }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (window.FB) checkLoginStatus();
  }, []);

  const checkLoginStatus = () => {
    window.FB.getLoginStatus(response => {
      if (response.status === 'connected') {
        handleLoginSuccess(response.authResponse);
      } else {
        setIsLoading(false);
      }
    });
  };

  const handleLogin = () => {
    setIsLoading(true);
    window.FB.login(
      response => {
        if (response.authResponse) {
          handleLoginSuccess(response.authResponse);
        } else {
          handleLoginError('تم إلغاء العملية');
        }
      },
      { scope: 'ads_management,business_management' }
    );
  };

  const handleLoginSuccess = async (authResponse) => {
    try {
      const userRes = await new Promise((resolve, reject) => {
        window.FB.api('/me', { fields: 'id,name' }, response => {
          response.error ? reject(response.error) : resolve(response);
        });
      });

      const accountsRes = await new Promise((resolve, reject) => {
        window.FB.api(
          `/${userRes.id}/adaccounts`,
          { fields: 'name,account_status,currency' },
          response => response.error ? reject(response.error) : resolve(response)
        );
      });

      const profileData = {
        userId: userRes.id,
        name: userRes.name,
        accessToken: authResponse.accessToken,
        adAccounts: accountsRes.data
      };

      setIsAuthenticated(true);
      setUserData(profileData);
      onLoginSuccess(profileData);
      toast.success('تم الربط بنجاح');
    } catch (error) {
      handleLoginError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    window.FB.logout(() => {
      setIsAuthenticated(false);
      setUserData(null);
      onLogout();
      toast.info('تم قطع الاتصال');
    });
  };

  const handleLoginError = (error) => {
    setIsLoading(false);
    toast.error(`فشل المصادقة: ${error}`);
  };

  return (
    <FacebookProvider>
      <div className="relative">
        {!isAuthenticated ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogin}
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-3 shadow-lg"
          >
            {isLoading ? (
              <>
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
                جاري التحميل...
              </>
            ) : (
              <>
                <GlobeEuropeAfricaIcon className="h-5 w-5" />
                ربط بحساب ميتا
              </>
            )}
          </motion.button>
        ) : (
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-md">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold truncate">{userData.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <HandThumbUpIcon className="h-4 w-4" />
                <span>{userData.adAccounts.length} حساب إعلاني</span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
            </motion.button>
          </div>
        )}
      </div>
    </FacebookProvider>
  );
};

export default MetaLoginButton;