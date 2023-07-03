const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const { asyncFunction } = require('./../middlewares/asyncHandler');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

exports.signup = asyncFunction(async (req, res, next) => {
    const newUser = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });

});

exports.login = asyncFunction(async (req, res, next) => {
    const { email, password } = req.body;

    //1) Check if email and password exist
    if (!email || !password) {
        //    return next(new AppError('Please provide email and password!', 400));
        throw { status: 400, message: 'Please provide email and password!' };
    }

    //2)Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        // return next(new AppError('Incorrect email or password', 401));
        throw { status: 401, message: 'Incorrect email or password' };
    }
    // console.log(user);

    //3) If everthing ok, send token to client
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token,
        user: {
            email: user.email
        }
    })
});

exports.protect = asyncFunction(async (req, res, next) => {

    //1) Getting token and check of it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        throw { status: 401, message: 'You are not logged in! Please log in to get access.' };
    }

    //2) Verification token
    let decoded
    try {

        decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    } catch (err) {
        if (err.name === 'JsonWebTokenError') throw { status: 401, message: 'Invalid token. Please log in again!' };
        if (err.name === 'TokenExpiredError') throw { status: 401, message: 'Your token has expired!. Please log in again!' };
    }
    //3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    
    if (!currentUser) throw { status: 401, message: 'The user belonging to this token does not longer exist!' };

    //4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) throw { status: 401, message: 'User recently changed password! please log in again.' };

    //Grant access to protected route
    req.user = currentUser;
    next();
}); 