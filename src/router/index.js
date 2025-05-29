const { Router } = require("express");
const userRouter = require("../module/user/user.router");
const authRouter = require("../module/auth/auth.router");

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
];

moduleRouter.forEach((route) => {
  router.use(route.path, route.router);
});

module.exports = router;
