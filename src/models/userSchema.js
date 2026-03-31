const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      lowercase: true,
    },
    lastName: {
      type: String,
      lowercase: true,
    },
    dateOfBirth: {
      typeof: String,
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
    },
    phoneNumber: {
      type: Number,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
