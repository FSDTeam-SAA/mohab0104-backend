const mongoose = require("mongoose");

const servicesAdminSchema = new mongoose.Schema(
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
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const servicesAdmin = mongoose.model("servicesAdmin", servicesAdminSchema);
module.exports = servicesAdmin;
