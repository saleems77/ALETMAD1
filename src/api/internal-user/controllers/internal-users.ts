// src/api/internal-users/controllers/internal-users.ts
import { Context } from 'koa';

// تعريف نوع User يدوياً
type User = {
  id: number;
  username: string;
  email: string;
  role?: {
    name: string;
  };
  // أضف خصائص أخرى حسب الحاجة
};

export default {
  async find(ctx: Context) {
    try {
      const users = await strapi.entityService.findMany('plugin::users-permissions.user', {
        populate: ['role'],
      }) as User[]; // استخدام النوع المخصص
      
      const allowedRoles = ['assistant', 'Employee', 'Marketer'];
      return users.filter(u => allowedRoles.includes(u.role?.name || ''));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      ctx.throw(500, message);
    }
  },

  async create(ctx: Context) {
    const { username, email, password, role, permissions } = ctx.request.body;
    let formattedPermissions: Record<string, boolean> = {};
    
    if (Array.isArray(permissions)) {
      formattedPermissions = permissions.reduce((acc: Record<string, boolean>, perm: string) => {
        acc[perm] = true;
        return acc;
      }, {});
    } else if (typeof permissions === 'object' && permissions !== null) {
      formattedPermissions = permissions;
    }
    
    if (!email || !password) {
      ctx.throw(400, 'البريد الإلكتروني وكلمة المرور مطلوبان');
    }

    try {
      const user = await strapi.plugins['users-permissions'].services.user.add({
        username,
        email,
        password,
        role,
        permissions: formattedPermissions,
        confirmed: true,
        blocked: false,
      });

      return user;
    } catch (err) {
      const message = err instanceof Error ? `فشل في إنشاء المستخدم: ${err.message}` : 'فشل غير معروف';
      ctx.throw(500, message);
    }
  },
  
  async update(ctx: Context) {
    const { id } = ctx.params;
    const { permissions } = ctx.request.body;

    const formattedPermissions = permissions?.reduce((acc: Record<string, boolean>, perm: string) => {
      acc[perm] = true;
      return acc;
    }, {} as Record<string, boolean>);

    try {
      const updatedUser = await strapi.plugins['users-permissions'].services.user.edit(
        { id },
        { permissions: formattedPermissions }
      );
      return updatedUser;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      ctx.throw(500, message);
    }
  },
  
  async delete(ctx: Context) {
    const { id } = ctx.params;
    try {
      await strapi.entityService.delete('plugin::users-permissions.user', id);
      return { message: 'تم حذف المستخدم بنجاح' };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      ctx.throw(500, message);
    }
  }
};