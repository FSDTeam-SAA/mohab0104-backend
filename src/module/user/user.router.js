const { Router } = require("express");
const userController = require("./user.controller");
const auth = require("../../middleware/auth");
const USER_ROLE = require("./user.constant");
const { upload } = require("../../utilts/cloudnary");

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
  upload.single("image"),
  (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  userController.updateUserProfile
);

const userRouter = router;
module.exports = userRouter;
