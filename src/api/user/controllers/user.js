// api/user/controllers/user.js
module.exports = {
  async me(ctx) {
    try {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized();

      const populatedUser = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        user.id,
        { populate: ["role"] }
      );

      return populatedUser;
    } catch (err) {
      return ctx.badRequest(err.message);
    }
  },
};
