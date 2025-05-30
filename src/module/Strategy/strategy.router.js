const express = require("express");
const {
  getAllStrategies,
  getStrategyById,
  createStrategy,
  updateStrategy,
  deleteStrategy,
} = require("./strategy.controller");
const router = express.Router();

router.post("/create", createStrategy); // Assuming you want to create a strategy
router.get("/get", getAllStrategies); // Assuming you want to get all strategies)
router.get("/:id", getStrategyById); // Assuming you want to get a strategy by ID
router.put("/:id", updateStrategy);
router.delete("/:id", deleteStrategy); // Assuming you want to delete a strategy by ID

const strategyRouter = router;
module.exports = strategyRouter;
