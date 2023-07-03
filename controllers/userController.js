const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const { asyncFunction } = require('../middlewares/asyncHandler');

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users
      }
    });
  });

  exports.updateUserInfo = asyncFunction(async (req, res, next) => {
    //1) Create error if user posts password data
      if(req.body.password || req.body.passwordConfirm) throw{ status: 400, message: 'This route is not for password update!'};
    //2) Update user document
    res.status(200).json({
      status: 'success'
    })
  }) 