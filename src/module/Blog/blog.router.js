const express = require("express");
const {
  getAllBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("./blogsAdmin.controller");
const router = express.Router();

router.get("/get-blog", getAllBlog);
router.post("/blog-create", createBlog);
router.put("blog/:id", updateBlog);
router.delete("blog/:id", deleteBlog);

const blogRouter = router;
module.exports = blogRouter;
