import { factories } from '@strapi/strapi';
import { Context } from 'koa';

export default factories.createCoreController('api::course.course', ({ strapi }) => ({
  async find(ctx: Context) {
    try {
      // إضافة populate لاسترداد العلاقات
      const { results, pagination } = await strapi.service('api::course.course').find({
        ...ctx.query,
        populate: '*' // أو حدد الحقول المطلوبة يدويًا
      });
      
      // الحل: استخدم super بدلاً من this
      return super.transformResponse(results, { pagination });
    } catch (error) {
      strapi.log.error('Error fetching courses:', error);
      return ctx.internalServerError('Internal Server Error');
    }
  },
  
  async findOne(ctx: Context) {
    try {
      const { id } = ctx.params;
      const entity = await strapi.entityService.findOne('api::course.course', id, {
        populate: { users_permissions_user: true }, // تضمين بيانات المدرب
        ...ctx.query
      });

      if (!entity) {
        return ctx.notFound('Course not found');
      }

      // الحل: استخدم super بدلاً من this
      return super.transformResponse(entity);
    } catch (error) {
      strapi.log.error('Error fetching course:', error);
      return ctx.internalServerError('Internal Server Error');
    }
  }
}));