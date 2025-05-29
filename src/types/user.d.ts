// src/@types/user.d.ts
declare module 'strapi-plugin-users-permissions' {
  export interface User {
    id: string;
    email?: string;
    username?: string;
    role?: {
      id: string;
      name: string;
    };
    // أضف أي خصائص أخرى تحتاجها
  }
}
