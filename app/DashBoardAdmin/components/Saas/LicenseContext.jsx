'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const LicenseContext = createContext();

export function LicenseProvider({ children }) {
  const [userRole, setUserRole] = useState('admin'); // ✅ داخل المكون
  const [institutions, setInstitutions] = useState([]);
  const [systemSettings, setSystemSettings] = useState({
    autoSuspension: { paymentDelay: 15, maxViolations: 3 },
    pricingTiers: { basic: 99, pro: 299, enterprise: 499 }
  });

  useEffect(() => {
    const interval = setInterval(checkSubscriptions, 3600000);
    return () => clearInterval(interval);
  }, [institutions]); // ✅ تبعية مضافة

  const checkSubscriptions = () => {
    setInstitutions(prev => prev.map(inst => {
      if (new Date(inst.expiryDate) < new Date() && inst.status === 'active') {
        return { ...inst, status: 'suspended', suspensionReason: 'تأخر في التجديد' };
      }
      return inst;
    }));
  };

  return (
    <LicenseContext.Provider value={{
      userRole,
      institutions,
      systemSettings,
      createInstitution: (data) => {
        const newInst = {
          id: crypto.randomUUID(),
          createdAt: new Date(),
          status: 'active',
          modules: [],
          ...data
        };
        setInstitutions(prev => [...prev, newInst]);
      },
      updateInstitution: (id, updates) => 
        setInstitutions(prev => prev.map(inst => 
          inst.id === id ? { ...inst, ...updates } : inst
        )),
      updateSystemSettings: (newSettings) => 
        setSystemSettings(prev => ({ ...prev, ...newSettings }))
    }}>
      {children}
    </LicenseContext.Provider>
  );
}

export const useLicenseStore = () => useContext(LicenseContext);