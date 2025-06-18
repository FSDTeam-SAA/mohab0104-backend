const { Router } = require("express");
const userController = require("./user.controller");
const auth = require("../../middleware/auth");
const USER_ROLE = require("./user.constant");
const { upload } = require("../../utilts/cloudnary");

const router = Router();

router.post("/create", userController.createUser);
router.post(
  "/verify-email",
  auth(USER_ROLE.user, USER_ROLE.admin),
  userController.verifyEmail
);

router.post(
  "/resend-otp",
  auth(USER_ROLE.user, USER_ROLE.admin),
  userController.resendOtpCode
);

router.get("/", userController.getAllUsers);

router.get(
  "/profile",
  auth(USER_ROLE.user, USER_ROLE.admin),
  userController.getMyProfile
);

router.get(
  "/admin-stats",
  auth(USER_ROLE.admin),
  userController.getAdminDashboardStats
);

router.put(
  "/update-profile",
  auth(USER_ROLE.user, USER_ROLE.admin),
  upload.single("image"),
  (req, res, next) => {
    if (req.body?.data) {
      try {
        req.body = JSON.parse(req.body.data);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Invalid JSON format in 'data' field",
        });
      }
    }
    next();
  },
  userController.updateUserProfile
);

const userRouter = router;
module.exports = userRouter;
