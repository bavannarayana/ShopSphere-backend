const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      lowercase: true,
      required: true,
    },
    lastName: {
      type: String,
      lowercase: true,
      required: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw Error("Please enter valid Email address");
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isMobilePhone(value, "en-IN")) {
          throw new Error("Enter valid phone number");
        }
      },
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
