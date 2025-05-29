import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::course.course', {
  only: ['find', 'findOne', 'create', 'update', 'delete'],
  config: {
    find: {
      auth: false,
      // إضافة هذه الإعدادات لتفعيل الفلترة والترحيم
      policies: [],
      middlewares: []
    },
    findOne: {
      auth: false,
      policies: [],
      middlewares: []
    },
    create: {
      auth: { scope: ['api::course.course.create'] },
      policies: [],
      middlewares: []
    },
    update: {
      auth: { scope: ['api::course.course.update'] },
      policies: [],
      middlewares: []
    },
    delete: {
      auth: { scope: ['api::course.course.delete'] },
      policies: [],
      middlewares: []
    }
  }
});