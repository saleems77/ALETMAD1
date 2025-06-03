import { useEffect, useState } from "react";
import { Progress } from "@nextui-org/react";

export default function ActivityMonitor() {
  const [activityLevel, setActivityLevel] = useState(0);

  useEffect(() => {
    const handleActivity = () => {
      setActivityLevel(prev => Math.min(prev + 10, 100));
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, []);

  return (
    <div className="card p-4">
      <h3 className="text-lg font-bold mb-4">معدل النشاط</h3>
      <Progress 
        value={activityLevel}
        color={activityLevel > 70 ? "success" : "warning"}
        label={`نشاط النظام: ${activityLevel}%`}
      />
    </div>
  );
}