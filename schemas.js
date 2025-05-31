const Joi = require('joi');
const { number } = require('joi');


module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        location: Joi.string().required(),
        discription: Joi.string()
    }).required(), deleteImages: Joi.array()
}).unknown();

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(0).max(10),
        body: Joi.string().required()
    }).required()
})