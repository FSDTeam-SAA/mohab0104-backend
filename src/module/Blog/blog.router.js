const express = require("express");
const {
  getAllBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getSingleBlog,
} = require("./blogsAdmin.controller");
const upload = require("../../middleware/multer.middleware");
const router = express.Router();

router.get("/get", getAllBlog);
router.get("/:id", getSingleBlog); // Assuming you want to get a blog by ID
router.post("/create",upload.single('imageLink'), createBlog);
router.put("/:id",upload.single('imageLink'), updateBlog);
router.delete("/:id", deleteBlog);

const blogRouter = router;
module.exports = blogRouter;
