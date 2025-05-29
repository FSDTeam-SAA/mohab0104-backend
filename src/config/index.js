require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  bcryptSaltRounds: process.env.BCRYPT_SALT_ROUNDS,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,

  email: {
    emailAddress: process.env.EMAIL_ADDRESS,
    emailPass: process.env.EMAIL_PASSWORD,
  },
};
