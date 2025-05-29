export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  cors: {
    enabled: true,
    origin: ['http://localhost:3000'], // إضافة عنوان Next.js هنا
  },
});
