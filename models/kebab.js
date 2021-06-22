const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const kebabSchema = new Schema({
  name: String,
  description: String,
  location: String,
});

module.exports = mongoose.model("Kebab", kebabSchema);
