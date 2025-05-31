const express = require("express");
const {
  getAllBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getSingleBlog,
} = require("./blogsAdmin.controller");
const { upload } = require("../../utilts/cloudnary");
const router = express.Router();

router.get("/get", getAllBlog);
router.get("/:id", getSingleBlog);
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
