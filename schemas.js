const Joi = require("joi");

const kebabSchema = Joi.object({
  kebab: Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
});

module.exports.kebabSchema = kebabSchema;

const reviewSchema = Joi.object({
  review: Joi.object({
    body: Joi.string().required(),
    rating: Joi.number().required().min(0).max(5),
  }).required(),
});

module.exports.reviewSchema = reviewSchema;
