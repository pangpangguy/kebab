//Express router
const express = require("express");
const router = express.Router();

//Utility functions
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

//Models and Schema (Joi)
const Kebab = require("../models/kebab");
const Review = require("../models/review");
const { kebabSchema } = require("../schemas.js");

//Kebab validation
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

/**Kebabs */
router.get("/", async (req, res) => {
  const allKebabs = await Kebab.find({});
  res.render("kebabs/index", { allKebabs });
});

router.get("/new", (req, res) => {
  res.render("kebabs/new");
});

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const kebab = await Kebab.findById(id).populate("reviews");
    if (!kebab) {
      req.flash("error", "Kebab not found!");
      return res.redirect("/kebabs");
    }
    res.render("kebabs/show", { kebab });
  })
);

router.post(
  "/",
  validateKebab,
  catchAsync(async (req, res, next) => {
    //if (!req.body.kebab) {
    //throw new ExpressError("Invalid kebab data", 400);
    //}
    const newKebab = new Kebab(req.body.kebab);
    await newKebab.save();
    req.flash("success", "Kebab creation successfull!");
    res.redirect(`/kebabs/${newKebab._id}`);
  })
);

router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const kebab = await Kebab.findById(id);
    res.render("kebabs/edit", { kebab });
  })
);

router.put(
  "/:id",
  validateKebab,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const updatedKebab = await Kebab.findByIdAndUpdate(id, { ...req.body.kebab });
    req.flash("success", "Update successfull!");
    res.redirect(`/kebabs/${updatedKebab._id}`);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Kebab.findByIdAndDelete(id);
    req.flash("success", "Kebab successfully deleted!");
    res.redirect("/kebabs");
  })
);

module.exports = router;
