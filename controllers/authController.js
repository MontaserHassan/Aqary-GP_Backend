const User = require('./../models/userModel');
// const catchAsync = require('./../utils/catchAsync');
const { asyncFunction }= require('./../middlewares/asyncHandler');

exports.signup = asyncFunction(async (req, res, next) => {
    const newUser = await User.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            user: newUser
        }
    });

});