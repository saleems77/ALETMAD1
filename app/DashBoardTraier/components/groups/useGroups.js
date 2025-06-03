// في useGroups.js
"use client";
import { useState, useEffect } from "react";
import { mockGroups } from "./mockGroups";

export const useGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // محاكاة طلب API
    setTimeout(() => {
      setGroups(mockGroups);
      setLoading(false);
    }, 1000);
  }, []);

  return { groups, loading };
};
