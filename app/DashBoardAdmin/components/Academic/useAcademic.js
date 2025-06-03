"use client";
import { useState, useEffect } from "react";

export const useAcademic = () => {
  const [transcripts, setTranscripts] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  // محاكاة جلب البيانات من API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // بيانات وهمية
        const mockData = {
          transcripts: [{ id: "t1", student: "محمد أحمد", date: "2024-03-01" }],
          certificates: [
            { id: "c1", title: "شهادة Web Development", student: "محمد أحمد" },
          ],
        };

        await new Promise((resolve) => setTimeout(resolve, 1000));
        setTranscripts(mockData.transcripts);
        setCertificates(mockData.certificates);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const createTranscript = (newTranscript) => {
    setTranscripts([
      ...transcripts,
      { ...newTranscript, id: crypto.randomUUID() },
    ]);
  };

  const deleteTranscript = (id) => {
    setTranscripts(transcripts.filter((t) => t.id !== id));
  };

  return {
    transcripts,
    certificates,
    loading,
    createTranscript,
    deleteTranscript,
  };
};
