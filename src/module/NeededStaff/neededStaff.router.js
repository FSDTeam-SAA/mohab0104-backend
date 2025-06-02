const express = require("express");
const {
  getNeededStaffByUser,
  createNeededStaff,
  getAllNeededStaff,
  getSingleNeededStaff,
  updateNeededStaff,
  deleteNeededStaff,
} = require("./neededStaff.controller");
const router = express.Router();
const auth = require("../../middleware/auth");
const USER_ROLE = require("../user/user.constant");

// Assuming you want to create a needed staff member
router.post("/create", auth(USER_ROLE.user), createNeededStaff);
router.get("/get", auth(USER_ROLE.admin), getAllNeededStaff);
router.get("/my-needed-staff", auth(USER_ROLE.user), getNeededStaffByUser); // Assuming you want to get all needed staff by user
router.get("/:id", auth(USER_ROLE.admin, USER_ROLE.user), getSingleNeededStaff); // Assuming you want to get a staff member by ID
router.put("/:id", auth(USER_ROLE.admin, USER_ROLE.user), updateNeededStaff); // Assuming you want to update a staff member by ID
router.delete("/:id", auth(USER_ROLE.admin, USER_ROLE.user), deleteNeededStaff); // Assuming you want to delete a staff member by ID
const neededStaffRouter = router;
module.exports = neededStaffRouter;
