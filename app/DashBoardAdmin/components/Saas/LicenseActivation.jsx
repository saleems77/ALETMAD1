// في LicenseActivation.jsx
const validateLicenseKey = (key) => {
  const licensePattern = /^[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}$/;
  const isUnique = !licenses.some(l => l.key === key);
  return licensePattern.test(key) && isUnique;
};

// في سياق التفعيل
const handleActivation = () => {
  if(validateLicenseKey(formData.key)) {
    // تفعيل الترخيص
  } else {
    toast.error('مفتاح الترخيص غير صالح أو مستخدم مسبقًا');
  }
};