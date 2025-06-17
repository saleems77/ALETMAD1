// app/materials/utils.js
import qs from "qs";

export const fetchMaterialsByCourse = async (
  courseDocumentId,
  token,
  API_URL
) => {
  const query = qs.stringify(
    {
      filters: {
        course: {
          documentId: {
            $eq: courseDocumentId,
          },
        },
      },
      populate: {
        attachment: {
          fields: ["name", "url"],
        },
      },
    },
    { encodeValuesOnly: true }
  );

  const response = await fetch(`${API_URL}/materials?${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "فشل في جلب المواد.");
  }

  return await response.json();
};
