const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const { asyncFunction } = require('./../middlewares/asyncHandler');
const sendEmail = require('./../utils/email');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
};

exports.signup = asyncFunction(async (req, res, next) => {
    try {

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

    createSendToken(newUser, 201, res);

    }catch (err) {
        if (err.code === 11000){
            const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
            console.log("ana value", value);
            const message = `Duplicate field value: ${value}. Please use another value!`;
            // const message = `Phone number "${req.body.phoneNumber}" is already in use. Please use another phone number.`;
            throw { status: 400, message: message};
        }

        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(el => el.message);
            console.log(errors);
            const message = `${errors.join('. ')}`;
            throw { status: 400, message: message };
        }

        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        });

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

    //3) If everthing ok, send token to client
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token,
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            birthdate: user.birthdate,
            roleId: user.roleId || null
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

exports.forgotPassword = asyncFunction(async (req, res, next) => {
    //1)Get user based on posted email
    const user = await User.findOne({email: req.body.email});
    if(!user) throw { status: 404, message: 'There is no user with that email address.' };


  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/auth/forgotPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    throw { status: 500, message: 'There was an error sending the email. Try again later!'};
    }
});

exports.resetPassword = asyncFunction(async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
  
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });
  
    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      throw {status: 400 , message:'Token is invalid or has expired' }
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
  
    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    });
    
  });

  exports.updatePassword = asyncFunction(async (req, res, next) => {
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');
  
    // 2) Check if POSTed current password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        throw {status: 401 , message:'Your current password is wrong.' }
    }
  
    // 3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    // User.findByIdAndUpdate will NOT work as intended!
  
    // 4) Log user in, send JWT
    createSendToken(user, 200, res);
  });