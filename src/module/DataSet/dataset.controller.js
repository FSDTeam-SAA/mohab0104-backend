const { sendImageToCloudinary } = require("../../utilts/cloudnary");
const paymentInfo = require("../payments/payment.model");
const User = require("../user/user.model");
const DataSet = require("./dataset.model");
const dataSetService = require("./dataset.service");

const createDataSet = async (req, res) => {
  try {
    const { userId } = req.params;
    const { dataSetName } = req.body;
    const file = req.file;

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const payment = await paymentInfo.findOne({ userId: userId });
    if (!payment) throw new Error("Payment not found");

    if (!file) throw new Error("File is required");

    const imageName = `${Date.now()}-${file.originalname}`;
    const filePath = file.path;

    const { secure_url } = await sendImageToCloudinary(imageName, filePath);

    const dataSet = new DataSet({
      dataSetName: dataSetName,
      userId: userId,
      dataSets: secure_url,
    });

    const _dataset = await dataSet.save();

    res.status(200).json({
      success: true,
      message: "Data set created",
      data: _dataset,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const getDataSet = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default limit is 10

    const result = await dataSetService.getDataSet(page, limit);

    return res.status(200).json({
      success: true,
      message: "Data retrieved successfully",
      ...result, // includes data, total, page, totalPages
    });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: error.message, error });
  }
};

const getMyDataSet = async (req, res) => {
  try {
    const { userId } = req.user;
    const result = await dataSetService.getMyDataSet(userId);

    return res.status(200).json({
      success: true,
      message: "Data retrieved successfully",
      data: result,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: error.message, error });
  }
};

const getSingleDataSet = async (req, res) => {
  try {
    const { dataSetId } = req.params;
    const result = await dataSetService.getSingleDataSet(dataSetId);

    return res.status(200).json({
      success: true,
      message: "Data details retrieved successfully",
      data: result,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: error.message, error });
  }
};

const updateDataSet = async (req, res) => {
  try {
    const { dataSetId } = req.params;
    const { dataSetName } = req.body;
    const file = req.file;

    const data = await DataSet.findById(dataSetId);
    if (!data) throw new Error("Data not found");

    // if (!file) throw new Error("File is required");

    const imageName = `${Date.now()}-${file.originalname}`;
    const filePath = file.path;

    const { secure_url } = await sendImageToCloudinary(imageName, filePath);

    const dataSet = await DataSet({
      dataSetName: dataSetName,
      dataSetId,
      dataSets: secure_url,
    });

    const _dataset = await dataSet.save();

    return res.status(200).json({
      success: true,
      message: "Data updated successfully",
      data: _dataset,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: error.message, error });
  }
};

const deletedDataSet = async (req, res) => {
  try {
    const { dataSetId } = req.params;
    await dataSetService.deletedDataSet(dataSetId);

    return res.status(200).json({
      success: true,
      message: "Data deleted successfully",
    });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: error.message, error });
  }
};

const dataSetController = {
  createDataSet,

  getDataSet,
  getMyDataSet,
  getSingleDataSet,
  updateDataSet,
  deletedDataSet,
};

module.exports = dataSetController;
