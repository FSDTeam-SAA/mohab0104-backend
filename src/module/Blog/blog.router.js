const express = require("express");
const {
  getAllBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getSingleBlog,
} = require("./blogsAdmin.controller");
const router = express.Router();

router.get("/get", getAllBlog);
router.get("/:id", getSingleBlog); // Assuming you want to get a blog by ID
router.post("/create", createBlog);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);

const blogRouter = router;
module.exports = blogRouter;
