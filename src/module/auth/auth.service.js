const config = require("../../config");
const { companyName } = require("../../lib/companyName");
const sendEmail = require("../../utilts/sendEmail");
const { createToken } = require("../../utilts/tokenGenerate");
const verificationCodeTemplate = require("../../utilts/verificationCodeTemplate");
const User = require("../user/user.model");
const bcrypt = require("bcryptjs");

const loginUser = async (payload) => {
  console.log("Login Payload:", payload);
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

const forgotPassword = async (email) => {
  if (!email) throw new Error("Email is required");

  const isExistingUser = await User.findOne({ email });
  if (!isExistingUser) throw new Error("User not found");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);
  const otpExpires = new Date(Date.now() + 15 * 60 * 1000);
  // const otpExpires = new Date(Date.now() + 2 * 60 * 1000);

  isExistingUser.otp = hashedOtp;
  isExistingUser.otpExpires = otpExpires;
  await isExistingUser.save();

  const JWtToken = {
    userId: isExistingUser._id,
    email: isExistingUser.email,
    role: isExistingUser.role,
  };

  const accessToken = createToken(
    JWtToken,
    config.JWT_SECRET,
    config.JWT_EXPIRES_IN
  );

  await sendEmail({
    to: email,
    subject: `${companyName} - Password Reset OTP`,
    html: verificationCodeTemplate(otp),
  });

  return {
    accessToken,
    // result,
  };
};

const verifyToken = async (otp, email) => {
  if (!otp) throw new Error("OTP and email are required");

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

  const isExistingUser = await User.findOne({ email });
  if (!isExistingUser) throw new Error("User not found");

  const isPasswordMatched = await bcrypt.compare(
    currentPassword,
    isExistingUser.password
  );
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
