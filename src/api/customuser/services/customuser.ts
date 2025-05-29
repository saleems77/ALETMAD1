module.exports = {
  async createWithRole(data) {
    const { role, permissions, ...userData } = data;
    const user = await super.create(userData, {
      populate: {
        costumrole: true,
        costumpermissions: true
      },
    });

    // Assign role and permissions
    if (role) {
      await strapi.entityService.update('api::customuser.customuser', user.id, {
        data: { costumrole: role },
        populate: { costumrole: true }
      });
    }

    if (permissions?.length > 0) {
      await strapi.entityService.update('api::customuser.customuser', user.id, {
        data: { costumpermissions: permissions },
        populate: { costumpermissions: true }
      });
    }

    return await this.findOne(user.id, {
      populate: ['costumrole', 'costumpermissions']
    });
  },

  // Ensure you extend the default findOne method
  async findOne(id,populate = {}) {
    return await super.findOne(id, {
      populate: populate || ['costumrole', 'costumpermissions']
    });
  }
};