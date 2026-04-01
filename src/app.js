const express = require("express");
const app = express();

require("dotenv").config();

const cors = require("cors");
const User = require("./models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

app.use(cors());
app.use(express.json());

// Sign Up
app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, email, password, phoneNumber } =
      req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exist!" });
    }

    const user = new User();

    const isStrongPassword = validator.isStrongPassword(req);

    if (!isStrongPassword) {
      return res.status(400).json({
        message:
          "Password must be 8+ chars with uppercase, lowercase, number, special char",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User({
      firstName,
      lastName,
      dateOfBirth,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    await newUser.save();

    res.send("User registration successful");
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const comparePassword = await user.comparePassword(password);

    if (!comparePassword) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const payload = {
      userId: user._id,
      firstname: user.firstName,
      userId: user._id,
    };

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, {
      expiresIn: "30d",
    });

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: "15m",
    });

    await user.save();

    res.cookie("shopsphere_refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    res.cookie("shopsphere_accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 15,
    });

    res.send("Login successful");
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = app;
