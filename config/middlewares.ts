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
      origin: ['http://localhost:3000', 'https:http://localhost:1337'],
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