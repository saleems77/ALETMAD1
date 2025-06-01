export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  cors: {
    enabled: true,
    origin: ['https://arab-platt-form.vercel.app'], // إضافة عنوان Next.js هنا
  },
});
