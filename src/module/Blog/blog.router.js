const express = require("express");
const {
  getAllBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getSingleBlog,
} = require("./blogsAdmin.controller");
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
  createBlog
);

router.get("/get", getAllBlog);
router.get("/:id", getSingleBlog);

router.put(
  "/:id",
  upload.single("image"),
  (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  auth(USER_ROLE.admin),
  updateBlog
);

router.delete("/:id", auth(USER_ROLE.admin), deleteBlog);

const blogRouter = router;
module.exports = blogRouter;
