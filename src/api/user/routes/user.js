// src/api/user/routes/user.js
module.exports = {
  routes: [
    {
      method: "POST",
      path: "/users",
      handler: "user.create",
      config: {
        policies: ["admin::isAuthenticatedAdmin"],
      },
    },
    {
      method: "GET",
      path: "/users/check-email/:email",
      handler: "user.checkEmail",
      config: {
        policies: ["admin::isAuthenticatedAdmin"],
      },
    },
  ],
};
