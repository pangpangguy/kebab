const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Kebab = require("./models/kebab");

//Database
mongoose.connect("mongodb://localhost:27017/kebab-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection failed"));
db.once("open", () => {
  console.log("Kebab database connected");
});

//The app
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/newkebab", async (req, res) => {
  const kebab = new Kebab({
    title: "Odessy",
    description: "Cheapest Kebab around!",
    location: "Place de la Rue",
  });
  await kebab.save();
  res.send(kebab);
});
app.listen(3000, () => {
  console.log("Listening on port 3000...");
});
