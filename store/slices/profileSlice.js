import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// جلب بيانات المستخدم الحالي
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async ({ documentId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/user-profiles`,
        {
          params: {
            "filters[users_permissions_user][documentId]": documentId,
            populate: "*",
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data || response.data.data.length === 0) {
        return rejectWithValue("لم يتم العثور على ملف شخصي");
      }

      // استخراج البيانات بشكل صحيح
      const profileData = response.data.data[0];

      // تحويل حقل bio من blocks إلى نص عادي
      const extractPlainText = (blocks) => {
        if (!blocks || blocks.length === 0) return "";
        return blocks
          .map((block) => block.children.map((child) => child.text).join(" "))
          .join("\n");
      };

      return {
        id: profileData.id,
        documentId: profileData.documentId,
        jobTitle: profileData.jobTitle,
        phone: profileData.phone,
        bio: extractPlainText(profileData.bio),
        facebookLink: profileData.facebookLink,
        website: profileData.website,
        username: profileData.username,
        users_permissions_user: profileData.users_permissions_user?.data,
        profileImage: profileData.profileImage?.data || null,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

// تحديث بيانات المستخدم
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async ({ profileDocumentId, profileData, token }, { rejectWithValue }) => {
    try {
      // معالجة الصورة
      let profileImageId = null;
      if (profileData.profileImageFile) {
        const formData = new FormData();
        formData.append("files", profileData.profileImageFile);

        const uploadRes = await axios.post(
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/upload`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        profileImageId = uploadRes.data[0].id;
      }

      // تحويل النص العادي إلى هيكل blocks
      const convertToBlocks = (text) => {
        if (!text) return [];
        return [
          {
            type: "paragraph",
            children: [{ type: "text", text }],
          },
        ];
      };

      // بناء بيانات التحديث
      const updateData = {
        data: {
          jobTitle: profileData.jobTitle,
          phone: profileData.phone,
          bio: convertToBlocks(profileData.bio), // تحويل النص إلى blocks
          facebookLink: profileData.facebookLink,
          website: profileData.website,
          ...(profileImageId && { profileImage: profileImageId }),
        },
      };

      // إرسال طلب التحديث
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/user-profiles/${profileDocumentId}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // إرجاع البيانات المحدثة بشكل صحيح
      const updatedProfile = response.data.data;
      return {
        id: updatedProfile.id,
        documentId: updatedProfile.documentId,
        ...updatedProfile,
        users_permissions_user: updatedProfile.users_permissions_user?.data,
        profileImage: updatedProfile.profileImage?.data || null,
        bio: profileData.bio, // الحفاظ على النص العادي للعرض
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    data: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = {
          id: action.payload.id,
          jobTitle: action.payload.jobTitle,
          phone: action.payload.phone,
          bio: action.payload.bio,
          facebookLink: action.payload.facebookLink,
          profileImage: action.payload.profileImage || null,
          website: action.payload.website,
          username: action.payload.username,
          documentId: action.payload.documentId,
        };
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.status = "updating";
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        // تحديث البيانات المحلية مباشرة
        state.data = {
          ...state.data,
          ...action.payload,
          profileImage: action.payload.profileImage || state.data.profileImage,
          id: action.payload.id,
          documentId: action.payload.documentId,
          bio: action.payload.bio,
        };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;
