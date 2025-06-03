const config = require("../../config");
const { sendImageToCloudinary } = require("../../utilts/cloudnary");
const sendEmail = require("../../utilts/sendEmail");
const { createToken } = require("../../utilts/tokenGenerate");
const verificationCodeTemplate = require("../../utilts/verificationCodeTemplate");
const paymentInfo = require("../payments/payment.model");
const User = require("./user.model");
const bcrypt = require("bcryptjs");

const createUserInDb = async (payload) => {
  const existingUser = await User.findOne({ email: payload.email });

  if (existingUser && existingUser.isVerified) {
    throw new Error("User already exists and is verified");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

  let result;

  if (existingUser && !existingUser.isVerified) {
    existingUser.otp = hashedOtp;
    existingUser.otpExpires = otpExpires;
    await existingUser.save();
    result = existingUser;
  } else {
    const newUser = new User({
      ...payload,
      otp: hashedOtp,
      otpExpires,
      isVerified: false,
    });
    result = await newUser.save();
  }

  await sendEmail({
    to: result.email,
    subject: "Verify your email",
    html: verificationCodeTemplate(otp),
  });

  const JwtToken = {
    userId: result._id,
    email: result.email,
    role: result.role,
  };
  const accessToken = createToken(
    JwtToken,
    config.JWT_SECRET,
    config.JWT_EXPIRES_IN
  );

  return { accessToken };
};

const verifyUserEmail = async (payload, email) => {
  const { otp } = payload;
  if (!otp) throw new Error("OTP is required");

  const existingUser = await User.findOne({ email });
  if (!existingUser) throw new Error("User not found");

  if (!existingUser.otp || !existingUser.otpExpires) {
    throw new Error("OTP not requested or expired");
  }

  if (existingUser.otpExpires < new Date()) {
    throw new Error("OTP has expired");
  }

  if (existingUser.isVerified === true) {
    throw new Error("User already verified");
  }

  const isOtpMatched = await bcrypt.compare(otp.toString(), existingUser.otp);
  if (!isOtpMatched) throw new Error("Invalid OTP");

  // Clear OTP and OTP expiration after successful verification
  existingUser.otp = undefined;
  existingUser.otpExpires = undefined;
  await existingUser.save();

  await User.findOneAndUpdate(
    { email },
    { isVerified: true, otp: undefined, otpExpires: undefined },
    { new: true }
  );
  return {
    success: true,
  };
};

const resendOtpCode = async (payload, email) => {
  const existingUser = await User.findOne({ email });
  if (!existingUser) throw new Error("User not found");

  if (existingUser.isVerified) {
    throw new Error("User already verified");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

  existingUser.otp = hashedOtp;
  existingUser.otpExpires = otpExpires;
  await existingUser.save();

  await sendEmail({
    to: existingUser.email,
    subject: "Verify your email",
    html: verificationCodeTemplate(otp),
  });
  return {
    success: true,
  };
};

const getAllUsersFromDb = async () => {
  const users = await User.find({ isVerified: true }).select(
    "-password -otp -otpExpires"
  );
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

const getAdminDashboardStatsFromDb = async () => {
  const totalUsers = await User.countDocuments();

  const totalBookings = await paymentInfo.countDocuments({
    status: "success",
  });

  const totalRevenue = await paymentInfo.aggregate([
    {
      $match: { status: "success" },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  return {
    totalUsers,
    totalBookings,
    totalRevenue: totalRevenue[0]?.totalAmount || 0,
  };
};

const userService = {
  createUserInDb,
  verifyUserEmail,
  resendOtpCode,
  getAllUsersFromDb,
  getMyProfileFromDb,
  updateUserProfile,
  getAdminDashboardStatsFromDb,
};

module.exports = userService;
