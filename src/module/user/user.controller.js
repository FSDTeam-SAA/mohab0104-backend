const userService = require("./user.service");

const createUser = async (req, res) => {
  try {
    const result = await userService.createUserInDb(req.body);

    return res.status(200).json({
      success: true,
      message: "User created successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsersFromDb();
    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

//! My Profile only for logged in user and get his own profile______________
//! No own cannot access other user profile
//! This is a protected route, so you need to be logged in to access it

const getMyProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await userService.getUserById(userId);
    return res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

//TODO: Note: [const userId = req.user._id] when token generated, it will be added to the req object by the middleware.
//TODO: Also check in controller where user this userId
//TODO: also descuss it's soft delete or hard delete.....

const deletedUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await userService.deleteUserById(userId);
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const userController = {
  createUser,
  getAllUsers,
  getMyProfile,
  deletedUser,
};

module.exports = userController;
