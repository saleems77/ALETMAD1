module.exports = ({ env }) => ({
  proxy: true,
  url: env('MY_HEROKU_URL'), // سيتم تعيينه لاحقاً في السحابة
  app: {
    keys: env.array('APP_KEYS'),
  },
});