// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import internalUsersReducer from './internalUsersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    internalUsers: internalUsersReducer // تأكد من تطابق الاسم

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
