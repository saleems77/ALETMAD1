const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://amazing-cabbage-7632d69005.strapiapp.com/api";

const fetcher = async (url, options = {}) => {
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const error = new Error("An error occurred while fetching the data.");
    error.status = res.status;
    error.response = errorData;
    throw error;
  }

  return res.json();
};
const apiObject = {
  createCourse(data) {
    return fetcher("/courses", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  getCourses() {
    return fetcher("/courses");
  },
  getCourse(id) {
    return fetcher(`/courses/${id}`);
  },
  updateCourse(id, data) {
    return fetcher(`/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  deleteCourse(id) {
    return fetcher(`/courses/${id}`, {
      method: "DELETE",
    });
  },

  // رفع الملفات
  uploadFile(file) {
    const formData = new FormData();
    formData.append("files", file);

    return fetch(`${API_URL}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    }).then((res) => res.json());
  },
};
export default apiObject;
