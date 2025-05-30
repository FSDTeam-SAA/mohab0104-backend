const config = require("../../config");
const { createToken } = require("../../utilts/tokenGenerate");
const User = require("./user.model");

const createUserInDb = async (payload) => {
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) throw new Error("User already exist");

  const result = await User.create(payload);

  const JwtPayload = {
    userId: result._id,
    email: result.email,
    role: result.role,
  };

  const accessToken = createToken(
    JwtPayload,
    config.JWT_SECRET,
    config.JWT_EXPIRES_IN
  );

  return { accessToken };
};

const getAllUsersFromDb = async () => {
  const users = await User.find({}).select("-password -otp -otpExpires");
  return users;
};

// not complete
const getMyProfileFromDb = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  return user;
};

// not complete
const deleteUserById = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) throw new Error("User not found");
  return user;
};

const userService = {
  createUserInDb,
  getAllUsersFromDb,
  getMyProfileFromDb,
  deleteUserById,
};

module.exports = userService;
