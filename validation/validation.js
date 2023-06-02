const Joi = require("joi");
const asyncFunction = require("../middlewares/async");

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
    createProperty: {},
    updateProperty: {},
};

module.exports = {
    validation,
    propertyValidator,
};
