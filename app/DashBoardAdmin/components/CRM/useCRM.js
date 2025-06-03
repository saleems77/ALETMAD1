import { useState, useEffect } from "react";
import { mockContacts, mockInteractions } from "@/data/mockCRM";

export const useCRM = () => {
  const [contacts, setContacts] = useState([]);
  const [interactions, setInteractions] = useState([]);

  useEffect(() => {
    // محاكاة جلب البيانات من API
    setContacts(mockContacts);
    setInteractions(mockInteractions);
  }, []);

  const stats = {
    totalClients: contacts.length,
    monthlyInteractions: interactions.filter(
      (i) => new Date(i.date).getMonth() === new Date().getMonth()
    ).length,
  };

  return { contacts, interactions, stats };
};
