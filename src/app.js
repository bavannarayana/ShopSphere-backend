const express = require("express");
const app = express();
const cors = require("cors");
const User = require("./models/userSchema");
const bcrypt = require("bcrypt");

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  const users = await User.find();
  console.log("API running");
  res.send("Hey");
});

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, email, password, phoneNumber } =
      req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User({
      firstName,
      lastName,
      dateOfBirth,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    await user.save();

    res.send("signed up");
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

module.exports = app;
