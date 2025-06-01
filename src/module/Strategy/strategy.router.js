const express = require("express");
const {
  getAllStrategies,
  getStrategyById,
  createStrategy,
  updateStrategy,
  deleteStrategy,
  getStrategiesByUserEmail,
} = require("./strategy.controller");
const router = express.Router();
const auth = require("../../middleware/auth");
const USER_ROLE = require("../user/user.constant");

router.post("/create", auth(USER_ROLE.user), createStrategy); // Assuming you want to create a strategy
router.get("/get", auth(USER_ROLE.admin), getAllStrategies); // Assuming you want to get all strategies)
router.get("/my-strategy", auth(USER_ROLE.user), getStrategiesByUserEmail); // Assuming you want to get a strategy by email
router.get("/:id", getStrategyById); // Assuming you want to get a strategy by ID
router.put("/:id", updateStrategy);
router.delete("/:id", deleteStrategy); // Assuming you want to delete a strategy by ID

const strategyRouter = router;
module.exports = strategyRouter;
