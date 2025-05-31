const mongoose = require("mongoose");

const servicesAdminSchema = new mongoose.Schema(
  {
    serviceTitle: {
      type: String,
    },
    serviceDescription: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    imageLink: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const servicesAdmin = mongoose.model("servicesAdmin", servicesAdminSchema);
module.exports = servicesAdmin;
