const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const config = require("../../config");

const userModel = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    imageLink: {
      type: String,
      default: "",
    },
    otp: { type: String, default: null },
    otpExpires: { type: Date, default: null },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    country: {
      type: String,
      default: "",
    },
    cityOrState: {
      type: String,
      default: "",
    },
    roadOrArea: {
      type: String,
      default: "",
    },
    postalCode: {
      type: String,
      default: "",
    },
  },
  { timestamps: true, versionKey: false }
);

userModel.pre("save", async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcryptSaltRounds)
  );
  next();
});

userModel.post("save", function (doc, next) {
  doc.password = "";
  next();
});

const User = model("User", userModel);

module.exports = User;
