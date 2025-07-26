const { Schema, model } = require("mongoose");

const dataSetSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    dataSets: [
      {
        type: Schema.Types.Mixed,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const DataSet = model("DataSet", dataSetSchema);
module.exports = DataSet;
