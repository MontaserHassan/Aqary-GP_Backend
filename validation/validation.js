/* eslint-disable no-multiple-empty-lines */
/* eslint-disable indent */
/* eslint-disable function-paren-newline */
/* eslint-disable no-shadow */
/* eslint-disable no-throw-literal */
/* eslint-disable quotes */
/* eslint-disable implicit-arrow-linebreak */
const Joi = require("joi");
const { asyncFunction } = require("../middlewares/asyncHandler");


const validation = (schema) => asyncFunction(async (req, res, next) => {
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


const categoryValidation = {
  createCategory: {
    body: Joi.object().keys({
      name: Joi.string().required(),
    }),
  },
  updateCategory: {
    body: Joi.object().keys({
      name: Joi.string(),
    }),
    params: Joi.object().keys({
      categoryId: Joi.string().required().length(24),
    })
  },
  deleteCategory: {
    params: Joi.object().keys({
      categoryId: Joi.string().required().length(24),
    }),
  },
  getCategoryById: {
    params: Joi.object().keys({
      categoryId: Joi.string().required().length(24),
    }),
  },
  getPropertiesByCategoryId: {
    params: Joi.object().keys({
      categoryId: Joi.string().required().length(24),
    }),
  },
};


const propertyValidator = {
  createProperty: {
    body: Joi.object().keys({
      address: Joi.string().required(),
      city: Joi.string().required(),
      categoryId: Joi.string().required().length(24),
      level: Joi.number().integer().required(),
      rooms: Joi.number().integer().required(),
      baths: Joi.number().integer().required(),
      area: Joi.number().integer().required(),
      description: Joi.string().required(),
      price: Joi.number().required(),
      contractPhone: Joi.string().required(),
      paymentOption: Joi.string().required().valid("cash", "master-card"),
      subscribe: Joi.string().required().valid("half", "hour", "day", "week", "month"),
    }),
  },
  updateProperty: {
    body: Joi.object().keys({
      address: Joi.string(),
      title: Joi.string(),
      city: Joi.string(),
      categoryId: Joi.string().length(24),
      level: Joi.number().integer(),
      rooms: Joi.number().integer(),
      baths: Joi.number().integer(),
      area: Joi.number().integer(),
      description: Joi.string(),
      price: Joi.number(),
      contractPhone: Joi.string(),
      paymentOption: Joi.string().valid("cash", "master-card"),
    }),
    params: Joi.object()
      .required()
      .keys({
        id: Joi.string().length(24).required(),
      }),
  },
  searching: {
    params: Joi.object().required().keys({
      city: Joi.string(),
    }),
  },
  idParams: {
    params: Joi.object().required().keys({
      id: Joi.string().length(24).required(),
    }),
  },
};



module.exports = {
  validation,
  propertyValidator,
  categoryValidation,
};