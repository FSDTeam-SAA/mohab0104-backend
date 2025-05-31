const mongoose = require("mongoose");

const blogsAdminSchema = new mongoose.Schema(
  {
    blogTitle: {
      type: String,
    },
    blogDescription: {
      type: String,
    },
    imageLink: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const blogsAdmin = mongoose.model("blogsAdmin", blogsAdminSchema);
module.exports = blogsAdmin;
