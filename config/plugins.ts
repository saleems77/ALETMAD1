module.exports = ({ env }) => ({
  
  'users-permissions': {
        enabled: true,
    config: {
      jwt: {
        expiresIn: '7d',
      },
      register: {
        allowedFields: ['username', 'email', 'phone', 'whatsapp'],
      },
      providers: [
        {
          uid: 'google',
          displayName: 'Google',
          icon: 'google',
          key: env('GOOGLE_CLIENT_ID'),
          secret: env('GOOGLE_CLIENT_SECRET'),
          callbackUrl: `${env('STRAPI_URL')}/api/auth/google/callback`,
          scope: ['email', 'profile']
        }
      ],
    },
  },
});