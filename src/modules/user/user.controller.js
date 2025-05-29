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

const userController = {
  createUser,
};

module.exports = userController;
