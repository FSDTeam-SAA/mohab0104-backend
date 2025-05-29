const { Router } = require("express");
const authController = require("./auth.controller");

const router = Router();

router.post("/login", authController.loginUser);
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-token", authController.verifyToken);

const authRouter = router;
module.exports = authRouter;
