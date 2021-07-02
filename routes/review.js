//Express router
const express = require("express");
//Express router keeps params separate.
//To have access the :id defined in the prefix, set mergeParams to true
const router = express.Router({ mergeParams: true });

//Utility functions
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

//Models and Schema (Joi)
const Kebab = require("../models/kebab");
const Review = require("../models/review");
const { reviewSchema } = require("../schemas.js");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errorMessage = validationError.error.details.map((el) => el.message).join(",");
    throw new ExpressError(errorMessage, 400);
  } else {
    next();
  }
};

//Reviews
router.post(
  "/",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const review = new Review(req.body.review);
    const kebab = await Kebab.findById(id);
    kebab.reviews.push(review);
    await review.save();
    await kebab.save();
    req.flash("success", "Review successfully created!");
    res.redirect(`/kebabs/${id}`);
  })
);

router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    //$pull : {x: y}
    //Pull all elements from x that matches y
    await Kebab.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review successfully deleted!");
    res.redirect(`/kebabs/${id}`);
  })
);

module.exports = router;
