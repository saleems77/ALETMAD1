// api/customuser/config/policies/admin.js

module.exports = (policyContext, config, { strapi }) => {
  if (policyContext.state.user.role.name === "Admin") {
    return true;
  }
  return false;
};
