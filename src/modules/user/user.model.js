const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const config = require("../../config");

const userModel = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
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
    role: {
      type: String,
      enum: ["admin", "company"],
      default: "company",
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
    taxId: {
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

module.exports = User = model("User", userModel);
