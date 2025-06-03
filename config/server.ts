export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  proxy: true,
  url: env('PUBLIC_ADMIN_URL', 'https://sublime-dinosaurs-4dd432ee51.strapiapp.com'),
  
  cors: {
    enabled: true,
    origin: ['https://copy-platt-form.vercel.app'], // إضافة عنوان Next.js هنا
  },
});
