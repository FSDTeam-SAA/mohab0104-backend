const express = require("express");
const {
  getAllSolutions,
  getSolutionById,
  createSolution,
  updateSolution,
  deleteSolution,
} = require("./solution.controller");
const router = express.Router();

router.get("/get", getAllSolutions);
// Assuming you want to get a solution by ID
router.get("/:id", getSolutionById);
router.post("/create", createSolution); // Assuming you want to create a solution
router.put("/:id", updateSolution); // Assuming you want to update a solution by ID
router.delete("/:id", deleteSolution); // Assuming you want to delete a solution by ID

const solutionRouter = router;
module.exports = solutionRouter;
