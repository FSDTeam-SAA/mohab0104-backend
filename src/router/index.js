const { Router } = require("express");
const userRouter = require("../module/user/user.router");
const authRouter = require("../module/auth/auth.router");
const { path } = require("../app");
const blogRouter = require("../module/Blog/blog.router");
const serviceRouter = require("../module/Services/service.router");
const solutionRouter = require("../module/Solution/solution.router");
const strategyRouter = require("../module/Strategy/strategy.router");
const paymentRouter = require("../module/payments/payment.router");
const sendMessageRouter = require("../module/contract/contract.router");
const neededStaffRouter = require("../module/NeededStaff/neededStaff.router");
const router = Router();

const moduleRouter = [
  {
    path: '/user',
    router: userRouter,
  },
  {
    path: '/auth',
    router: authRouter,
  },
  // Add other module routers here
  //blogRouter
  {
    path: '/blog',
    router: blogRouter,
  },
  //servicesRouter
  {
    path: '/services',
    router: serviceRouter,
  },
  //solutionRouter
  {
    path: '/solution',
    router: solutionRouter,
  },
  //strategyRouter
  {
    path: '/strategy',
    router: strategyRouter,
  },
  {
    path: '/payment',
    router: paymentRouter,
  },
  {
    path: '/contact',
    router: sendMessageRouter,
  },
  {
    path: '/needed-staff',
    router: neededStaffRouter
  }
]

moduleRouter.forEach((route) => {
  router.use(route.path, route.router);
});

module.exports = router;
