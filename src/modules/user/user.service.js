const User = require("./user.model");

const createUserInDb = async (payload) => {
  const result = await User.create(payload);
  return result;
};

const userService = {
  createUserInDb,
};

module.exports = userService;
