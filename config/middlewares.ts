module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
       config: {
      contentSecurityPolicy: false     
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: ['https://arab-platt-form.vercel.app', 'https:https://amazing-cabbage-7632d69005.strapiapp.com/api'],
      headers: ['Content-Type', 'Authorization', 'X-Requested-With'],
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],

    }
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public'
];