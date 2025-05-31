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
router.get("/:id", getSingleBlog); // Assuming you want to get a blog by ID
router.post(
  "/create",
  upload.single("image"),
  (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  createBlog
);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);

const blogRouter = router;
module.exports = blogRouter;
