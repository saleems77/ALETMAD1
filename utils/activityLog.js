import axios from "../api/axiosInstance";

export const logActivity = async (
  actionType,
  memberId,
  details,
  target = "users"
) => {
  try {
    await axios.post("/api/activity-logs", {
      actionType,
      details,
      target,
      memberId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("فشل تسجيل النشاط:", error);
  }
};
