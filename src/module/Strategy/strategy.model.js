const mongoose = require("mongoose");
const strategySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    dataStrategy: {
      type: String,
      required: true,
    },
    strategyDescription: {
      type: String,
      required: true,
    },
    answer: {
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
const Strategy = mongoose.model("Strategy", strategySchema);
module.exports = Strategy;
