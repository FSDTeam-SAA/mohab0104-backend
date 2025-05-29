const { Router } = require("express");
const userRouter = require("../module/user/user.router");
const authRouter = require("../module/auth/auth.router");
const { path } = require("../app");
const blogRouter = require("../module/Blog/blog.router");

const router = Router();

const moduleRouter = [
  {
    path: "/user",
    router: userRouter,
  },
  {
    path: "/auth",
    router: authRouter,
  },
  // Add other module routers here
  //blogRouter
  {
    path: "/blog",
    router: blogRouter,
  },
];

moduleRouter.forEach((route) => {
  router.use(route.path, route.router);
});

module.exports = router;
