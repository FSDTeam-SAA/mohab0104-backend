const fs = require("fs");
const User = require("../user/user.model");
const DataSet = require("./dataset.model");
const { default: mongoose } = require("mongoose");

const createDataSet = async (userId, file) => {
  if (!file) {
    throw new Error("No file uploaded");
  }

  // Validate ObjectId format before querying
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid userId format");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  let fileContent;
  try {
    fileContent = fs.readFileSync(file.path, "utf-8");
  } catch (error) {
    throw new Error("Error reading uploaded file");
  }

  let parsedData;
  try {
    parsedData = JSON.parse(fileContent);
  } catch (error) {
    throw new Error("Uploaded file is not valid JSON");
  }

  const dataSets = Array.isArray(parsedData) ? parsedData : [parsedData];

  let result;
  try {
    result = await DataSet.create({
      userId: mongoose.Types.ObjectId(userId),
      dataSets,
    });
    console.log("Saved result:", result);
  } catch (err) {
    console.error("Error saving to MongoDB:", err);
    // Throw the original error for controller to handle
    throw err;
  }

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

const updateDataSet = async (dataSetId, file) => {
  const doc = await DataSet.findById(dataSetId);
  if (!doc) throw new Error("Data set not found");

  if (!file) throw new Error("No file uploaded");

  const fileContent = fs.readFileSync(file.path, "utf-8");
  console.log(fileContent);

  let parsedData;
  try {
    parsedData = JSON.parse(fileContent);
  } catch {
    throw new Error("Invalid JSON file");
  }

  const dataSets = Array.isArray(parsedData) ? parsedData : [parsedData];
  console.log("final data set", dataSets);

  doc.dataSets = dataSets;
  const result = await doc.save();

  // Optionally delete file
  fs.unlink(file.path, (err) => {
    if (err) console.error("Failed to delete file:", err);
  });

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
