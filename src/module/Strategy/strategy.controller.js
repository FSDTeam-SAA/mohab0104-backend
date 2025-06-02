const User = require("../user/user.model");
const strategy = require("./strategy.model");

//create strategy
exports.createStrategy = async (req, res) => {
  try {
    const { email: userEmail } = req.user; // Assuming user email is available in req.user
    if (!userEmail) {
      return res.status(400).json({
        status: false,
        message: "User not found.",
      });
    }
    const newStrategy = await strategy.create({
      name: req.body.name,
      email: req.body.email,
      companyName: req.body.companyName,
      dataStrategy: req.body.dataStrategy,
      strategyDescription: req.body.strategyDescription,
      views: 0, // Initialize views to 0
    });
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
    const { email: userEmail } = req.user;

    if (!userEmail) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const filter = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { companyName: { $regex: search, $options: "i" } },
      ],
    };

    const strategies = await strategy
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalSolutions = await strategy.countDocuments(filter);

    return res.status(200).json({
      status: true,
      message: "Solutions retrieved successfully",
      data: strategies,
      totalPages: Math.ceil(totalSolutions / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error retrieving strategies:", error);
    return res.status(500).json({
      status: false,
      message: "Error retrieving strategies",
      error: error.message,
    });
  }
};

//get strategies by user email
exports.getStrategiesByUserEmail = async (req, res) => {
  try {
    const { email: userEmail } = req.user; // Assuming user email is available in req.user
    console.log("userEmail", req.user);
    const isExist = await User.findOne({ email: userEmail });
    if (!isExist) {
      return res.status(400).json({
        status: false,
        message: "User not found.",
      });
    }
    const strategies = await strategy.find({ email: userEmail });
    if (strategies.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No strategies found for this user",
      });
    }
    res.status(200).json({
      status: true,
      message: "Strategies retrieved successfully",
      data: strategies,
    });
  } catch (error) {
    console.error("Error retrieving strategies by user email:", error);
    res.status(500).json({
      status: false,
      message: "Error retrieving strategies by user email",
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
