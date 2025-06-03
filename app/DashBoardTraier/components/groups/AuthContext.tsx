'use client';

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode
} from 'react';

// تعريف الواجهة (interface) لكائن المستخدم
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// تعريف واجهة الخصائص للسياق 
interface AuthContextProps {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

// إنشاء السياق مع قيمة افتراضية
const AuthContext = createContext<AuthContextProps>({
  user: null,
  login: () => {},
  logout: () => {}
});

// مكون المزود (Provider) الذي يغلف المكونات التي تحتاج إلى الوصول لحالة تسجيل الدخول
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // استخدام useEffect لتحميل حالة المستخدم (يمكنك تعديلها لتحميل بيانات من API أو Local Storage)
  useEffect(() => {
    // مثال: تعيين مستخدم افتراضي للتجربة - عدل البيانات حسب الحاجة
    setUser({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin' // يمكنك تغيير الدور لتجربة صلاحيات مختلفة
    });
  }, []);

  // دوال تسجيل الدخول والخروج
  const login = (userData: User) => {
    setUser(userData);
    // يمكنك إضافة منطق إضافي (مثل تخزين التوكن أو طلبات API)
  };

  const logout = () => {
    setUser(null);
    // يمكنك إضافة منطق إضافي للتعامل مع تسجيل الخروج
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// الخطاف المخصص للوصول إلى السياق بسهولة
export const useAuth = () => useContext(AuthContext);
