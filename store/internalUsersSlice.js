// internalUsersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

// Async thunks
export const getInternalUsers = createAsyncThunk(
  "internalUsers/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/internal-users`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// internalUsersSlice.ts
export const addInternalUser = createAsyncThunk(
  "internalUsers/create",
  async (userData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      // التأكد من أن جميع الحقول موجودة
      if (
        !userData.name ||
        !userData.email ||
        !userData.password ||
        !userData.role
      ) {
        return rejectWithValue("جميع الحقول مطلوبة");
      }

      const response = await axios.post(
        `${API_URL}/internal-users`,
        {
          username: userData.name,
          email: userData.email,
          password: userData.password,
          role: userData.role,
          permissions: userData.permissions, // ✅ إرسال كائن الصلاحيات
          confirmed: true,
          blocked: false,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateInternalUser = createAsyncThunk(
  "internalUsers/update",
  async ({ id, updates }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.put(
        `${API_URL}/internal-users/${id}`,
        { data: updates },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteInternalUser = createAsyncThunk(
  "internalUsers/delete",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      await axios.delete(`${API_URL}/internal-users/${userId}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  users: [],
  loading: false,
  error: null,
  success: false,
};

const internalUsersSlice = createSlice({
  name: "internalUsers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get all users
      .addCase(getInternalUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInternalUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.map((user) => ({
          ...user,
          permissions: Array.isArray(user.permissions)
            ? user.permissions
            : Object.keys(user.permissions || {}).filter(
                (key) => user.permissions[key] === true
              ),
        }));
      })
      .addCase(getInternalUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add user
      .addCase(addInternalUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addInternalUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push({
          ...action.payload,
          permissions: Array.isArray(action.payload.permissions)
            ? action.payload.permissions
            : Object.keys(action.payload.permissions || {}).filter(
                (key) => action.payload.permissions[key] === true
              ),
        });
      })
      .addCase(addInternalUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update user
      .addCase(updateInternalUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInternalUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = {
            ...state.users[index],
            ...action.payload,
            permissions: Array.isArray(action.payload.permissions)
              ? action.payload.permissions
              : Object.keys(action.payload.permissions || {}).filter(
                  (key) => action.payload.permissions[key] === true
                ),
          };
        }
      })
      .addCase(updateInternalUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete user
      .addCase(deleteInternalUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInternalUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((u) => u.id !== action.payload);
      })
      .addCase(deleteInternalUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default internalUsersSlice.reducer;
