import api from "./apis";

export const getUsers = async () => {
  try {
    const response = await api.get("/up_users?populate=role"); // المسار الصحيح: /api/users
    return response.data;
  } catch (error) {
    throw new Error("فشل في جلب المستخدمين: " + error.message);
  }
};
export const createUser = async (userData) => {
  try {
    const response = await api.post("/users-permissions/users", {
      username: userData.email.split("@")[0],
      email: userData.email,
      password: userData.password,
      role: userData.role,
      permissions: userData.permissions,
    });
    return response.data;
  } catch (error) {
    throw new Error("فشل في إنشاء المستخدم: " + error.message);
  }
};

export const updateUser = async (userId, updates) => {
  try {
    const response = await api.put(
      `/users-permissions/users/${userId}`,
      updates
    );
    return response.data;
  } catch (error) {
    throw new Error("فشل في تحديث المستخدم: " + error.message);
  }
};

export const deleteUser = async (userId) => {
  try {
    await api.delete(`/users-permissions/users/${userId}`);
  } catch (error) {
    throw new Error("فشل في حذف المستخدم: " + error.message);
  }
};
