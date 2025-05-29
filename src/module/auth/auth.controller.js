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

const authController = {
  loginUser,
};

module.exports = authController;
