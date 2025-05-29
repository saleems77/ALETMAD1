module.exports = {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/customusers/:id',
      handler: 'customuser.findOne',
      config: {
        policies: [],
      },
    },
  ],
};