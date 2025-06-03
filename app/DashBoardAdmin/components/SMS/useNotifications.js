import { useState, useEffect } from "react";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [templates, setTemplates] = useState({
    email: [],
    sms: [],
  });

  useEffect(() => {
    // جلب البيانات من localStorage
    const savedNotifications = JSON.parse(
      localStorage.getItem("notifications") || "[]"
    );
    const savedEmailTemplates = JSON.parse(
      localStorage.getItem("emailTemplates") || "[]"
    );
    const savedSmsTemplates = JSON.parse(
      localStorage.getItem("smsTemplates") || "[]"
    );

    setNotifications(savedNotifications);
    setTemplates({
      email: savedEmailTemplates,
      sms: savedSmsTemplates,
    });
  }, []);

  return { notifications, templates };
};
