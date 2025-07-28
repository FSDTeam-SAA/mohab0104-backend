const dataSetService = require("./dataset.service");

const createDataSet = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const result = await dataSetService.createDataSet(userId, req.file);

    return res.status(200).json({
      success: true,
      message: "Data added successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to save data",
      error: error, // send full error details if any
    });
  }
};

const getDataSet = async (req, res) => {
  try {
    const result = await dataSetService.getDataSet();

    return res.status(200).json({
      success: true,
      message: "All Data retrieved successfully",
      data: result,
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
    const result = await dataSetService.updateDataSet(dataSetId, req.file);

    return res.status(200).json({
      success: true,
      message: "Data updated successfully",
      data: result,
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
    const result = await dataSetService.deletedDataSet(dataSetId);

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
