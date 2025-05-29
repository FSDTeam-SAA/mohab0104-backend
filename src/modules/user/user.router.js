const { Router } = require("express");
const userController = require("./user.controller");

const router = Router();

router.post("/create", userController.createUser);

const userRouter = router;
module.exports = userRouter;
