const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Kebab = require("./models/kebab");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");

//utility
const ExpressError = require("./utils/ExpressError");

//Routers
const kebabsRouter = require("./routes/kebab");
const reviewsRouter = require("./routes/review");

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

//App initialization
const app = express();

//use ejs-mate as ejs engine instead of default
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//Static files
app.use(express.static(path.join(__dirname, "public")));

//Session. (Note: Make sure this comes before the routers!)
const sessionConfig = {
  secret: "somesecretforsessionnotsafe",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expire: Date.now() + 1000 * 60 * 60 * 24 * 7, //1 week from now
  },
};
app.use(session(sessionConfig));
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//HTTP Requests...

//Use the kebab router, and prefixe everything with /kebabs
app.use("/kebabs", kebabsRouter);
app.use("/kebabs/:id/reviews", reviewsRouter);
app.get("/", (req, res) => {
  res.render("home");
});

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
