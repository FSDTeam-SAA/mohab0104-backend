const config = require("../../config");
const { companyName } = require("../../lib/companyName");
const sendEmail = require("../../utilts/sendEmail");
const { createToken } = require("../../utilts/tokenGenerate");
const verificationCodeTemplate = require("../../utilts/verificationCodeTemplate");
const User = require("../user/user.model");
const bcrypt = require("bcryptjs");

const loginUser = async (payload) => {
  const isExistingUser = await User.findOne({
    email: payload.email,
  }).select("+password");

  if (!isExistingUser) {
    throw new Error("User not found");
  }

  if (!isExistingUser.isVerified) {
    throw new Error("Please verify your email");
  }

  // console.log("Plain password:", payload.password);
  // console.log("Hashed password in DB:", isExistingUser.password);

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    isExistingUser.password
  );

  if (!isPasswordMatched) {
    throw new Error("Invalid password");
  }

  const userObj = isExistingUser.toObject();
  delete userObj.password;
  delete userObj.otp;
  delete userObj.otpExpires;

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
    user: userObj,
  };
};


const forgotPassword = async (email) => {
  if (!email) throw new Error("Email is required");

  const isExistingUser = await User.findOne({ email });
  if (!isExistingUser) throw new Error("User not found");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

  isExistingUser.otp = hashedOtp;
  isExistingUser.otpExpires = otpExpires;
  await isExistingUser.save();

  await sendEmail({
    to: email,
    subject: `${companyName} - Password Reset OTP`,
    html: verificationCodeTemplate(otp),
  });

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

  return { accessToken };
};

const verifyToken = async (otp, email) => {
  if (!otp) throw new Error("OTP are required");

  const isExistingUser = await User.findOne({ email });
  if (!isExistingUser) throw new Error("User not found");

  if (!isExistingUser.otp || !isExistingUser.otpExpires) {
    throw new Error("OTP not requested or expired");
  }

  if (isExistingUser.otpExpires < new Date()) {
    throw new Error("OTP has expired");
  }

  const isOtpMatched = await bcrypt.compare(otp.toString(), isExistingUser.otp);
  if (!isOtpMatched) throw new Error("Invalid OTP");

  isExistingUser.otp = undefined;
  isExistingUser.otpExpires = undefined;
  await isExistingUser.save();

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

  return { accessToken };
};

const resetPassword = async (payload, email) => {
  if (!payload.newPassword) {
    throw new Error("Email and new password are required");
  }

  const isExistingUser = await User.findOne({ email });
  if (!isExistingUser) throw new Error("User not found");

  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcryptSaltRounds)
  );

  const result = await User.findOneAndUpdate(
    { email },
    {
      password: hashedPassword,
      otp: undefined,
      otpExpires: undefined,
    },
    { new: true }
  ).select("-password -otp -otpExpires");

  return result;
};

const changePassword = async (payload, email) => {
  const { currentPassword, newPassword } = payload;
  if (!currentPassword || !newPassword) {
    throw new Error("Current and new passwords are required");
  }
  console.log("first", email)

  const isExistingUser = await User.findOne({ email });
  console.log("first", isExistingUser)
  if (!isExistingUser) throw new Error("User not found");

  const isPasswordMatched = await bcrypt.compare(
    currentPassword,
    isExistingUser.password
  )
  if (!isPasswordMatched) throw new Error("Invalid current password");

  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcryptSaltRounds)
  );

  const result = await User.findOneAndUpdate(
    { email },
    {
      password: hashedPassword,
    },
    { new: true }
  ).select("-password -otp -otpExpires");
  return result;
};

const authService = {
  loginUser,
  forgotPassword,
  verifyToken,
  resetPassword,
  changePassword,
};

module.exports = authService;
