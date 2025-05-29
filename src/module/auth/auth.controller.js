const authService = require("./auth.service");

const loginUser = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);

    return res.status(200).json({
      success: true,
      message: "Token sent to your email",
      //   data: result,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const verifyToken = async (req, res) => {
  try {
    const { otp, email } = req.body;
    const result = await authService.verifyToken(otp, email);

    return res.status(200).json({
      success: true,
      message: "Token verified successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const authController = {
  loginUser,
  forgotPassword,
  verifyToken,
};

module.exports = authController;
