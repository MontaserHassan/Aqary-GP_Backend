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
    try{

        const newUser = await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber: req.body.phoneNumber,
            birthdate: req.body.birthdate,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        });
    
        newUser.password = undefined;
        newUser.__v = undefined;
    
        const token = signToken(newUser._id);
    
        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser
            }
        });

    }catch (err) {
        if (err.code === 11000){
            const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
            const message = `Duplicate field value: ${value}. Please use another value!`;
            throw { status: 400, message: message};
        }
        
        if (err.name === 'ValidationError'){
            const errors = Object.values(err.errors).map(el => el.message);
            console.log(errors);
            const message = `${errors.join('. ')}`;
            throw { status: 400, message: message};
        } 
            
    }

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
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            roleId: user.roleId || null,
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
    const currentUser = await User.findById(decoded.id).populate('roleId');
    
    if (!currentUser) throw { status: 401, message: 'The user belonging to this token does not longer exist!' };

    //4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) throw { status: 401, message: 'User recently changed password! please log in again.' };

    //Grant access to protected route
    req.user = currentUser;
    next();
}); 

exports.userInfo = asyncFunction(async (req, res, next) => {
    const userId = req.user._id;

     // Find the user data associated with the provided token
     const user = await User.findById(userId);

     // If user data is not found, send an error response
     if (!user) {
         throw { status: 404, message: 'User not found' };
     }
 
     // If user data is found, respond with it
     res.json({
         status: 'success',
         data: {
             user
         }
     });


}); 