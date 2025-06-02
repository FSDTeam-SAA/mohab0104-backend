const express = require("express");
const {
  createServices,
  getAllService,
  updateService,
  deleteService,
  getSingleService,
} = require("./servicesAdmin.controller");
const { upload } = require("../../utilts/cloudnary");
const auth = require("../../middleware/auth");
const USER_ROLE = require("../user/user.constant");
const router = express.Router();

router.post(
  "/create",
  upload.single("image"),
  (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  auth(USER_ROLE.admin),
  createServices
);

router.get("/get", getAllService);
router.get("/:id", getSingleService); // Assuming you want to get a service by ID
router.put(
  "/:id",
  upload.single("image"),
  (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  auth(USER_ROLE.admin),
  updateService
); // Assuming you want to update a service by ID
router.delete("/:id", auth(USER_ROLE.admin), deleteService); // Assuming you want to delete a service by ID

const serviceRouter = router;
module.exports = serviceRouter;
