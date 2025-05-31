const config = require("../../config");
const { sendImageToCloudinary } = require("../../utilts/cloudnary");
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

const getMyProfileFromDb = async (email) => {
  const user = await User.findOne(email).select("-password -otp -otpExpires");
  if (!user) throw new Error("User not found");
  return user;
};

const updateUserProfile = async (payload, email, file) => {
  const isExistingUser = await User.findOne({ email });
  if (!isExistingUser) throw new Error("User not found");

  if (file) {
    const imageName = `${Date.now()}-${file.originalname}`;
    const path = file?.path;
    const { secure_url } = await sendImageToCloudinary(imageName, path);
    payload.imageLink = secure_url;
  }

  const updatedUser = await User.findOneAndUpdate(
    {
      email,
    },
    payload,
    { new: true }
  ).select("-password -otp -otpExpires");
  return updatedUser;
};

const userService = {
  createUserInDb,
  getAllUsersFromDb,
  getMyProfileFromDb,
  updateUserProfile,
};

module.exports = userService;
