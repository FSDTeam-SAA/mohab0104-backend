const fs = require("fs");
const path = require("path");
const User = require("../user/user.model");
const DataSet = require("./dataset.model");

const createDataSet = async (userId, filePath) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const rawData = await fs.promises.readFile(filePath, "utf-8");

  let jsonData;
  try {
    jsonData = JSON.parse(rawData);
  } catch (err) {
    throw new Error("Invalid JSON format");
  }

  let finalDataSets = [];

  if (Array.isArray(jsonData)) {
    finalDataSets = jsonData; // Directly assign the array
  } else if (typeof jsonData === "object" && jsonData !== null) {
    finalDataSets = [jsonData]; // Wrap single object in array
  } else {
    throw new Error("Unsupported JSON format");
  }

  // Create one document with an array of mixed-type data
  const newDataSet = await DataSet.create({
    userId,
    dataSets: finalDataSets,
  });

  // Link it to the user
  user.dataSets.push(newDataSet._id);
  await user.save();

  return newDataSet;
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
