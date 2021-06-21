const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const kebabSchema = new Schema({
  title: String,
  description: String,
  location: String,
});

module.exports = mongoose.model("Kebab", kebabSchema);
