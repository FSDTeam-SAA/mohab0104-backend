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
router.post("/create", auth(USER_ROLE.admin), createSolution); // Assuming you want to create a solution
router.put("/:id", auth(USER_ROLE.admin), updateSolution); // Assuming you want to update a solution by ID
router.delete("/:id", auth(USER_ROLE.admin), deleteSolution); // Assuming you want to delete a solution by ID

const solutionRouter = router;
module.exports = solutionRouter;
