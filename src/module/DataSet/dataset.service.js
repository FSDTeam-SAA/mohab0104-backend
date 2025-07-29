const fs = require("fs");
const path = require("path");
const User = require("../user/user.model");
const DataSet = require("./dataset.model");
const { sendImageToCloudinary } = require("../../utilts/cloudnary");

const createDataSet = async (userId, file) => {
  console.log(file); // ✅ good for debugging

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  if (!file) throw new Error("File is required");

  const imageName = `${Date.now()}-${file.originalname}`;
  const filePath = file.path;

  const { secure_url } = await sendImageToCloudinary(imageName, filePath);

  const dataSet = await DataSet.create({
    userId: userId,
    dataSets: secure_url,
  });

  return dataSet;
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
