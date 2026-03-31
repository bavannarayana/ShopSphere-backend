const mongoose = require("mongoose");

async function dbConnect(params) {
  await mongoose.connect(
    "mongodb+srv://kbavannarayana_db_user:Bobby123%40@cluster0.dc4yeg0.mongodb.net/shopsphere",
  );
}
module.exports = dbConnect;
