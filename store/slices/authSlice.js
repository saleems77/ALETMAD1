import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
const PROFILE_API_URL = `${API_URL}/user-profiles`;

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/local`, {
        identifier: email,
        password,
      });

      const userResponse = await axios.get(
        `${API_URL}/users/me?populate=role`,
        {
          headers: { Authorization: `Bearer ${response.data.jwt}` },
        }
      );

      const userData = {
        jwt: response.data.jwt,
        user: {
          ...userResponse.data,
          documentId: userResponse.data.documentId,
          role: userResponse.data.role,
        },
      };

      // طباعة بيانات المستخدم في الكونسول
      console.log("تم تسجيل الدخول:", {
        jwt: userData.jwt,
        user: userData.user,
      });

      return userData;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/local/register`, {
        username: formData.name,
        email: formData.email,
        password: formData.password,
      });

      const userData = {
        jwt: response.data.jwt,
        user: {
          id: response.data.user.id,
          documentId: response.data.user.documentId,
          username: response.data.user.username,
          email: response.data.user.email,
          role: response.data.user.role,
        },
      };

      // طباعة بيانات المستخدم في الكونسول
      console.log("تم إنشاء حساب جديد:", {
        jwt: userData.jwt,
        user: userData.user,
      });

      // إنشاء ملف شخصي للمستخدم
      const profileResponse = await axios.post(
        PROFILE_API_URL,
        {
          data: {
            users_permissions_user: {
              connect: [userData.user.documentId],
            },
            bio: "",
            jobTitle: "",
            phone: "",
            username: userData.user.username,
            website: userData.user.email,
            facebookLink: "",
            isMultiFactorAuthEnabled: false,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
            "Content-Type": "application/json",
          },
        }
      );

      // إضافة معرف الملف الشخصي إلى بيانات المستخدم
      userData.userProfileId = profileResponse.data.data.id;

      return userData;
    } catch (error) {
      console.error("خطأ في التسجيل:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        return rejectWithValue("No token found");
      }

      const decoded = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decoded.exp < currentTime) {
        localStorage.removeItem("jwt");
        return rejectWithValue("Token expired");
      }

      const userResponse = await axios.get(
        `${API_URL}/users/me?populate=role`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const userData = {
        jwt: token,
        user: {
          ...userResponse.data,
          documentId: userResponse.data.documentId,
        },
      };

      // طباعة بيانات المستخدم في الكونسول
      console.log("حالة المصادقة:", {
        jwt: userData.jwt,
        user: userData.user,
      });

      return userData;
    } catch (error) {
      localStorage.removeItem("jwt");
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  userProfileId: null, // إضافة لتخزين معرف الملف الشخصي
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = {
        ...action.payload,
        documentId: action.payload.documentId, // إضافة documentId
      };
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("jwt", action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("jwt");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.jwt;
        localStorage.setItem("jwt", action.payload.jwt);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.jwt;
        localStorage.setItem("jwt", action.payload.jwt);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.jwt;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, setUser } = authSlice.actions;

export default authSlice.reducer;
