module.exports = {
  async login(ctx) {
    const { identifier, password } = ctx.request.body;
    const user = await super.login(ctx);

    if (!user.costumrole || !user.isActive) {
      throw new Error("Access denied");
    }

    return {
      jwt: user.jwt,
      user: {
        id: user.user.id,
        name: user.user.name,
        role: user.user.costumrole,
        permissions: user.user.permissions,
      },
    };
  },
};
