const config = require("../../config");
const sendEmail = require("../../utilts/sendEmail");

const { createToken } = require("../../utilts/tokenGenerate");
const verificationCodeTemplate = require("../../utilts/verificationCodeTemplate");
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

const forgotPassword = async (email) => {
  if (!email) throw new Error("Email is required");

  const isExistingUser = await User.findOne({ email });
  if (!isExistingUser) throw new Error("User not found");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);

  const otpExpires = new Date(Date.now() + 15 * 60 * 1000);

  isExistingUser.otp = hashedOtp;
  isExistingUser.otpExpires = otpExpires;
  await isExistingUser.save();

  const result = await sendEmail({
    to: email,
    subject: "Quantivo - Password Reset OTP",
    html: verificationCodeTemplate(otp),
  });

  return result;
};

const verifyToken = async (otp, email) => {
  if (!otp || !email) throw new Error("OTP and email are required");

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

const authService = {
  loginUser,
  forgotPassword,
  verifyToken,
};

module.exports = authService;
