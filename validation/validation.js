const Joi = require("joi");
const { asyncFunction } = require("../middlewares/asyncHandler");

const validation = (schema) =>
  asyncFunction(async (req, res, next) => {
    const errorValidation = [];
    ["params", "query", "body"].forEach((key) => {
      if (schema[key]) {
        const validation = schema[key].validate(req[key]);
        if (validation.error) {
          errorValidation.push(validation.error);
        }
      }
    });
    if (errorValidation.length > 0) {
      throw { status: 422, message: errorValidation[0].details[0].message };
    } else {
      next();
    }
  });

const propertyValidator = {
  createProperty: {
    body: Joi.object().keys({
      address: Joi.string().required(),
      city: Joi.string().required(),
      title: Joi.string().required().valid("villa", "shale", "apartment"),
      level: Joi.number().integer().required(),
      rooms: Joi.number().integer().required(),
      baths: Joi.number().integer().required(),
      area: Joi.number().integer().required(),
      description: Joi.string().required(),
      price: Joi.number().required(),
      contractPhone: Joi.string().required(),
      paymentOption: Joi.string().required().valid("cash", "master-card"),
      subscribe: Joi.string().required().valid("day", "week", "month"),
    }),
  },
  updateProperty: {
    body: Joi.object().keys({
      address: Joi.string().required(),
      city: Joi.string().required(),
      title: Joi.string().required().valid("villa", "shale", "apartment"),
      level: Joi.number().integer().required(),
      rooms: Joi.number().integer().required(),
      baths: Joi.number().integer().required(),
      area: Joi.number().integer().required(),
      description: Joi.string().required(),
      price: Joi.number().required(),
      contractPhone: Joi.string().required(),
      paymentOption: Joi.string().required().valid("cash", "master-card"),
      subscribe: Joi.string().required().valid("day", "week", "month"),
    }),
    params: Joi.object()
      .required()
      .keys({
        id: Joi.string().length(24).required(),
      }),
  },
};

module.exports = {
  validation,
  propertyValidator,
};
