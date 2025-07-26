const User = require("../user/user.model");
const DataSet = require("./dataset.model");

const createDataSet = async (payload, userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const result = await DataSet.create({ userId: user._id, dataSets: payload });
  return result;
};

const getDataSet = async () => {
  const result = await DataSet.find().populate({
    path: "userId",
    select: "companyName",
  });
  return result;
};

const getMyDataSet = async (userId) => {
  const result = await DataSet.find({ userId }).populate({
    path: "userId",
    select: "companyName",
  });
  return result;
};

const getSingleDataSet = async (dataSetId) => {
  const result = await DataSet.findById(dataSetId).populate({
    path: "userId",
    select: "companyName",
  });
  return result;
};

const updateDataSet = async (dataSetId, payload) => {
  const doc = await DataSet.findById(dataSetId);
  if (!doc) throw new Error("Data set not found");

  doc.dataSets = payload;
  const result = await doc.save();

  return result;
};

const deletedDataSet = async (dataSetId) => {
  const doc = await DataSet.findById(dataSetId);
  if (!doc) throw new Error("Data set not found");

  await DataSet.findByIdAndDelete(dataSetId);
};

const dataSetService = {
  createDataSet,
  getDataSet,
  getMyDataSet,
  getSingleDataSet,
  updateDataSet,
  deletedDataSet,
};

module.exports = dataSetService;
