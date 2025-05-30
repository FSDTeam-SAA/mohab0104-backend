const express = require("express");
const {
  createServices,
  getAllService,
  updateService,
  deleteService,
  getSingleService,
} = require("./servicesAdmin.controller");
const router = express.Router();

router.post("/create", createServices);
router.get("/get", getAllService);
router.get("/:id", getSingleService); // Assuming you want to get a service by ID
router.put("/:id", updateService); // Assuming you want to update a service by ID
router.delete("/:id", deleteService); // Assuming you want to delete a service by ID

const serviceRouter = router;
module.exports = serviceRouter;
