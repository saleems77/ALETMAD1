module.exports = {
  async createWithRole(ctx) {
    try {
      const { data } = ctx.request.body;
      const user = await strapi.service('api::customuser.customuser').createWithRole(data);
      return ctx.created(user);
    } catch (err) {
      return ctx.badRequest(err.message);
    }
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const user = await strapi.service('api::customuser.customuser').findOne(id, {
      populate: ['costumrole', 'costumpermissions']
    });
    
    if (!user) {
      return ctx.notFound('User not found');
    }

    return ctx.send(user);
  }
};