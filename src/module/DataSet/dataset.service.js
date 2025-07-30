const DataSet = require("./dataset.model");

const getDataSet = async (page, limit) => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    DataSet.find().skip(skip).limit(limit).populate({
      path: "userId",
      select: "companyName firstName lastName email imageLink",
    }),
    DataSet.countDocuments(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    total,
    page,
    totalPages,
  };
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

const deletedDataSet = async (dataSetId) => {
  const doc = await DataSet.findById(dataSetId);
  if (!doc) throw new Error("Data set not found");

  await DataSet.findByIdAndDelete(dataSetId);
};

const dataSetService = {
  getDataSet,
  getMyDataSet,
  getSingleDataSet,
  deletedDataSet,
};

module.exports = dataSetService;
