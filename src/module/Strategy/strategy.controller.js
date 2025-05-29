const strategy = require("./strategy.model");

//create strategy
exports.createStrategy = async (req, res) => {
  try {
    const newStrategy = await strategy.createStrategy(req.body);
    res.status(201).json({
      status: true,
      message: "Strategy created successfully",
      data: newStrategy,
    });
  } catch (error) {
    console.error("Error creating strategy:", error);
    res.status(500).json({
      status: false,
      message: "Error creating strategy",
      error: error.message,
    });
  }
};

//get all strategies
exports.getAllStrategies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const filter = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { companyName: { $regex: search, $options: "i" } },
      ],
    };

    const strategies = await strategy
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalStrategies = await strategy.countDocuments(filter);

    res.status(200).json({
      status: true,
      message: "Strategies retrieved successfully",
      data: strategies,
      totalPages: Math.ceil(totalStrategies / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error retrieving strategies:", error);
    res.status(500).json({
      status: false,
      message: "Error retrieving strategies",
      error: error.message,
    });
  }
};

//get strategy by id
exports.getStrategyById = async (req, res) => {
  try {
    const strategyId = req.params.id;
    const strategyData = await strategy.findById(strategyId);

    if (!strategyData) {
      return res.status(404).json({
        status: false,
        message: "Strategy not found",
      });
    }

    // Increment views count
    strategyData.views += 1;
    await strategyData.save();

    res.status(200).json({
      status: true,
      message: "Strategy retrieved successfully",
      data: strategyData,
    });
  } catch (error) {
    console.error("Error retrieving strategy:", error);
    res.status(500).json({
      status: false,
      message: "Error retrieving strategy",
      error: error.message,
    });
  }
};

//update strategy
exports.updateStrategy = async (req, res) => {
  try {
    const strategyId = req.params.id;
    const updatedStrategy = await strategy.findByIdAndUpdate(
      strategyId,
      req.body,
      { new: true }
    );

    if (!updatedStrategy) {
      return res.status(404).json({
        status: false,
        message: "Strategy not found",
      });
    }
    res.status(200).json({
      status: true,
      message: "Strategy updated successfully",
      data: updatedStrategy,
    });
  } catch (error) {
    console.error("Error updating strategy:", error);
    res.status(500).json({
      status: false,
      message: "Error updating strategy",
      error: error.message,
    });
  }
};
//delete strategy
exports.deleteStrategy = async (req, res) => {
  try {
    const strategyId = req.params.id;
    const deletedStrategy = await strategy.findByIdAndDelete(strategyId);

    if (!deletedStrategy) {
      return res.status(404).json({
        status: false,
        message: "Strategy not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Strategy deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting strategy:", error);
    res.status(500).json({
      status: false,
      message: "Error deleting strategy",
      error: error.message,
    });
  }
};
