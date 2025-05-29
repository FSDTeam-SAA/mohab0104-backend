const { Router } = require("express");
const userController = require("./user.controller");

const router = Router();

router.post("/create", userController.createUser);
router.get("/", userController.getAllUsers);
router.get("/profile", userController.getMyProfile); //! check it_______
router.delete("/:id", userController.deletedUser); //! check it_______

const userRouter = router;
module.exports = userRouter;
