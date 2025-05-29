// types/user.d.ts
export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  phone?: string;
}