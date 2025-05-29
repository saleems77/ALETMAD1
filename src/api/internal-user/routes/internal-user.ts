// src/api/internal-users/routes/internal-users.ts
export default {
  routes: [
    {
      method: 'GET',
      path: '/internal-users',
      handler: 'internal-users.find',
      config: { policies: ['admin::isAuthenticatedAdmin'] }, // حماية النقطة
    },
    {
      method: 'POST',
      path: '/internal-users',
      handler: 'internal-users.create',
      config: { policies: ['admin::isAuthenticatedAdmin'] },
    },
    {
  method: 'PUT',
  path: '/internal-users/:id',
  handler: 'internal-users.update',
  config: { policies: ['admin::isAuthenticatedAdmin'] }
},
{
  method: 'DELETE',
  path: '/internal-users/:id',
  handler: 'internal-users.delete',
  config: { policies: ['admin::isAuthenticatedAdmin'] },
}
  ],
};