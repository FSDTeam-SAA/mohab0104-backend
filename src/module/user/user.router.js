const { Router } = require("express");
const userController = require("./user.controller");
const auth = require("../../middleware/auth");
const USER_ROLE = require("./user.constant");

const router = Router();

router.post("/create", userController.createUser);
router.get("/", userController.getAllUsers);
router.get(
  "/profile",
  auth(USER_ROLE.user, USER_ROLE.admin),
  userController.getMyProfile
);

router.put(
  "/update-profile",
  auth(USER_ROLE.user, USER_ROLE.admin),
  userController.updateUserProfile
);

const userRouter = router;
module.exports = userRouter;
