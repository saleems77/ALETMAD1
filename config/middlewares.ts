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
origin: [
        'https://copy-platt-form.vercel.app', // Frontend URL
        'http://localhost:3000' // For local testing
      ],      headers: ['Content-Type', 'Authorization', 'X-Requested-With'],
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