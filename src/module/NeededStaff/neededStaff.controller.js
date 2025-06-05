const User = require("../user/user.model");
const NeededStaff = require("./neededStaff.model");

exports.createNeededStaff = async (req, res) => {
  try {
    const { email: userEmail } = req.user; // Assuming user email is available in req.user
    if (!userEmail) {
      return res.status(400).json({
        status: false,
        message: "User not found.",
      });
    }
    const {
      firstName,
      lastName,
      companyName,
      businessEmail,
      staffDescription,
    } = req.body;
    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !companyName ||
      !businessEmail ||
      !staffDescription
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newStaff = new NeededStaff({
      firstName, // Assuming staffName is a full name
      lastName, // Handling case where only one name is provided
      companyName,
      businessEmail,
      staffDescription,
    });

    await newStaff.save();
    return res.status(201).json({
      status: true,
      message: "Staff member created successfully",
      data: newStaff,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating staff member", error: error.message });
  }
};

// Get all staff members
exports.getAllNeededStaff = async (req, res) => {
  try {
    const { email: userEmail } = req.user; // Assuming user email is available in req.user
    if (!userEmail) {
      return res.status(400).json({
        status: false,
        message: "User not found.",
      });
    }
    const staffMembers = await NeededStaff.find();
    return res.status(200).json({
      status: true,
      message: "Staff members retrieved successfully",
      data: staffMembers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving staff members",
      error: error.message,
    });
  }
};
// Get a single staff member by user
exports.getNeededStaffByUser = async (req, res) => {
  try {
    const { email: userEmail } = req.user; // Assuming user email is available in req.user
    const isExist = await User.findOne({ email: userEmail });
    if (!isExist) {
      return res.status(400).json({
        status: false,
        message: "User not found.",
      });
    }

    const staffMember = await NeededStaff.findOne({ businessEmail: userEmail });
    if (!staffMember) {
      return res.status(404).json({ message: "Staff member not found" });
    }
    return res.status(200).json({
      status: true,
      message: "Staff member retrieved successfully",
      data: staffMember,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving staff member by user",
      error: error.message,
    });
  }
};
//git a single staff member by ID
exports.getSingleNeededStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const staffMember = await NeededStaff.findById(id);
    if (!staffMember) {
      return res.status(404).json({ message: "Staff member not found" });
    }
    return res.status(200).json({
      status: true,
      message: "Staff member retrieved successfully",
      data: staffMember,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving staff member", error: error.message });
  }
};

// Update a staff member by ID
exports.updateNeededStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      businessEmail,
      companyName,
      staffDescription,
      answer,
    } = req.body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !companyName ||
      !businessEmail ||
      !staffDescription
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedStaff = await NeededStaff.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        businessEmail,
        companyName,
        staffDescription,
        answer, // Assuming 'answer' is part of the request body
      },
      { new: true }
    );

    if (!updatedStaff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    return res.status(200).json({
      status: true,
      message: "Staff member updated successfully",
      data: updatedStaff,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating staff member", error: error.message });
  }
};

// Delete a staff member by ID

exports.deleteNeededStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStaff = await NeededStaff.findByIdAndDelete(id);

    if (!deletedStaff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    return res.status(200).json({
      status: true,
      message: "Staff member deleted successfully",
      data: deletedStaff,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting staff member", error: error.message });
  }
};
