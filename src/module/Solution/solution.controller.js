const solutions = require("./solutions.model");

exports.createSolution = async (req, res) => {
  try {
    const { email: userEmail } = req.user;

    if (!userEmail) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    // Create a new solution
    const newSolution = await solutions.create({
      solutionName: req.body.solutionName,
      solutionDescription: req.body.solutionDescription,
    });

    return res.status(201).json({
      status: true,
      message: "Solution created successfully",
      data: newSolution,
    });
  } catch (error) {
    
    return res.status(500).json({
      status: false,
      message: "Error creating solution",
      error: error.message,
    });
  }
};

// Get all solutions with pagination and search

exports.getAllSolutions = async (req, res) => {
  try {
    console.log("first")
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit
    const search = req.query.search || ''

    const filter = {
      $or: [
        { solutionName: { $regex: search, $options: 'i' } },
        { solutionDescription: { $regex: search, $options: 'i' } },
      ],
    }

    const [totalItems, solutionsList] = await Promise.all([
      solutions.countDocuments(filter),
      solutions.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ])

    const totalPages = Math.ceil(totalItems / limit)

    return res.status(200).json({
      success: true,
      message: 'Solutions retrieved successfully',
      data: solutionsList,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error retrieving solutions',
      error: error.message,
    })
  }
}

// Update a solution by ID
exports.updateSolution = async (req, res) => {
  try {
    const { email: userEmail } = req.user;

    if (!userEmail) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const solutionId = req.params.id;
    const updatedSolution = await solutions.findByIdAndUpdate(
      solutionId,
      req.body,
      { new: true }
    );

    if (!updatedSolution) {
      return res.status(404).json({
        status: false,
        message: "Solution not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Solution updated successfully",
      data: updatedSolution,
    });
  } catch (error) {
    
    return res.status(500).json({
      status: false,
      message: "Error updating solution",
      error: error.message,
    });
  }
};
// Delete a solution by ID

exports.deleteSolution = async (req, res) => {
  try {
    const { email: userEmail } = req.user;

    if (!userEmail) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const solutionId = req.params.id;
    const deletedSolution = await solutions.findByIdAndDelete(solutionId);

    if (!deletedSolution) {
      return res.status(404).json({
        status: false,
        message: "Solution not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Solution deleted successfully",
      data: deletedSolution,
    });
  } catch (error) {
    
    return res.status(500).json({
      status: false,
      message: "Error deleting solution",
      error: error.message,
    });
  }
};
// Get a solution by ID
exports.getSolutionById = async (req, res) => {
  try {
    const solutionId = req.params.id;
    const solution = await solutions.findById(solutionId);

    if (!solution) {
      return res.status(404).json({
        status: false,
        message: "Solution not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Solution retrieved successfully",
      data: solution,
    });
  } catch (error) {
    
    return res.status(500).json({
      status: false,
      message: "Error retrieving solution",
      error: error.message,
    });
  }
};
