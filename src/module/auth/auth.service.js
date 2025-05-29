const config = require("../../config");
const { createToken } = require("../../utilts/tokenGenerate");
const User = require("../user/user.model");
const bcrypt = require("bcryptjs");

const loginUser = async (payload) => {
  const isExistingUser = await User.findOne({
    email: payload.email,
  });
  if (!isExistingUser) throw new Error("User not found");

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    isExistingUser.password
  );
  if (!isPasswordMatched) throw new Error("Invalid password");

  const JwtToken = {
    userId: isExistingUser._id,
    email: isExistingUser.email,
    role: isExistingUser.role,
  };

  const accessToken = createToken(
    JwtToken,
    config.JWT_SECRET,
    config.JWT_EXPIRES_IN
  );

  return {
    accessToken,
  };
};

const authService = {
  loginUser,
};

module.exports = authService;
