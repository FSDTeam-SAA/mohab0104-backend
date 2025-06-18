const config = require("../../config");
const userService = require("./user.service");

const createUser = async (req, res) => {
  try {
    const result = await userService.createUserInDb(req.body);

    const { refreshToken, accessToken } = result;
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: config.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "User created successfully, please verify your email",
      data: {
        accessToken,
      },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email } = req.user;
    const result = await userService.verifyUserEmail(req.body, email);
    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const resendOtpCode = async (req, res) => {
  try {
    const result = await userService.resendOtpCode(req.user);

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully",
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

const getMyProfile = async (req, res) => {
  try {
    const { email } = req.user;
    const user = await userService.getMyProfileFromDb({ email });

    return res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { email } = req.user;
    const result = await userService.updateUserProfile(
      req.body,
      email,
      req.file
    );

    return res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getAdminDashboardStats = async (req, res) => {
  try {
    const result = await userService.getAdminDashboardStatsFromDb();

    return res.status(200).json({
      success: true,
      message: "Admin dashboard stats retrieved successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const userController = {
  createUser,
  verifyEmail,
  resendOtpCode,
  getAllUsers,
  getMyProfile,
  updateUserProfile,
  getAdminDashboardStats,
};

module.exports = userController;
