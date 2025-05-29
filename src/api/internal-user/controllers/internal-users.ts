// src/api/internal-users/controllers/internal-users.ts
import { User } from 'strapi-plugin-users-permissions'; // تأكد من أن المسار صحيح
export default {
 async find(ctx) {
  try {
    const users = await strapi.entityService.findMany('plugin::users-permissions.user', {
      populate: ['role'],
    }) as User[]; // تحديد نوع البيانات هنا
         const allowedRoles = ['assistant', 'Employee', 'Marketer'];
    return users.filter(u => allowedRoles.includes(u.role?.name || ''));
  } catch (err) {
    ctx.throw(500, err);
  }
},

  async create(ctx) {
  const { username, email, password, role , permissions  } = ctx.request.body;
  let formattedPermissions = {};
  
  if (Array.isArray(permissions)) {
    // إذا كانت المصفوفة تحتوي على أسماء الصلاحيات، قم بتحويلها إلى كائن
    formattedPermissions = permissions.reduce((acc, perm) => {
      acc[perm] = true;
      return acc;
    }, {});
  } else if (typeof permissions === 'object' && permissions !== null) {
    // إذا تم إرسالها ككائن، استخدمها مباشرة
    formattedPermissions = permissions;
  } else {
    // القيمة الافتراضية
    formattedPermissions = {};
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
    ctx.throw(500, `فشل في إنشاء المستخدم: ${err.message}`);
  }
},
  async update(ctx) {
  const { id } = ctx.params;
  const { permissions } = ctx.request.body;

  // تحويل المصفوفة إلى كائن
  const formattedPermissions = permissions?.reduce((acc, perm) => {
    acc[perm] = true;
    return acc;
  }, {});

  try {
    const updatedUser = await strapi.entityService.update(
      'plugin::users-permissions.user',
      id,
      { data: { permissions: formattedPermissions } }
    );
    return updatedUser;
  } catch (err) {
    ctx.throw(500, err);
  }
},
async delete(ctx) {
  const { id } = ctx.params;
  try {
    await strapi.entityService.delete('plugin::users-permissions.user', id);
    return { message: 'تم حذف المستخدم بنجاح' };
  } catch (err) {
    ctx.throw(500, err);
  }
}
};