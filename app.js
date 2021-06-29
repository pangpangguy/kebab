const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Kebab = require("./models/kebab");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const { kebabSchema } = require("./schemas.js");

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

//The app initialization
const app = express();

//use ejs-mate as ejs engine instead of default
app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validateKebab = (req, res, next) => {
  const validationError = kebabSchema.validate(req.body);
  if (validationError.error) {
    //console.log(validationError);
    //error.details is an array of objects. We take the message attribute
    //of each object and join them into a string with ','
    const errorMessage = validationError.error.details.map((el) => el.message).join(",");
    throw new ExpressError(errorMessage, 400);
  } else {
    next();
  }
};

//HTTP Requests
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/kebabs", async (req, res) => {
  const allKebabs = await Kebab.find({});
  res.render("kebabs/index", { allKebabs });
});

app.get("/kebabs/new", (req, res) => {
  res.render("kebabs/new");
});

app.get(
  "/kebabs/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const kebab = await Kebab.findById(id);
    res.render("kebabs/show", { kebab });
  })
);

app.post(
  "/kebabs",
  validateKebab,
  catchAsync(async (req, res, next) => {
    //if (!req.body.kebab) {
    //throw new ExpressError("Invalid kebab data", 400);
    //}
    const newKebab = new Kebab(req.body.kebab);
    await newKebab.save();
    res.redirect("/kebabs");
  })
);

app.get(
  "/kebabs/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const kebab = await Kebab.findById(id);
    res.render("kebabs/edit", { kebab });
  })
);

app.put(
  "/kebabs/:id",
  validateKebab,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const updatedKebab = await Kebab.findByIdAndUpdate(id, { ...req.body.kebab });
    res.redirect(`/kebabs/${updatedKebab._id}`);
  })
);

app.delete(
  "/kebabs/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Kebab.findByIdAndDelete(id);
    res.redirect("/kebabs");
  })
);

//This runs if nothing matches
app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  //Default code and message
  if (!err.message) {
    err.message = "Something went wrong!";
  }
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});
