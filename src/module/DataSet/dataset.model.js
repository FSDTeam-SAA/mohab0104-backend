const { Schema, model, models } = require("mongoose");

const dataSetSchema = new Schema(
  {
    dataSetName: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    dataSets: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const DataSet = models.DataSet || model("DataSet", dataSetSchema);
module.exports = DataSet;
