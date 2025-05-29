const User = require("./user.model");

const createUserInDb = async (payload) => {
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) throw new Error("User already exist");

  const result = await User.create(payload);
  return result;
};

const getAllUsersFromDb = async () => {
  const users = await User.find({});
  return users;
};

const getMyProfileFromDb = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  return user;
};

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
