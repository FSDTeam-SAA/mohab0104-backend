const mongoose = require("mongoose");
const neededStaffSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    businessEmail: {
      type: String,
      required: true,

      match: /.+\@.+\..+/,
    },
    companyName: {
      type: String,
      required: true,
    },
    staffDescription: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const NeededStaff = mongoose.model("NeededStaff", neededStaffSchema);
module.exports = NeededStaff;
