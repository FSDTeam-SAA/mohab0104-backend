const mongoose = require("mongoose");
const strategySchema = new mongoose.Schema(
  {
    solutionName: {
      type: String,
      required: true,
    },
    solutionDescription: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Solution = mongoose.model("Solution", strategySchema);
module.exports = Solution;
